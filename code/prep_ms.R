library(tidyverse)
library(here)
library(rlang)

### study 1
rotate_data_loc <- "data/study1"

one_chat_rounds_include <- read_rds(here(rotate_data_loc,"rounds_include.rds")) 
one_round_results <- read_rds(here(rotate_data_loc,"round_results.rds")) %>% mutate(rotate="rotate")

one_chat <- read_csv(here(rotate_data_loc,"chat.csv"))

### study 2a

no_rotate_data_loc <- "data/study2a"

two_a_rounds_include <- read_rds(here(no_rotate_data_loc,"rounds_include.rds")) 
two_a_round_results <- read_rds(here(no_rotate_data_loc,"round_results.rds")) %>% mutate(rotate="no_rotate")
two_a_chat <-  read_csv(here(no_rotate_data_loc,"chat.csv"))

### study 2b

feedback_data_loc <- "data/study2b"

two_b_rounds_include <- read_rds(here(feedback_data_loc,"rounds_include.rds")) 
two_b_round_results <- read_rds(here(feedback_data_loc,"round_results.rds")) %>% mutate(rotate="full_feedback")
two_b_chat <- read_csv(here(feedback_data_loc, "chat.csv"))

### study 2c
data_location_2c <- "data/study2c"
two_c_rounds_include <- read_rds(here(data_location_2c,"rounds_include.rds"))
two_c_round_results <- read_rds(here(data_location_2c,"round_results.rds")) |> mutate(rotate="emoji")
two_c_chat <- read_csv(here(data_location_2c, "chat.csv"))


### study 3

data_location_3 <- "data/study3"
three_rounds_include <- read_rds(here(data_location_3,"rounds_include.rds"))
three_round_results <- read_rds(here(data_location_3,"round_results.rds")) |> rename(`_id`="X_id", condition=name)
three_chat <- read_csv(here(data_location_3, "chat.csv")) |> rename(`_id`="X_id",condition=name)

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

### for similarity stuff

# one_two_data_loc <- "data/study2c"
# one_two_sbert_concat <- read_csv(here(one_two_data_loc,"pre_sbert_concat.csv")) |>   bind_cols(readRDS(here(one_two_data_loc,'post_sbert_concat.RData'))  %>% as_tibble()) |> mutate(tangram=str_sub(target,-5,-5)) |> rename(condition=numPlayers)
# 
# #3
# three_data_loc <- "data/study3"
# three_sbert_concat <- read_csv(here(three_data_loc,"pre_sbert.csv")) |> 
#   bind_cols(readRDS(here(three_data_loc,"post_sbert.RData")) |> as_tibble()) |> 
#   mutate(condition=str_c(playerCond,channelCond))
# 
# get_sim_matrix = function(df, F_mat, method = 'cosine') {
#   feats = F_mat[df$feature_ind,]
#   if(method == 'cor') {
#     return(cor(t(feats), method = 'pearson'))
#   } else if (method == 'euclidean') {
#     return(as.matrix(dist(feats, method = 'euclidean')))
#   } else if (method == 'cosine') {
#     return(as.matrix(lsa::cosine(t(feats))))
#   } else {
#     stop(paste0('unknown method', method))
#   }
# }
# 
# # note this does de-duplicated version
# flatten_sim_matrix <- function(cormat, ids) {
#   ut <- upper.tri(cormat)
#   data.frame(
#     dim1 = ids[row(cormat)[ut]],
#     dim2 = ids[col(cormat)[ut]],
#     sim  = as.numeric(cormat[ut])
#   ) %>%
#     mutate(dim1 = as.character(dim1),
#            dim2 = as.character(dim2))
# }
# 
# make_within_df <- function(M_mat, F_mat, method) {
#   M_mat %>%
#     do(flatten_sim_matrix(get_sim_matrix(., F_mat, method = method),
#                           .$repNum)) %>%
#     mutate(rep1 = as.numeric(dim1), 
#            rep2 = as.numeric(dim2)) 
# }
# 
# make_across_df <- function(M_mat, F_mat, method) {
#   M_mat %>%
#     do(flatten_sim_matrix(get_sim_matrix(., F_mat, method = method),
#                           as.character(.$combinedId)))
# }
# 
# 
# do_diverge <- function(concat){
#   F_mat <- concat %>% select(starts_with("V")) %>% as.matrix() #Features
#   M_mat <- concat %>% select(-starts_with("V")) %>% mutate(feature_ind=row_number())
#   
#   game_divergence <- M_mat %>% 
#     filter(role=="speaker") %>% 
#     group_by(tangram,repNum, condition) %>% 
#     mutate(combinedId=str_c(gameId,repNum,sep="_")) %>% 
#     make_across_df(F_mat, 'cosine') %>% 
#     separate(dim1, into=c("gameId_1","repNum_1"), convert=T, sep="_") %>% 
#     separate(dim2, into=c("gameId_2","repNum_2"), convert=T, sep="_") %>% 
#     filter(gameId_1!=gameId_2) %>% 
#     mutate(sim = ifelse(is.nan(sim), NA, sim)) %>%
#     ungroup()
#   
#   return(game_divergence)
# }
# 
# do_converge <- function(concat){
#   F_mat <- concat %>% select(starts_with("V")) %>% as.matrix() #Features
#   M_mat <- concat %>% select(-starts_with("V")) %>% mutate(feature_ind=row_number())
#   
#   tangram_change <- M_mat %>% 
#     filter(role=="speaker") %>% 
#     group_by(tangram, gameId, condition) %>% 
#     mutate(combinedId=str_c(repNum,playerId,sep="_")) %>% 
#     make_across_df(F_mat, 'cosine') %>% 
#     separate(dim1, into=c("repNum_1","p1"), convert=T, sep="_") %>% 
#     separate(dim2, into=c("repNum_2","p2"), convert=T, sep="_") %>% 
#     mutate(sim = ifelse(is.nan(sim), NA, sim)) %>%
#     filter(!is.na(repNum_1)) %>% 
#     mutate(later=ifelse(repNum_1>repNum_2,repNum_1, repNum_2),
#            earlier=ifelse(repNum_1>repNum_2,repNum_2, repNum_1),
#            samespeaker=ifelse(p1==p2,"same_speaker","diff_speaker")) 
#   
#   adjacent <- tangram_change %>% 
#     filter(earlier+1==later) %>% 
#     ungroup()
#   
#   to_first <- tangram_change |> filter(earlier==0) |> ungroup()
#   
#   to_last <- tangram_change |> filter(later==5) |> ungroup()
#   return(to_last)
# }
# 
# one_two_diverge <- do_diverge(one_two_sbert_concat) |> write_rds(here("code/models/one_two_diverge.rds"))
# one_two_converge <- do_converge(one_two_sbert_concat) |> write_rds(here("code/models/one_two_converge.rds"))
# three_diverge <- do_diverge(three_sbert_concat) |> write_rds(here("code/models/three_diverge.rds"))
# three_converge <- do_converge(three_sbert_concat) |> write_rds(here("code/models/three_converge.rds"))
# 
