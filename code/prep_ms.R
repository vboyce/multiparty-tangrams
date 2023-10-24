library(tidyverse)
library(here)
library(rlang)

### study 1
rotate_data_loc <- "data/study1"

one_chat_rounds_include <- read_rds(here(rotate_data_loc,"rounds_include.rds")) 
one_round_results <- read_rds(here(rotate_data_loc,"round_results.rds")) %>% mutate(rotate="rotate")
one_chat <- read_csv(here(rotate_data_loc,"chat.csv")) |> mutate(rotate="rotate")
pre_chat_1 <- read_csv(here(rotate_data_loc, "filtered_chat.csv")) |> 
  mutate(condition="rotate") |> 
  inner_join(one_chat_rounds_include)

### study 2a

no_rotate_data_loc <- "data/study2a"

two_a_rounds_include <- read_rds(here(no_rotate_data_loc,"rounds_include.rds")) 
two_a_round_results <- read_rds(here(no_rotate_data_loc,"round_results.rds")) %>% mutate(rotate="no_rotate")
two_a_chat <-  read_csv(here(no_rotate_data_loc,"chat.csv")) |> mutate(rotate="no_rotate")
pre_chat_2a <- read_csv(here(no_rotate_data_loc, "filtered_chat.csv")) |> 
  mutate(condition="no_rotate") |> 
  inner_join(two_a_rounds_include) 

### study 2b

feedback_data_loc <- "data/study2b"

two_b_rounds_include <- read_rds(here(feedback_data_loc,"rounds_include.rds")) 
two_b_round_results <- read_rds(here(feedback_data_loc,"round_results.rds")) %>% mutate(rotate="full_feedback")
two_b_chat <- read_csv(here(feedback_data_loc, "chat.csv")) |> mutate(rotate="full_feedback")
pre_chat_2b <- read_csv(here(feedback_data_loc, "filtered_chat.csv")) |> 
  mutate(condition="full_feedback") |> 
  inner_join(two_b_rounds_include)

### study 2c
data_location_2c <- "data/study2c"
two_c_rounds_include <- read_rds(here(data_location_2c,"rounds_include.rds"))
two_c_round_results <- read_rds(here(data_location_2c,"round_results.rds")) |> mutate(rotate="emoji")
two_c_chat <- read_csv(here(data_location_2c, "chat.csv")) |> mutate(rotate="emoji")
two_c_raw <- read_csv(here(data_location_2c, "raw_chat.csv")) |> inner_join(two_c_rounds_include) |> filter(role=="listener") |>
  mutate(condition="emoji", activePlayerCount=6)

### study 3

data_location_3 <- "data/study3"
three_rounds_include <- read_rds(here(data_location_3,"rounds_include.rds"))
three_round_results <- read_rds(here(data_location_3,"round_results.rds")) |> rename(`_id`="X_id", condition=name)
three_chat <- read_csv(here(data_location_3, "chat.csv")) |> rename(`_id`="X_id",condition=name)
three_raw <- read_csv(here(data_location_3, "raw_chat.csv")) |> inner_join(three_rounds_include) |>   rename(condition=name) |> 
  filter(condition %in% c("2_thin", "6_thin")) |> filter(role=="listener")
pre_chat_3 <- read_csv(here(data_location_3, "filtered_chat.csv")) |> 
  inner_join(three_rounds_include) |> 
  rename(condition=name)

### Combined

combined_results <- one_round_results |> 
  rbind(two_a_round_results) |> 
  rbind(two_b_round_results) |> 
  rbind(two_c_round_results) |> 
  mutate(activePlayerCount=NA) |> 
  rename(condition=rotate) |> 
  rbind(three_round_results)
  
combined_chat <- one_chat |> 
  rbind(two_a_chat) |> 
  rbind(two_b_chat) |> 
  rbind(two_c_chat) |> 
  mutate(activePlayerCount=NA) |> 
  rename(condition=rotate) |> 
  rbind(three_chat) |> 
  mutate(total_num_words=str_count(text, "\\S+")) #note, the individual expts used "\\W+" + 1 but this counted "don't" as two words instead of one
# so here we instead count non-white space chunks for words 

combined_emoji <- two_c_raw |> rbind(three_raw)

pre_listener_chat <- pre_chat_1 |> 
  bind_rows(pre_chat_2a) |> 
  bind_rows(pre_chat_2b) |> 
  bind_rows(pre_chat_3) |> 
  select(gameId, spellchecked, playerId, target, role, repNum, trialNum, is.chitchat, condition, numPlayers) |> 
  filter(!is.chitchat) %>% 
  filter(!is.na(target)) |> 
  mutate(text = gsub("\\n", '', fixed = T, spellchecked), # note that this is using spellcorrected version!!!!
         text = gsub("[/?/.]", ' ', text),
         text = str_squish(text),
         tangram = gsub('/experiment/tangram_', '', target, fixed=TRUE),
         tangram = gsub('.png', '', tangram, fixed=TRUE)) |> 
  group_by(condition, numPlayers, gameId, trialNum, repNum, tangram) %>% 
  mutate(is.firstutter=ifelse(role!="speaker",F,NA)) %>% 
  fill(c("is.firstutter"), .direction="down") %>% 
  mutate(is.firstutter= is.firstutter %|% T) |> 
  filter(role=="speaker",is.firstutter) |> 
  summarize(text = paste0(text, collapse = ', ')) |> 
  mutate(total_num_words=str_count(text, "\\S+")) #note, the individual expts used "\\W+" + 1 but this counted "don't" as two words instead of one