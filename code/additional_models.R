# Additional model: pre-listener commentary

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

#going to have to do some re-processing
# because the "combined_chat" is pre-summarized (in a generally useful way)

#group 1


#group 2a


#group 2b


# group 3





