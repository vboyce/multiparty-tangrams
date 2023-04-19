# this is a sectioning off of generating the non-original data files across all expts

# because data_location is redefined repeatedly, suggest running this script either all at once or not at all

# there's a lot of repeated code here, but I don't feel like refactoring 
# there are some slight changes as the code developed

library(tidyverse)
library(jsonlite)

ParseJSONColumn <- function(x) {
  str_c("[ ", str_c(x, collapse = ",", sep=" "), " ]")  %>% 
    fromJSON(flatten = T)
}


# Study 1
# note that this was run in two chunks, so the raw data is split between 1a and 1b

data_location="data/study1"
date_start=lubridate::ymd('2021-05-04')
data_location_a <- "data/study1a"
data_location_b <- "data/study1b"

# study 1a
d.games <- read_csv(here(data_location_a, 'games.csv')) %>% 
  rename(gameId = `_id`) %>% 
    filter(createdAt >= date_start)

d.chat.raw <- read_csv(here(data_location_a, 'rounds.csv'), guess_max=10000) %>%
  filter(createdAt >= date_start) %>%
  mutate(data.chat = ifelse(is.na(data.chat), '{}', data.chat)) %>%
  rename(row_id = `_id`) %>%
  mutate(data.chat = map(data.chat, .f = ParseJSONColumn)) %>%
  unnest(data.chat) %>%
  select(-data.target, -ends_with('response'), -ends_with('_correct'), -ends_with('time')) %>%
  rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
  write_csv(here(data_location_a, 'raw_chat.csv'))

