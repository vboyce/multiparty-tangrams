library(tidyverse)
library(here)
library(rlang)

# games that had the correct number of people and went all 72 trials

source(here("code/prep_ms.R"))

include <- combined_results |> select(gameId, trialNum, repNum, numPlayers, activePlayerCount, condition) |> unique() |> 
  filter(!str_detect(condition, "6") | numPlayers==6) |> 
  filter(is.na(activePlayerCount) | activePlayerCount==numPlayers) |> 
  group_by(gameId, condition, numPlayers) |> 
  tally() |> 
  filter(n==72)

 include |> group_by(condition, numPlayers) |> tally()

limited_results <- combined_results |> inner_join(include)

limited_chat <- combined_chat |> inner_join(include)
