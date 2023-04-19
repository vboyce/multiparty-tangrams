## for running similarity stuff

# 1-2
one_two_data_loc <- "data/study2c"
one_two_sbert_concat <- read_csv(here(one_two_data_loc,"pre_sbert_concat.csv")) |>  
  bind_cols(readRDS(here(one_two_data_loc,'post_sbert_concat.RData'))  %>% as_tibble()) |> 
  mutate(tangram=str_sub(target,-5,-5)) |> rename(condition=numPlayers)

#3
three_data_loc <- "data/study3"
three_sbert_concat <- read_csv(here(three_data_loc,"pre_sbert.csv")) |>
  bind_cols(readRDS(here(three_data_loc,"post_sbert.RData")) |> as_tibble()) |>
  mutate(condition=str_c(playerCond,channelCond))

### helper funcs
get_sim_matrix = function(df, F_mat, method = 'cosine') {
  feats = F_mat[df$feature_ind,]
  if(method == 'cor') {
    return(cor(t(feats), method = 'pearson'))
  } else if (method == 'euclidean') {
    return(as.matrix(dist(feats, method = 'euclidean')))
  } else if (method == 'cosine') {
    return(as.matrix(lsa::cosine(t(feats))))
  } else {
    stop(paste0('unknown method', method))
  }
}

# note this does de-duplicated version
flatten_sim_matrix <- function(cormat, ids) {
  ut <- upper.tri(cormat)
  data.frame(
    dim1 = ids[row(cormat)[ut]],
    dim2 = ids[col(cormat)[ut]],
    sim  = as.numeric(cormat[ut])
  ) %>%
    mutate(dim1 = as.character(dim1),
           dim2 = as.character(dim2))
}

make_within_df <- function(M_mat, F_mat, method) {
  M_mat %>%
    do(flatten_sim_matrix(get_sim_matrix(., F_mat, method = method),
                          .$repNum)) %>%
    mutate(rep1 = as.numeric(dim1),
           rep2 = as.numeric(dim2))
}

make_across_df <- function(M_mat, F_mat, method) {
  M_mat %>%
    do(flatten_sim_matrix(get_sim_matrix(., F_mat, method = method),
                          as.character(.$combinedId)))
}

### funcs
do_diverge <- function(concat){
  F_mat <- concat %>% select(starts_with("V")) %>% as.matrix() #Features
  M_mat <- concat %>% select(-starts_with("V")) %>% mutate(feature_ind=row_number())

  game_divergence <- M_mat %>%
    filter(role=="speaker") %>%
    group_by(tangram,repNum, condition) %>%
    mutate(combinedId=str_c(gameId,repNum,sep="_")) %>%
    make_across_df(F_mat, 'cosine') %>%
    separate(dim1, into=c("gameId_1","repNum_1"), convert=T, sep="_") %>%
    separate(dim2, into=c("gameId_2","repNum_2"), convert=T, sep="_") %>%
    filter(gameId_1!=gameId_2) %>%
    mutate(sim = ifelse(is.nan(sim), NA, sim)) %>%
    ungroup()

  return(game_divergence)
}

do_converge <- function(concat){
  F_mat <- concat %>% select(starts_with("V")) %>% as.matrix() #Features
  M_mat <- concat %>% select(-starts_with("V")) %>% mutate(feature_ind=row_number())

  tangram_change <- M_mat %>%
    filter(role=="speaker") %>%
    group_by(tangram, gameId, condition) %>%
    mutate(combinedId=str_c(repNum,playerId,sep="_")) %>%
    make_across_df(F_mat, 'cosine') %>%
    separate(dim1, into=c("repNum_1","p1"), convert=T, sep="_") %>%
    separate(dim2, into=c("repNum_2","p2"), convert=T, sep="_") %>%
    mutate(sim = ifelse(is.nan(sim), NA, sim)) %>%
    filter(!is.na(repNum_1)) %>%
    mutate(later=ifelse(repNum_1>repNum_2,repNum_1, repNum_2),
           earlier=ifelse(repNum_1>repNum_2,repNum_2, repNum_1),
           samespeaker=ifelse(p1==p2,"same_speaker","diff_speaker"))

  return(tangram_change)
}

do_diff_tangrams <- function(concat){
  
  F_mat <- concat %>% select(starts_with("V")) %>% as.matrix() #Features
  M_mat <- concat %>% select(-starts_with("V")) %>% mutate(feature_ind=row_number())
  
  
  tangram_distinctive <- M_mat %>%
    filter(role=="speaker") %>%
    group_by(gameId,repNum, condition) %>%
    mutate(combinedId=tangram) %>%
    make_across_df(F_mat, 'cosine') %>%
    rename(tangram1=dim1,tangram2=dim2) %>%
    mutate(sim = ifelse(is.nan(sim), NA, sim)) %>%
    filter(tangram1!=tangram2) %>%
    ungroup() 
  
  return(tangram_distinctive)
}

one_two_diverge <- do_diverge(one_two_sbert_concat) |> write_rds(here("code/models/one_two_diverge.rds"))
one_two_converge <- do_converge(one_two_sbert_concat) 
one_two_converge |> filter(later==5) |> ungroup()|> write_rds(here("code/models/one_two_converge.rds"))
one_two_converge |> filter(earlier==0) |> ungroup() |> write_rds(here("code/models/one_two_tofirst.rds"))
one_two_converge |> filter(earlier+1==later) |> ungroup() |> write_rds(here("code/models/one_two_tonext.rds"))
one_two_tangrams <- do_diff_tangrams(one_two_sbert_concat) |> write_rds(here("code/models/one_two_tangrams_div.rds"))

three_diverge <- do_diverge(three_sbert_concat) |> write_rds(here("code/models/three_diverge.rds"))
three_converge <- do_converge(three_sbert_concat) 
three_converge |> filter(later==5) |> ungroup()|> write_rds(here("code/models/three_converge.rds"))
three_converge |> filter(earlier==0) |> ungroup()|> write_rds(here("code/models/three_tofirst.rds"))
three_converge |> filter(earlier+1==later) |> ungroup()|> write_rds(here("code/models/three_tonext.rds"))
three_tangrams <- do_diff_tangrams(three_sbert_concat) |> write_rds(here("code/models/three_tangrams_div.rds"))