d.round_results.raw <- read_csv(here(data_location_a,'rounds.csv'),guess_max=10000) %>% 
  filter(createdAt >= date_start) %>% 
  rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
  rename_with ( ~ gsub("room", "player", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("player", "player_", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("correct", "_correct", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("response", "_response", .x, fixed=T)) %>% 
  rename_with( ~ gsub("time", "_time", .x, fixed=T)) %>% 
  select(-chat) %>% 
  gather(key, value, starts_with('player')) %>% 
  separate(key, into = c('blah', 'playerId', 'info')) %>% 
  spread(info, value) %>% 
  select(-blah) %>% 
  mutate(tangram = gsub('/experiment/tangram_', '', target, fixed=TRUE),
         tangram = gsub('.png', '', tangram, fixed=TRUE)) %>% 
  mutate(correct=as.logical(correct),
         time=as.numeric(time)/1000) %>% 
  filter(!is.na(correct)) %>% 
  filter(playerId!=speaker) %>% 
  write_csv(here(data_location_a, 'raw_results.csv'))

d.exit.survey <- read_csv(here(data_location_a, 'player-inputs.csv')) %>%
  filter(createdAt >= date_start) %>%
  left_join(d.games, by = c('gameId')) %>%
    rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
  write_csv(here(data_location_a,'exit.csv'))

# study 1b

d.games <- read_csv(here(data_location_b, 'games.csv')) %>% 
  rename(gameId = `_id`) %>% 
    filter(createdAt >= date_start)

d.chat.raw <- read_csv(here(data_location_b, 'rounds.csv'), guess_max=10000) %>%
  filter(createdAt >= date_start) %>%
  mutate(data.chat = ifelse(is.na(data.chat), '{}', data.chat)) %>%
  rename(row_id = `_id`) %>%
  mutate(data.chat = map(data.chat, .f = ParseJSONColumn)) %>%
  unnest(data.chat) %>%
  select(-data.target, -ends_with('response'), -ends_with('_correct'), -ends_with('time')) %>%
  rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
  write_csv(here(data_location_b, 'raw_chat.csv'))

d.round_results.raw <- read_csv(here(data_location_b,'rounds.csv'),guess_max=10000) %>% 
  filter(createdAt >= date_start) %>% 
  rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
  rename_with ( ~ gsub("room", "player", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("player", "player_", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("correct", "_correct", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("response", "_response", .x, fixed=T)) %>% 
  rename_with( ~ gsub("time", "_time", .x, fixed=T)) %>% 
  select(-chat) %>% 
  gather(key, value, starts_with('player')) %>% 
  separate(key, into = c('blah', 'playerId', 'info')) %>% 
  spread(info, value) %>% 
  select(-blah) %>% 
  mutate(tangram = gsub('/experiment/tangram_', '', target, fixed=TRUE),
         tangram = gsub('.png', '', tangram, fixed=TRUE)) %>% 
  mutate(correct=as.logical(correct),
         time=as.numeric(time)/1000) %>% 
  filter(!is.na(correct)) %>% 
  filter(playerId!=speaker) %>% 
  write_csv(here(data_location_b, 'raw_results.csv'))

d.exit.survey <- read_csv(here(data_location_b, 'player-inputs.csv')) %>%
  filter(createdAt >= date_start) %>%
  left_join(d.games, by = c('gameId')) %>%
    rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
    write_csv(here(data_location_b,'exit.csv'))


# join the two together

#we exclude rounds where no one talked (this is our criteria for "they weren't playing anymore")
# this is better than if no one submitted b/c maybe people fail to click on some round?
rounds_include <- read_csv(here(data_location_a,'raw_chat.csv')) %>% 
  union(read_csv(here(data_location_b,'raw_chat.csv'))) %>% 
  filter(!is.na(text)) %>%
  select(gameId,numPlayers,repNum,targetNum) %>% unique() %>% 
  group_by(gameId,numPlayers,repNum) %>% tally() %>% 
  filter(n==12) %>% select(gameId,repNum) %>% write_rds(here(data_location,"rounds_include.rds"))

d.round_results <-  read_csv(here(data_location_a,'raw_results.csv')) %>% 
  union(read_csv(here(data_location_b,'raw_results.csv'))) %>% 
  inner_join(rounds_include) %>% write_rds(here(data_location,'round_results.rds'))

# b/c countCorrect was being bad
d.correct <- d.round_results %>% 
  group_by(`_id`,gameId,target,targetNum,repNum,trialNum,
           numPlayers,countCorrect,speaker,tangram) %>% 
  summarize(realCorrect=sum(ifelse(correct,1,0)))

d.round_results %>% left_join(d.correct) %>% write_rds(here(data_location,"round_results.rds"))

d.exit_survey <- read_csv(here(data_location_a,'exit.csv')) %>% 
  mutate(age=as.character(age)) %>%  union(read_csv(here(data_location_b,'exit.csv'))) %>% 
  write_csv(here(data_location,"exit_survey.csv"))
  
# chat processing post having filtered chat!

d.chat.filter <- read_csv(here(data_location, "filtered_chat.csv")) %>% 
  filter(!is.chitchat) %>% 
  filter(!is.na(target)) %>% 
  mutate(text = gsub("\\n", '', fixed = T, spellchecked), # note that this is using spellcorrected version!!!!
         text = gsub("[/?/.]", ' ', text),
         text = str_squish(text),
         tangram = gsub('/experiment/tangram_', '', target, fixed=TRUE),
         tangram = gsub('.png', '', tangram, fixed=TRUE),
         utt_length_chars = str_length(text), 
         utt_length_words = str_count(text, "\\W+") + 1) %>%
  group_by(gameId, trialNum, repNum, tangram) %>% 
  mutate(is.firstutter=ifelse(role!="speaker",F,NA)) %>% 
  fill(c("is.firstutter"), .direction="down") %>% 
  mutate(is.firstutter= is.firstutter %|% T) 

d.chat <- d.chat.filter %>% 
  group_by(gameId, trialNum, repNum, tangram, playerId, role, numPlayers) %>%
  summarize(text = paste0(text, collapse = ', '),
            total_num_words = sum(utt_length_words, na.rm=T) %>% as.numeric(),
            total_num_chars = sum(utt_length_chars, na.rm=T) %>% as.numeric()) %>%
  inner_join(rounds_include) %>% 
  full_join(d.round_results, c("gameId", "trialNum", "repNum", "playerId", "tangram", "numPlayers")) %>% 
  mutate(text = text %|% "",
         total_num_words= total_num_words %|% 0,
         total_num_chars= total_num_chars %|% 0,
         role = role %|% "listener") |> 
  write_csv(here(data_location, "chat.csv"))

### 2a 
data_location="data/study2a"
date_start=lubridate::ymd('2022-03-30')

# read in the data
d.games <- read_csv(here(data_location, 'games.csv')) %>% 
  rename(gameId = `_id`) %>% 
    filter(createdAt >= date_start)

d.chat.raw <- read_csv(here(data_location, 'rounds.csv'), guess_max=10000) %>%
  filter(createdAt >= date_start) %>%
  mutate(data.chat = ifelse(is.na(data.chat), '{}', data.chat)) %>%
  rename(row_id = `_id`) %>%
  mutate(data.chat = map(data.chat, .f = ParseJSONColumn)) %>%
  unnest(data.chat) %>%
  select(-data.target, -ends_with('response'), -ends_with('_correct'), -ends_with('time')) %>%
  rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
  write_csv(here(data_location, 'raw_chat.csv'))

d.round_results.raw <- read_csv(here(data_location,'rounds.csv'),guess_max=10000) %>% 
  filter(createdAt >= date_start) %>% 
  rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
  rename_with ( ~ gsub("room", "player", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("player", "player_", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("correct", "_correct", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("response", "_response", .x, fixed=T)) %>% 
  rename_with( ~ gsub("time", "_time", .x, fixed=T)) %>% 
  select(-chat) %>% 
  gather(key, value, starts_with('player')) %>% 
  separate(key, into = c('blah', 'playerId', 'info')) %>% 
  spread(info, value) %>% 
  select(-blah) %>% 
  mutate(tangram = gsub('/experiment/tangram_', '', target, fixed=TRUE),
         tangram = gsub('.png', '', tangram, fixed=TRUE)) %>% 
  mutate(correct=as.logical(correct),
         time=as.numeric(time)/1000) %>% 
  filter(!is.na(correct)) %>% 
  filter(playerId!=speaker) %>% 
  write_csv(here(data_location, 'raw_results.csv'))

d.exit.survey <- read_csv(here(data_location, 'player-inputs.csv')) %>%
  filter(createdAt >= date_start) %>%
  left_join(d.games, by = c('gameId')) %>%
    rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
    write_csv(here(data_location,'exit.csv'))


#we exclude rounds where no one talked (this is our criteria for "they weren't playing anymore")
# this is better than if no one submitted b/c maybe people fail to click on some round?
rounds_include <- (read_csv(here(data_location,'raw_chat.csv'))) %>% 
  filter(!is.na(text)) %>%
  select(gameId,numPlayers,repNum,targetNum) %>% unique() %>% 
  group_by(gameId,numPlayers,repNum) %>% tally() %>% 
  filter(n==12) %>% select(gameId,repNum) %>% write_rds(here(data_location,"rounds_include.rds"))

d.round_results <-(read_csv(here(data_location,'raw_results.csv'))) %>% 
  inner_join(rounds_include) %>% write_rds(here(data_location,'round_results.rds'))

d.correct <- d.round_results %>% 
  group_by(`_id`,gameId,target,targetNum,repNum,trialNum,
           numPlayers,countCorrect,speaker,tangram) %>% 
  summarize(realCorrect=sum(ifelse(correct,1,0)))

d.round_results %>% left_join(d.correct) %>% write_rds(here(data_location,"round_results.rds"))

d.exit_survey <- (read_csv(here(data_location,'exit.csv'))) %>% 
  write_csv(here(data_location,"exit_survey.csv"))

d.chat.filter <- read_csv(here(data_location, "filtered_chat.csv")) %>% 
  filter(!is.chitchat) %>% 
  filter(!is.na(target)) %>% 
  mutate(text = gsub("\\n", '', fixed = T, spellchecked), # note that this is using spellcorrected version!!!!
         text = gsub("[/?/.]", ' ', text),
         text = str_squish(text),
         tangram = gsub('/experiment/tangram_', '', target, fixed=TRUE),
         tangram = gsub('.png', '', tangram, fixed=TRUE),
         utt_length_chars = str_length(text), 
         utt_length_words = str_count(text, "\\W+") + 1) %>%
  group_by(gameId, trialNum, repNum, tangram) %>% 
  mutate(is.firstutter=ifelse(role!="speaker",F,NA)) %>% 
  fill(c("is.firstutter"), .direction="down") %>% 
  mutate(is.firstutter= is.firstutter %|% T) 

d.chat <- d.chat.filter %>% 
  group_by(gameId, trialNum, repNum, tangram, playerId, role, numPlayers) %>%
  summarize(text = paste0(text, collapse = ', '),
            total_num_words = sum(utt_length_words, na.rm=T) %>% as.numeric(),
            total_num_chars = sum(utt_length_chars, na.rm=T) %>% as.numeric()) %>%
  inner_join(rounds_include) %>% 
  full_join(d.round_results, c("gameId", "trialNum", "repNum", "playerId", "tangram", "numPlayers")) %>% 
  mutate(text = text %|% "",
         total_num_words= total_num_words %|% 0,
         total_num_chars= total_num_chars %|% 0,
         role = role %|% "listener") |> 
  write_csv(here(data_location, "chat.csv"))

### 2b
data_location="data/study2b"
date_start=lubridate::ymd('2022-07-13')



d.games <- read_csv(here(data_location, 'games.csv')) %>% 
  rename(gameId = `_id`) %>% 
    filter(createdAt >= date_start)

d.chat.raw <- read_csv(here(data_location, 'rounds.csv'), guess_max=10000) %>%
  filter(createdAt >= date_start) %>%
  mutate(data.chat = ifelse(is.na(data.chat), '{}', data.chat)) %>%
  rename(row_id = `_id`) %>%
  mutate(data.chat = map(data.chat, .f = ParseJSONColumn)) %>%
  unnest(data.chat) %>%
  select(-data.target, -ends_with('response'), -ends_with('_correct'), -ends_with('time')) %>%
  rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
  write_csv(here(data_location, 'raw_chat.csv'))

d.round_results.raw <- read_csv(here(data_location,'rounds.csv'),guess_max=10000) %>% 
  filter(createdAt >= date_start) %>% 
  rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
  rename_with ( ~ gsub("room", "player", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("player", "player_", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("correct", "_correct", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("response", "_response", .x, fixed=T)) %>% 
  rename_with( ~ gsub("time", "_time", .x, fixed=T)) %>% 
  select(-chat) %>% 
  gather(key, value, starts_with('player')) %>% 
  separate(key, into = c('blah', 'playerId', 'info')) %>% 
  spread(info, value) %>% 
  select(-blah) %>% 
  mutate(tangram = gsub('/experiment/tangram_', '', target, fixed=TRUE),
         tangram = gsub('.png', '', tangram, fixed=TRUE)) %>% 
  mutate(correct=as.logical(correct),
         time=as.numeric(time)/1000) %>% 
  filter(!is.na(correct)) %>% 
  filter(playerId!=speaker) %>% 
  write_csv(here(data_location, 'raw_results.csv'))

d.exit.survey <- read_csv(here(data_location, 'player-inputs.csv')) %>%
  filter(createdAt >= date_start) %>%
  left_join(d.games, by = c('gameId')) %>%
    rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
    write_csv(here(data_location,'exit.csv'))


#we exclude rounds where no one talked (this is our criteria for "they weren't playing anymore")
# this is better than if no one submitted b/c maybe people fail to click on some round?

# update to the rule based on 8G6wdbdRa2nmYoNxk -- we exclude rounds where the *speaker* did not talk
rounds_include <- (read_csv(here(data_location,'raw_chat.csv'))) %>% 
  filter(role=="speaker") %>% 
  filter(!is.na(text)) %>%
  select(gameId,numPlayers,repNum,targetNum) %>% unique() %>% 
  group_by(gameId,numPlayers,repNum) %>% tally() %>% 
  filter(n==12) %>% select(gameId,repNum) %>% write_rds(here(data_location,"rounds_include.rds"))

d.round_results <-(read_csv(here(data_location,'raw_results.csv'))) %>% inner_join(rounds_include) %>% write_rds(here(data_location,'round_results.rds'))

d.correct <- d.round_results %>% 
  group_by(`_id`,gameId,target,targetNum,repNum,trialNum,
           numPlayers,countCorrect,speaker,tangram) %>% 
  summarize(realCorrect=sum(ifelse(correct,1,0)))

d.round_results %>% left_join(d.correct) %>% write_rds(here(data_location,"round_results.rds"))

d.exit_survey <- (read_csv(here(data_location,'exit.csv'))) %>% 
  write_csv(here(data_location,"exit_survey.csv"))
  
d.chat.filter <- read_csv(here(data_location, "filtered_chat.csv")) %>% 
  filter(!is.chitchat) %>% 
  filter(!is.na(target)) %>% 
  mutate(text = gsub("\\n", '', fixed = T, spellchecked), # note that this is using spellcorrected version!!!!
         text = gsub("[/?/.]", ' ', text),
         text = str_squish(text),
         tangram = gsub('/experiment/tangram_', '', target, fixed=TRUE),
         tangram = gsub('.png', '', tangram, fixed=TRUE),
         utt_length_chars = str_length(text), 
         utt_length_words = str_count(text, "\\W+") + 1) %>%
  group_by(gameId, trialNum, repNum, tangram) %>% 
  mutate(is.firstutter=ifelse(role!="speaker",F,NA)) %>% 
  fill(c("is.firstutter"), .direction="down") %>% 
  mutate(is.firstutter= is.firstutter %|% T) 

d.chat <- d.chat.filter %>% 
  group_by(gameId, trialNum, repNum, tangram, playerId, role, numPlayers) %>%
  summarize(text = paste0(text, collapse = ', '),
            total_num_words = sum(utt_length_words, na.rm=T) %>% as.numeric(),
            total_num_chars = sum(utt_length_chars, na.rm=T) %>% as.numeric()) %>%
  inner_join(rounds_include) %>% 
  full_join(d.round_results, c("gameId", "trialNum", "repNum", "playerId", "tangram", "numPlayers")) %>% 
  mutate(text = text %|% "",
         total_num_words= total_num_words %|% 0,
         total_num_chars= total_num_chars %|% 0,
         role = role %|% "listener") |> 
  write_csv(here(data_location, "chat.csv"))

### 2c
data_location="data/study2c"
date_start=lubridate::ymd('2022-08-10')


d.games <- read_csv(here(data_location, 'games.csv')) %>% 
  rename(gameId = `_id`) %>% 
    filter(createdAt >= date_start)

d.chat.raw <- read_csv(here(data_location, 'rounds.csv'), guess_max=10000) %>%
  filter(createdAt >= date_start) %>%
  mutate(data.chat = ifelse(is.na(data.chat), '{}', data.chat)) %>%
  rename(row_id = `_id`) %>% 
  mutate(data.chat = map(data.chat, .f = ParseJSONColumn)) %>% 
  unnest(data.chat) %>% 
  select(-data.target, -ends_with('response'), -ends_with('_correct'), -ends_with('time')) %>% 
  rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
  filter(type=="message") %>% 
  write_csv(here(data_location, 'raw_chat.csv'))


d.round_results.raw <- read_csv(here(data_location,'rounds.csv'),guess_max=10000) %>% 
  filter(createdAt >= date_start) %>% 
  rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
  rename_with ( ~ gsub("room", "player", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("player", "player_", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("correct", "_correct", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("response", "_response", .x, fixed=T)) %>% 
  rename_with( ~ gsub("time", "_time", .x, fixed=T)) %>% 
  select(-chat) %>% 
  gather(key, value, starts_with('player')) %>% 
  separate(key, into = c('blah', 'playerId', 'info')) %>% 
  spread(info, value) %>% 
  select(-blah) %>% 
  mutate(tangram = gsub('/experiment/tangram_', '', target, fixed=TRUE),
         tangram = gsub('.png', '', tangram, fixed=TRUE)) %>% 
  mutate(correct=as.logical(correct),
         time=as.numeric(time)/1000) %>% 
  filter(!is.na(correct)) %>% 
  filter(playerId!=speaker) %>% 
  write_csv(here(data_location, 'raw_results.csv'))

d.exit.survey <- read_csv(here(data_location, 'player-inputs.csv')) %>%
  filter(createdAt >= date_start) %>%
  left_join(d.games, by = c('gameId')) %>%
    rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
    write_csv(here(data_location,'exit.csv'))


#we exclude rounds where no one talked (this is our criteria for "they weren't playing anymore")
# this is better than if no one submitted b/c maybe people fail to click on some round?

# update to the rule based on 8G6wdbdRa2nmYoNxk -- we exclude rounds where the *speaker* did not talk
rounds_include <- (read_csv(here(data_location,'raw_chat.csv'))) %>% 
  filter(role=="speaker") %>% 
  filter(!is.na(text)) %>%
  select(gameId,numPlayers,repNum,targetNum) %>% unique() %>% 
  group_by(gameId,numPlayers,repNum) %>% tally() %>% 
  filter(n==12) %>% select(gameId,repNum) %>% write_rds(here(data_location,"rounds_include.rds"))

d.round_results <-(read_csv(here(data_location,'raw_results.csv'))) %>% inner_join(rounds_include) %>% write_rds(here(data_location,'round_results.rds'))

d.correct <- d.round_results %>% 
  group_by(`_id`,gameId,target,targetNum,repNum,trialNum,
           numPlayers,countCorrect,speaker,tangram) %>% 
  summarize(realCorrect=sum(ifelse(correct,1,0)))

d.round_results %>% left_join(d.correct) %>% write_rds(here(data_location,"round_results.rds"))

d.exit_survey <- (read_csv(here(data_location,'exit.csv'))) %>% 
  write_csv(here(data_location,"exit_survey.csv"))

d.chat.filter <- read_csv(here(data_location, "filtered_chat.csv")) %>% 
  filter(!is.chitchat) %>% 
  filter(!is.na(target)) %>% 
  mutate(text = gsub("\\n", '', fixed = T, spellchecked), # note that this is using spellcorrected version!!!!
         text = gsub("[/?/.]", ' ', text),
         text = str_squish(text),
         tangram = gsub('/experiment/tangram_', '', target, fixed=TRUE),
         tangram = gsub('.png', '', tangram, fixed=TRUE),
         utt_length_chars = str_length(text), 
         utt_length_words = str_count(text, "\\W+") + 1) %>%
  group_by(gameId, trialNum, repNum, tangram) %>% 
  mutate(is.firstutter=ifelse(role!="speaker",F,NA)) %>% 
  fill(c("is.firstutter"), .direction="down") %>% 
  mutate(is.firstutter= is.firstutter %|% T) 

d.chat <- d.chat.filter %>% 
  group_by(gameId, trialNum, repNum, tangram, playerId, role, numPlayers) %>%
  summarize(text = paste0(text, collapse = ', '),
            total_num_words = sum(utt_length_words, na.rm=T) %>% as.numeric(),
            total_num_chars = sum(utt_length_chars, na.rm=T) %>% as.numeric()) %>%
  inner_join(rounds_include) %>% 
  full_join(d.round_results, c("gameId", "trialNum", "repNum", "playerId", "tangram", "numPlayers")) %>% 
  mutate(text = text %|% "",
         total_num_words= total_num_words %|% 0,
         total_num_chars= total_num_chars %|% 0,
         role = role %|% "listener") |> 
  write_csv(here(data_location,"chat.csv"))

### 3
data_location="data/study3"
date_start=lubridate::ymd('2022-10-04') #TODO change


treatments <- read_csv(here(data_location,"treatments.csv"))
d.games <- read_csv(here(data_location, 'games.csv')) %>% 
  rename(gameId = `_id`) %>% 
    filter(createdAt >= date_start) |> 
  left_join(treatments |> select(treatmentId=`_id`,name))

d.chat.raw <- read_csv(here(data_location, 'rounds.csv'), guess_max=10000) %>%
  filter(createdAt >= date_start) %>%
  mutate(data.chat = ifelse(is.na(data.chat), '{}', data.chat)) %>%
  rename(row_id = `_id`) %>% 
  mutate(data.chat = map(data.chat, .f = ParseJSONColumn)) %>% 
  unnest(data.chat) %>% 
  select(-data.target, -ends_with('response'), -ends_with('_correct'), -ends_with('time')) %>% 
  rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
  filter(type=="message") %>% 
  write_csv(here(data_location, 'raw_chat.csv'))

library(data.table)
d.round_results.raw <- read.csv(here(data_location,'rounds.csv')) |> 
  setDT() |> 
  filter(createdAt >= date_start) %>% 
  rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
  rename_with ( ~ gsub("room", "player", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("player", "player_", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("correct", "_correct", .x, fixed=T)) %>% 
    rename_with ( ~ gsub("response", "_response", .x, fixed=T)) %>% 
  rename_with( ~ gsub("time", "_time", .x, fixed=T)) |> 
  select(-chat) |> 
  pivot_longer(cols=starts_with('player'), names_to=c("playerId", "info"), names_prefix="player__", names_sep="__",
               values_to="values", values_transform=as.character, values_drop_na=T) |> 
  filter(values!="") |> 
  filter(playerId!=speaker) %>% 
  pivot_wider(names_from=info, values_from=values) %>% 
  filter(!is.na(correct)) |> 
  mutate(tangram = gsub('/experiment/tangram_', '', target, fixed=TRUE),
         tangram = gsub('.png', '', tangram, fixed=TRUE),
         correct=as.logical(correct),
         time=as.numeric(time)/1000) |> 
  write_csv(here(data_location, 'raw_results.csv'))

d.exit.survey <- read_csv(here(data_location, 'player-inputs.csv')) %>%
  filter(createdAt >= date_start) %>%
  left_join(d.games, by = c('gameId')) %>%
    rename_with(~ gsub("data.", "", .x, fixed = TRUE)) %>% 
    write_csv(here(data_location,'exit.csv'))



#we exclude rounds where no one talked (this is our criteria for "they weren't playing anymore")
# this is better than if no one submitted b/c maybe people fail to click on some round?

rounds_include <- (read_csv(here(data_location,'raw_chat.csv'))) %>% 
  filter(role=="speaker") %>% 
  filter(!is.na(text)) %>%
  filter(gameId!="MhCsn5ZQTvFv49Bwy") |> # ***** just excluding this game by fiat -- the assigned speaker seemed to either really, really not be fluent or not understand the game. They do not provide descriptions and only barely answer when the listeners play 20 questions. ******
  select(gameId,numPlayers,repNum,targetNum) %>% unique() %>% 
  group_by(gameId,numPlayers,repNum) %>% tally() %>% 
  filter(n==12) %>% select(gameId,repNum) |> 
  left_join(d.games |> select(gameId,name)) |> 
  write_rds(here(data_location,"rounds_include.rds"))

d.round_results <-(read_csv(here(data_location,'raw_results.csv'))) %>% inner_join(rounds_include) %>% write_rds(here(data_location,'round_results.rds'))

d.correct <- d.round_results %>% 
  group_by(`X_id`,gameId,target,targetNum,repNum,trialNum,
           numPlayers,countCorrect,speaker,tangram) %>% 
  summarize(realCorrect=sum(ifelse(correct,1,0)))

d.round_results %>% left_join(d.correct) %>% 
  left_join(d.games |> select(gameId, name)) |> write_rds(here(data_location,"round_results.rds"))

d.exit_survey <- (read_csv(here(data_location,'exit.csv'))) %>% 
  inner_join(rounds_include |> select(gameId) |> unique()) |> 
  write_csv(here(data_location,"exit_survey.csv"))
 

d.chat.filter <- read_csv(here(data_location, "filtered_chat.csv")) |> 
  filter(!is.chitchat) %>% 
  filter(!is.na(target)) |> 
  mutate(text = gsub("\\n", '', fixed = T, spellchecked), # note that this is using spellcorrected version!!!!
         text = gsub("[/?/.]", ' ', text),
         text = str_squish(text),
         tangram = gsub('/experiment/tangram_', '', target, fixed=TRUE),
         tangram = gsub('.png', '', tangram, fixed=TRUE),
         utt_length_chars = str_length(text), 
         utt_length_words = str_count(text, "\\W+") + 1) %>%
  group_by(gameId, trialNum, repNum, tangram) %>% 
  mutate(is.firstutter=ifelse(role!="speaker",F,NA)) %>% 
  fill(c("is.firstutter"), .direction="down") %>% 
  mutate(is.firstutter= is.firstutter %|% T) 

d.chat <- d.chat.filter %>% 
  group_by(gameId, trialNum, repNum, tangram, playerId, role, numPlayers) %>%
  summarize(text = paste0(text, collapse = ', '),
            total_num_words = sum(utt_length_words, na.rm=T) %>% as.numeric(),
            total_num_chars = sum(utt_length_chars, na.rm=T) %>% as.numeric()) %>%
  inner_join(rounds_include) %>% 
  full_join(d.round_results, c("gameId", "trialNum", "repNum", "playerId", "tangram", "numPlayers", "name")) %>% 
  mutate(text = text %|% "",
         total_num_words= total_num_words %|% 0,
         total_num_chars= total_num_chars %|% 0,
         role = role %|% "listener") |> 
  write_csv(here(data_location, "chat.csv"))


