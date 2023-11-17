# Additional model: pre-listener commentary

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

#going to have to do some re-processing
# because the "combined_chat" is pre-summarized (in a generally useful way)

#group 1


#group 2a


#group 2b


# group 3


### logged reduction 
red_data <- combined_chat |> filter(role=="speaker") |> 
  mutate(block=repNum,
         log_words=log(total_num_words))

     
log_red_priors <- c(
  set_prior("normal(3, 3)", class="Intercept"),
  set_prior("normal(0, 3)", class="b"),
  set_prior("normal(0, 2)", class="sd"),
  set_prior("lkj(1)",       class="cor"))

model_1_red <- brm(log_words ~ block*numPlayers + (block|tangram) + (1|playerId)+(1|tangram:gameId)+(block|gameId),
                   data=red_data |> filter(condition=="rotate"),
                   file=here(model_location, "log_red_1"),
                   prior=log_red_priors,
                   control=list(adapt_delta=.95))

red_3 <- red_data |> filter(condition %in% c("2_thin", "2_thick", "6_thin", "6_thick")) |> 
  separate(condition, into= c("gameSize","channel"))

model_3_red <-  brm(log_words ~ block*channel*gameSize +   (block*channel*gameSize|tangram)+ (1|tangram:gameId)+ (block|gameId), 
                   data=red_3,
                   file=here(model_location,"log_red_3"),
                   control=list(adapt_delta=.95),
                   prior=log_red_priors)




