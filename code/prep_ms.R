library(tidyverse)
library(here)
library(rlang)

### study 1
rotate_data_loc <- "data/study1"

one_chat_rounds_include <- read_rds(here(rotate_data_loc,"rounds_include.rds")) 
one_round_results <- read_rds(here(rotate_data_loc,"round_results.rds")) %>% mutate(rotate="rotate")

one_chat <- read_csv(here(rotate_data_loc,"chat.csv")) |> mutate(rotate="rotate")

### study 2a

no_rotate_data_loc <- "data/study2a"

two_a_rounds_include <- read_rds(here(no_rotate_data_loc,"rounds_include.rds")) 
two_a_round_results <- read_rds(here(no_rotate_data_loc,"round_results.rds")) %>% mutate(rotate="no_rotate")
two_a_chat <-  read_csv(here(no_rotate_data_loc,"chat.csv")) |> mutate(rotate="no_rotate")

### study 2b

feedback_data_loc <- "data/study2b"

two_b_rounds_include <- read_rds(here(feedback_data_loc,"rounds_include.rds")) 
two_b_round_results <- read_rds(here(feedback_data_loc,"round_results.rds")) %>% mutate(rotate="full_feedback")
two_b_chat <- read_csv(here(feedback_data_loc, "chat.csv")) |> mutate(rotate="full_feedback")

### study 2c
data_location_2c <- "data/study2c"
two_c_rounds_include <- read_rds(here(data_location_2c,"rounds_include.rds"))
two_c_round_results <- read_rds(here(data_location_2c,"round_results.rds")) |> mutate(rotate="emoji")
two_c_chat <- read_csv(here(data_location_2c, "chat.csv")) |> mutate(rotate="emoji")
two_c_raw <- read_csv(here(data_location_2c, "raw_chat.csv")) |> inner_join(two_c_rounds_include) |> filter(role=="listener") |> mutate(condition="emoji", activePlayerCount=6)

### study 3

data_location_3 <- "data/study3"
three_rounds_include <- read_rds(here(data_location_3,"rounds_include.rds"))
three_round_results <- read_rds(here(data_location_3,"round_results.rds")) |> rename(`_id`="X_id", condition=name)
three_chat <- read_csv(here(data_location_3, "chat.csv")) |> rename(`_id`="X_id",condition=name)
three_raw <- read_csv(here(data_location_3, "raw_chat.csv")) |> inner_join(three_rounds_include) |>   rename(condition=name) |> 
  filter(condition %in% c("2_thin", "6_thin")) |> filter(role=="listener")
### Combined

combined_results <- one_round_results |> 
  union(two_a_round_results) |> 
  union(two_b_round_results) |> 
  union(two_c_round_results) |> 
  mutate(activePlayerCount=NA) |> 
  rename(condition=rotate) |> 
  union(three_round_results)
  
combined_chat <- one_chat |> 
  union(two_a_chat) |> 
  union(two_b_chat) |> 
  union(two_c_chat) |> 
  mutate(activePlayerCount=NA) |> 
  rename(condition=rotate) |> 
  union(three_chat)

combined_emoji <- two_c_raw |> union(three_raw)
