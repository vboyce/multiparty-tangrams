
library(tidyverse)
library(here)
library(brms)
library(tidybayes)



##Data import constants

model_loc="code/paper_mods/complete_only"
m_loc="code/paper_mods/complete_only/prediction"


## Expt 1
do_expt_1 <- function(model){
  mod <- here(model_loc,model) |> read_rds()
  preds <- expand_grid(block=0:5, numPlayers=2:6) |> 
    add_linpred_draws(mod, value="predicted", re_formula=NA) |> 
    mutate(numPlayers=as.factor(numPlayers)) |> 
    group_by(block, numPlayers) |> 
    summarize(mean=mean(predicted),
              low=quantile(predicted,.025),
              high=quantile(predicted,.975))
  return(preds)
}

acc_pred_1 <-do_expt_1("acc_1.rds") |> 
  mutate(across(mean:high, inv_logit_scaled)) |> write_rds(here(m_loc,"acc_pred_1.rds"))

red_pred_1 <- do_expt_1("red_1.rds") |> write_rds(here(m_loc,"red_pred_1.rds"))

conv_1 <- here(model_loc,"tolast_1.rds") |> read_rds()
conv_pred_1 <- expand_grid(earlier=0:4, condition=2:6) |> 
  add_linpred_draws(conv_1, value="predicted", re_formula=NA) |> 
  mutate(condition=as.factor(condition)) |> 
  group_by(earlier,condition) |> 
  summarize(mean=mean(predicted),
            low=quantile(predicted,.025),
            high=quantile(predicted,.975)) |> 
  write_rds(here(m_loc,"conv_pred_1.rds"))

div_1 <- here(model_loc,"div_1.rds") |> read_rds()
div_pred_1 <- expand_grid(block=0:5, condition=2:6) |> 
  add_linpred_draws(div_1, value="predicted", re_formula=NA) |> 
  mutate(condition=as.factor(condition)) |> 
  group_by(block,condition) |> 
  summarize(mean=mean(predicted),
            low=quantile(predicted,.025),
            high=quantile(predicted,.975)) |> 
  write_rds(here(m_loc,"div_pred_1.rds"))



## Expt 2
do_expt_2 <- function(m2a, m2b, m2c){
  mod_2a <- here(model_loc,m2a) |> read_rds()
  mod_2b <- here(model_loc,m2b) |> read_rds()
  mod_2c <- here(model_loc,m2c) |> read_rds()
  pred_2a <- expand_grid(block=0:5) |> 
    add_linpred_draws(mod_2a, value="predicted", re_formula=NA) |> 
    mutate(condition="6 same describer") 
  
  pred_2b <-  expand_grid(block=0:5) |>
    add_linpred_draws(mod_2b, value="predicted", re_formula=NA) |> 
    mutate(condition="6 full feedback") 
  
  pred_2c <-  expand_grid(block=0:5) |>
    add_linpred_draws(mod_2c, value="predicted", re_formula=NA) |> 
    mutate(condition="6 thin") 
  
  pred_2<- pred_2a |> bind_rows(pred_2b, pred_2c) |> 
    group_by(block, condition) |> 
    summarize(mean=mean(predicted),
              low=quantile(predicted,.025),
              high=quantile(predicted,.975))
  return(pred_2)
}



do_conv_2 <- function(m2a, m2b, m2c){
  mod_2a <- here(model_loc,m2a) |> read_rds()
  mod_2b <- here(model_loc,m2b) |> read_rds()
  mod_2c <- here(model_loc,m2c) |> read_rds()
  pred_2a <- expand_grid(earlier=0:4) |> 
    add_linpred_draws(mod_2a, value="predicted", re_formula=NA) |> 
    mutate(condition="6 same describer") 
  
  pred_2b <-  expand_grid(earlier=0:4) |>
    add_linpred_draws(mod_2b, value="predicted", re_formula=NA) |> 
    mutate(condition="6 full feedback") 
  
  pred_2c <-  expand_grid(earlier=0:4) |>
    add_linpred_draws(mod_2c, value="predicted", re_formula=NA) |> 
    mutate(condition="6 thin") 
  
  pred_2<- pred_2a |> bind_rows(pred_2b, pred_2c) |> 
    group_by(earlier, condition) |> 
    summarize(mean=mean(predicted),
              low=quantile(predicted,.025),
              high=quantile(predicted,.975))
  return(pred_2)
}


acc_pred_2 <- do_expt_2("acc_2a.rds", "acc_2b.rds", "acc_2c.rds") |> 
  mutate(across(mean:high, inv_logit_scaled)) |> write_rds(here(m_loc,"acc_pred_2.rds"))

red_pred_2 <- do_expt_2("red_2a.rds", "red_2b.rds", "red_2c.rds") |> write_rds(here(m_loc,"red_pred_2.rds"))

div_pred_2 <- do_expt_2("div_2a.rds", "div_2b.rds", "div_2c.rds") |> 
  write_rds(here(m_loc,"div_pred_2.rds"))


conv_pred_2 <- do_conv_2("tolast_2a.rds", "tolast_2b.rds", "tolast_2c.rds") |> 
  write_rds(here(m_loc,"conv_pred_2.rds"))


## Expt 3
do_expt_3 <- function(model){
  mod <- here(model_loc,model) |> read_rds()
  pred_3 <- expand_grid(block=0:5, gameSize=c("2", "6"),channel=c("thin", "thick")) |>  add_linpred_draws(mod, value="predicted", re_formula=NA) |> 
    group_by(block, channel, gameSize) |> 
    summarize(mean=mean(predicted),
              low=quantile(predicted,.025),
              high=quantile(predicted,.975)) |> 
    mutate(condition=str_c(gameSize," ", channel))
  
  return(pred_3)
}
do_conv_3 <- function(model){
  mod <- here(model_loc,model) |> read_rds()
  pred_3 <- expand_grid(earlier=0:4, gameSize=c("2", "6"),channel=c("thin", "thick")) |>  add_linpred_draws(mod, value="predicted", re_formula=NA) |> 
    group_by(earlier, channel, gameSize) |> 
    summarize(mean=mean(predicted),
              low=quantile(predicted,.025),
              high=quantile(predicted,.975)) |> 
    mutate(condition=str_c(gameSize," ", channel))
  
  return(pred_3)
}


acc_pred_3 <-do_expt_3("acc_3.rds") |> 
  mutate(across(mean:high, inv_logit_scaled)) |> write_rds(here(m_loc,"acc_pred_3.rds"))

red_pred_3 <- do_expt_3("red_3.rds") |> write_rds(here(m_loc,"red_pred_3.rds"))

div_pred_3 <- do_expt_3("div_3.rds") |> write_rds(here(m_loc,"div_pred_3.rds"))



conv_pred_3 <- do_conv_3("tolast_3.rds") |> write_rds(here(m_loc,"conv_pred_3.rds"))


