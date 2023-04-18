# Models for paper


# Models we need:

# for 1, 2a, 2b, 2c x {accuracy, reduction, listener-reduction, speed?, converge, diverge, ?distinctiveness}

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
         tangram_group=str_c(tangram, gameId))

acc_priors <- c(set_prior("normal(0,1)", class="b"),
                set_prior("normal(0,1)", class="sd"))#, #we're doing logistic, so these are reasonable b/c transform

model_1_acc<- brm(correct.num ~ block*numPlayers+(1|gameId), 
             family=bernoulli(link="logit"),
             data=acc_data |> filter(condition=="rotate"), 
             file=here(model_location, "acc_1"), prior=acc_priors, control=list(adapt_delta=.95))

model_2a_acc<- brm(correct.num ~ block+(1|gameId), 
                  family=bernoulli(link="logit"),
                  data=acc_data |> filter(condition=="no_rotate"), 
                  file=here(model_location, "acc_2a"), prior=acc_priors, control=list(adapt_delta=.95))

model_2b_acc<- brm(correct.num ~ block+(1|gameId), 
                  family=bernoulli(link="logit"),
                  data=acc_data |> filter(condition=="full_feedback"), 
                  file=here(model_location, "acc_2b"), prior=acc_priors, control=list(adapt_delta=.95))

model_2c_acc<- brm(correct.num ~ block+(1|gameId), 
                  family=bernoulli(link="logit"),
                  data=acc_data |> filter(condition=="emoji"), 
                  file=here(model_location, "acc_2c"), prior=acc_priors, control=list(adapt_delta=.95))

acc_3 <- acc_data |> filter(condition %in% c("2_thin", "2_thick", "6_thin", "6_thick")) |> 
                              separate(condition, into= c("gameSize","channel"))
                            
  
# pre-reg for 3: listener_accurate ~ block*channel*group_size + (block*channel*group_size|tangram)+ (1|tangram*group)+(block|group)
# breaking this pre-reg in the name of a model that doesn't take forever to fit...

model_3_acc<- brm(correct.num ~ block*gameSize*channel+(1|gameId), 
             family=bernoulli(link="logit"),
             data=acc_3, 
             file=here(model_location, "acc_3"), prior=acc_priors, control=list(adapt_delta=.95))

### Reduction models

red_data <- combined_chat |> filter(role=="speaker") |> 
  mutate(block=repNum,
         words=total_num_words)

     
red_priors <- c(
  set_prior("normal(12, 20)", class="Intercept"),
  set_prior("normal(0, 10)", class="b"),
  set_prior("normal(0, 5)", class="sd"),
  set_prior("lkj(1)",       class="cor"))

model_1_red <- brm(words ~ block*numPlayers + (block|tangram) + (1|playerId)+(1|tangram:gameId)+(block|gameId),
                   data=red_data |> filter(condition=="rotate"),
                   file=here(model_location, "red_1"),
                   prior=red_priors,
                   control=list(adapt_delta=.95))

model_2a_red <- brm(words ~ block + (block|tangram)+(1|tangram:gameId)+(block|gameId),
                   data=red_data |> filter(condition=="no_rotate"),
                   file=here(model_location, "red_2a"),
                   prior=red_priors,
                   control=list(adapt_delta=.95))

model_2b_red <- brm(words ~ block + (block|tangram)+(1|tangram:gameId)+(block|gameId),
                    data=red_data |> filter(condition=="full_feedback"),
                    file=here(model_location, "red_2a"),
                    prior=red_priors,
                    control=list(adapt_delta=.95))

model_2c_red <- brm(words ~ block + (block|tangram)+(1|tangram:gameId)+(block|gameId),
                    data=red_data |> filter(condition=="emoji"),
                    file=here(model_location, "red_2c"),
                    prior=red_priors,
                    control=list(adapt_delta=.95))
red_3 <- red_data |> filter(condition %in% c("2_thin", "2_thick", "6_thin", "6_thick")) |> 
  separate(condition, into= c("gameSize","channel"))

model_3_red <-  brm(words ~ block*channel*gameSize +   (block*channel*gameSize|tangram)+ (1|tangram:gameId)+ (block|gameId), 
                   data=red_3,
                   file=here(model_location,"red_3"),
                   control=list(adapt_delta=.95),
                   prior=red_priors)

# pre-reg for 1: 
#   words ~ block * player_count + (block|tangram) + (1|speaker)
# + (1|tangram*group)+(block|group)


#pre-reg for 2: words ~ block + (block|tangram)+ (1|tangram*group)+(block|group)


# pre-reg for 3 : words ~ block*channel*group_size + (block*channel*group_size|tangram)+ (1|tangram*group)+(block|group)


### weird thing we prereged in 1
# Model of whether speaker’s correct/incorrect answer in previous block  has an effect - 
#   
#   words ~ block*player_count + block*was_correct+ (block|tangram) + (1|speaker)
# + (1|tangram*group)+(block|group)

### SBERT models

# Additionally, we will analyse the effect of the language. Using SBERT embeddings we will embed the concatenation of everything the speaker said in a trial.
#We will then take pairwise cosine distances of these to look at the following effects. :

#   (divergence across games) For the same condition & block & tangram, distance between utterances from different games. 

# (divergence within games) For the same condition & block & game, distance between utterances for different tangrams.

# (convergence within games) For the same condition & game & tangram, distance between utterances from different blocks. 
#We plan to look at the similarities for block 1 with all later blocks; 
#block 6 with all earlier blocks; 
#and block N with block N+1. 


# Additionally, exclusive to the thin channel parts of this condition, we will analyse the distribution of emoji’s produced as a function of block and its relation to accuracy and speaker utterance length. 