# Exploratory mega-analytic models
# this is dumping all data together, looking at gameSize x thin v. everything else

# and we're going to do 
# 2thick as the baseline with larger and thinner and terms
# block is already 0 indexed

library(tidyverse)
library(brms)
library("here")
library(rstanarm)
library(rstan)
rstan_options(auto_write = TRUE)
options(mc.cores = parallel::detectCores())

model_location="code/paper_mods"
# Read data
source(here("code/prep_ms.R"))

#### Accuracy models

acc_data <- combined_results |> 
  group_by(playerId,repNum, gameId, numPlayers) %>% 
  mutate(correct.num=ifelse(correct,1,0)) %>% 
  mutate(block=repNum,
         tangram_group=str_c(tangram, gameId),
         gameSize=ifelse(condition %in% c("6_thick", "6_thin"),6,numPlayers)) |> 
  mutate(larger=gameSize-2,
         thinner=ifelse(condition %in% c("rotate","no_rotate", "full_feedback",
                                         "2_thick", "6_thick"),0,1))

acc_priors <- c(set_prior("normal(0,1)", class="b"),
                set_prior("normal(0,1)", class="sd")
                ) #we're doing logistic, so these are reasonable b/c transform

#acc_priors_me <- c(set_prior("normal(0,1)", class="b"),
#                set_prior("normal(0,1)", class="sd")
#) #we're doing logistic, so these are reasonable b/c transform

model_all_acc<- brm(correct.num ~ block*thinner*larger+(1|gameId), 
             family=bernoulli(link="logit"),
             data=acc_data, 
             file=here(model_location, "acc_meta"), prior=acc_priors, control=list(adapt_delta=.95))

### Reduction models

red_data <- combined_chat |> filter(role=="speaker") |> 
  mutate(block=repNum,
         words=total_num_words,
         gameSize=ifelse(condition %in% c("6_thick", "6_thin"),6,numPlayers)) |> 
  mutate(larger=gameSize-2,
         thinner=ifelse(condition %in% c("rotate","no_rotate", "full_feedback",
                                         "2_thick", "6_thick"),0,1))

red_priors <- c(
  set_prior("normal(12, 20)", class="Intercept"),
  set_prior("normal(0, 10)", class="b"),
  set_prior("normal(0, 5)", class="sd"),
  set_prior("lkj(1)",       class="cor")
  )


model_all_red <- brm(words ~ block*thinner*larger+(block|gameId),
                     data=red_data,
                     file=here(model_location, "mega_red"),
                     prior=red_priors,
                     control=list(adapt_delta=.95))




### SBERT models

# Additionally, we will analyse the effect of the language. Using SBERT embeddings we will embed the concatenation of everything the speaker said in a trial.
#We will then take pairwise cosine distances of these to look at the following effects. :


one_two_diverge <- read_rds(here("code/models/one_two_diverge.rds")) |> mutate(block=repNum)

three_diverge <- read_rds(here("code/models/three_diverge.rds")) |> 
  mutate(block=repNum, gameSize=str_sub(condition, 1, 1), channel=str_sub(condition, 2, -1))

###  (divergence across games) For the same condition & block & tangram, distance between utterances from different games. 

div_priors <- c(set_prior("normal(.5, .2)", class="Intercept"),
                set_prior("normal(0,.1)", class="b")#,
                #set_prior("normal(0,.05)", class="sd")
                )

mega_diverge <- one_two_diverge |> bind_rows(three_diverge) |> 
  mutate(gameSize=case_when(
    !is.na(gameSize)~as.numeric(gameSize),
    condition %in% c("2", "3", "4", "5", "6")~as.numeric(condition),
    condition %in% c("6noro", "6emoji", "6highfeed")~6,
    T ~ NA,
  ),
  larger=gameSize-2,
  thinner=case_when(
    condition %in% c("2thin", "6thin", "6emoji")~1,
    T ~ 0
  ))

model_all_div <- brm(sim ~ block*thinner*larger,
                        data=mega_diverge,
                        control=list(adapt_delta=.95),
                        file=here(model_location,"mega_div"),
                        prior=div_priors)


# (convergence within games) For the same condition & game & tangram, distance between utterances from different blocks. 
#block 6 with all earlier blocks; 




one_two_converge <- read_rds(here("code/models/one_two_converge.rds"))
three_converge <- read_rds(here("code/models/three_converge.rds"))|> 
  mutate(gameSize=str_sub(condition, 1, 1), channel=str_sub(condition, 2, -1))


mega_converge <- one_two_converge |> bind_rows(three_converge) |>  
  mutate(gameSize=case_when(
    !is.na(gameSize)~as.numeric(gameSize),
    condition %in% c("2", "3", "4", "5", "6")~as.numeric(condition),
    condition %in% c("6noro", "6emoji", "6highfeed")~6,
    T ~ NA,
  ),
  larger=gameSize-2,
  thinner=case_when(
    condition %in% c("2thin", "6thin", "6emoji")~1,
    T ~ 0
  ))

model_all_to_last<- brm(sim ~ earlier*larger*thinner,
                        data=mega_converge,
                        control=list(adapt_delta=.95),
                        file=here(model_location,"mega_tolast"),
                        prior=div_priors)






#### save reduced forms of models 

library(tidybayes)

save_summary <- function(model){
  intervals <- gather_draws(model, `b_.*`, regex=T) %>% mean_qi()
  
  stats <- gather_draws(model, `b_.*`, regex=T) %>% 
    mutate(above_0=ifelse(.value>0, 1,0)) %>% 
    group_by(.variable) %>% 
    summarize(pct_above_0=mean(above_0)) %>% 
    mutate(`P-value equivalent` = signif(2*pmin(pct_above_0,1-pct_above_0), digits=4)) %>% 
    left_join(intervals, by=".variable") %>% 
    mutate(lower=.lower,
           upper=.upper,
           Term=str_sub(.variable, 3, -1),
           Estimate=.value) %>% 
    select(Term, Estimate, lower, upper, `P-value equivalent`)
  
  stats
}


form <- function(model){
  dep <- as.character(model$formula[2])
  ind <- as.character(model$formula[3])
  
  str_c(dep," ~ ",ind) %>% str_replace_all(" ","") %>% 
    str_replace_all("\\*"," $\\\\times$ ") %>% 
    str_replace_all("\\+", "&nbsp;+ ") %>% 
    str_replace_all("~", "$\\\\sim$ ")
}

do_model <- function(path){
  model <- read_rds(here(model_location,path))
  save_summary(model) |> write_rds(here(model_location,"summary", path))
  model$formula |> write_rds(here(model_location, "formulae", path))
  print(summary(model))
}


mods <- list.files(path=here(model_location), pattern=".*rds") |> walk(~do_model(.))


