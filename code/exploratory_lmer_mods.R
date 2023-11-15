# Models for paper


# Models we need:

# for 1, 2a, 2b, 2c x {accuracy, reduction, listener-reduction, speed?, converge, diverge, ?distinctiveness}

library(tidyverse)
library("here")
library(lme4)
model_location="code/paper_mods"
# Read data

source(here("code/prep_ms.R"))

#### Accuracy models

acc_data <- combined_results |> 
  group_by(playerId,repNum, gameId, numPlayers) %>% 
  mutate(correct.num=ifelse(correct,1,0)) %>% 
  mutate(block=repNum,
         tangram_group=str_c(tangram, gameId))


model_1_acc<- glmer(correct.num ~ block*numPlayers+(1|gameId), 
             family=binomial(link="logit"),
             data=acc_data |> filter(condition=="rotate"))
# model failed to converge
# but close to what brms came up with


acc_3 <- acc_data |> filter(condition %in% c("2_thin", "2_thick", "6_thin", "6_thick")) |> 
                              separate(condition, into= c("gameSize","channel"))
                            
model_3_acc<- glmer(correct.num ~ block*gameSize*channel+(1|gameId), 
             family=binomial(link="logit"),
             data=acc_3)
# also failed to converge


### Reduction models

red_data <- combined_chat |> filter(role=="speaker") |> 
  mutate(block=repNum,
         words=total_num_words)

model_1_red <- lmer(words ~ block*numPlayers + (block|tangram) + (1|playerId)+(1|tangram:gameId)+(block|gameId),
                   data=red_data |> filter(condition=="rotate"))
#also failed to converge


red_3 <- red_data |> filter(condition %in% c("2_thin", "2_thick", "6_thin", "6_thick")) |> 
  separate(condition, into= c("gameSize","channel"))

model_3_red <-  lmer(words ~ block*channel*gameSize +   (block*channel*gameSize|tangram)+ (1|tangram:gameId)+ (block|gameId), 
                   data=red_3)
# boundary singular
