# this is script for creating sbert embeddings

# note that you will have to stop and do jupyter notebook things in the middle

# the relevant jupyter notebook is "sbert_play.ipynb"
# so don't just run the whole thing!
# this does concatenate only! 

### study 1-2


##Data import constants
data_location="data/study1"
data_location_noro="data/study2a"
data_location_highfeed="data/study2b"
data_location_emoji="data/study2c"

### pre-running 

raw_text <- read_csv(here(data_location, "filtered_chat.csv")) %>%
  select(gameId,targetNum,repNum,trialNum,numPlayers,text, playerId, target, role) %>% 
  filter(!is.na(text)) %>% 
  group_by(gameId, targetNum, repNum, trialNum, numPlayers, playerId, target, role) %>% 
  summarize(sentence=str_c(text, collapse=" ")) %>% 
  mutate(numPlayers=as.character(numPlayers)) %>% 
  ungroup()

noro <- read_csv(here(data_location_noro, "filtered_chat.csv")) %>% 
  select(gameId,targetNum,repNum,trialNum,numPlayers,text, playerId, target, role) %>% 
  filter(!is.na(text)) %>% 
  group_by(gameId, targetNum, repNum, trialNum, numPlayers, playerId, target, role) %>% 
  summarize(sentence=str_c(text, collapse=" ")) %>% 
  ungroup() %>% 
  mutate(numPlayers="6noro")

high_feed <- read_csv(here(data_location_highfeed, "filtered_chat.csv")) %>% 
  select(gameId,targetNum,repNum,trialNum,numPlayers,text, playerId, target, role) %>% 
  filter(!is.na(text)) %>% 
  group_by(gameId, targetNum, repNum, trialNum, numPlayers, playerId, target, role) %>% 
  summarize(sentence=str_c(text, collapse=" ")) %>% 
  ungroup() %>% 
  mutate(numPlayers="6highfeed")

emoji <- read_csv(here(data_location_emoji, "filtered_chat.csv")) %>% 
  select(gameId,targetNum,repNum,trialNum,numPlayers,text, playerId, target, role) %>% 
  filter(!is.na(text)) %>% 
  group_by(gameId, targetNum, repNum, trialNum, numPlayers, playerId, target, role) %>% 
  summarize(sentence=str_c(text, collapse=" ")) %>% 
  ungroup() %>% 
  mutate(numPlayers="6emoji")

pre_sbert_concat <- raw_text %>%union(noro) %>% union(high_feed) %>% union(emoji) %>%  write_csv(here(data_location_emoji,"pre_sbert_concat.csv"))

library(reticulate)
np <- import("numpy")
mat = np$load(here(data_location_emoji,'post_sbert_concat.npy'))
saveRDS(mat,here(data_location_emoji, 'post_sbert_concat.RData'))

### study 3

# pre running
data_location <- "data/study3"
rounds_include <- read_rds(here(data_location,"rounds_include.rds"))
d.round_results <- read_rds(here(data_location,"round_results.rds"))

d.pre.sbert <- read_csv(here(data_location, "filtered_chat.csv")) |> 
  #filter(!is.chitchat) %>% 
  filter(!is.na(target)) |> 
    filter(!is.na(text)) %>% 
  mutate(tangram = gsub('/experiment/tangram_', '', target, fixed=TRUE),
         tangram = gsub('.png', '', tangram, fixed=TRUE)) %>%
  inner_join(rounds_include) |>
  separate(name, into=c("playerCond","channelCond")) |> 
  select(gameId, targetNum, repNum, trialNum, playerCond, channelCond, activePlayerCount,playerId, tangram, role, text) |>
  group_by(gameId, targetNum, repNum, trialNum, playerCond, channelCond, activePlayerCount,playerId, tangram, role) |>  summarize(sentence=str_c(text, collapse=" ")) |> 
  ungroup() |> 
  write_csv(here(data_location,"pre_sbert.csv"))

### this is where jupyter notebook happens

library(reticulate)
np <- import("numpy")
mat = np$load(here(data_location,'post_sbert.npy'))
saveRDS(mat,here(data_location,'post_sbert.RData'))

### study 