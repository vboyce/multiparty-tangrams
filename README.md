# Multi-party tangrams

## Reproducible paper pipeline

write-ups/manuscript/tangrams-manuscript.Rmd and write-ups/manuscript/supplement.Rmd should render. Due to emojis in tables, you will need to use LuaLaTex to go tex -> pdf which may be easiest in an external tex editor.

What gets used:
* manuscripts sources code/prep_ms.R which reads processed data files and combines
* model summaries and predictions are saved in code/paper_mods

Fuller pipeline:
- prep_processed_data.R - goes from raw empirica files to processed data files (note that it expects hand filtering of chat to occur at various points)
- run_sbert.R, sbert_play.ipynb, use_sbert_embeddings.R - prep for sbert embedding, embed, take sbert embeddings and return processed cosine sims
- mods_for_paper.R, additional_models.R, mega-analytic_mods.R -- model code for all models
- preds_for_paper.R takes models and outputs summarized predictions for plots
- prep_ms.R reads lots of processed data and does joins -- sourced by ms and supplement


## Guide to repo organization
- code: R and Py code for analyses
 - models contains large model files
- data: data files (un & pre-processed): study 1, 2a/2b/2c, 3 are relevant subfolders
- experiments: code and stuff to run experiments
- write-ups: paper-like things

Scripts and write-ups not described above may be broken / break things b/c of refactoring that has happened. Their use is deprecated. 


## Testing experiments

To develop locally, 

1. make sure you [have meteor installed](https://www.meteor.com/install), 
2. clone the repo, and run `meteor npm install` to get the dependencies
3. launch locally with `meteor --settings local.json` (the default admin password is `password` -- change this in `local.json`.
4. go to `http://localhost:3000/admin` in your browser


