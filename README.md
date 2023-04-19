# FYP
This is an experiment powered by
[Empirica](https://empirica.ly/) (here is a basic
[tutorial](https://www.youtube.com/watch?v=K2YhEZey_58&list=PLPQelvUwyVgiawBDk3Sp74QMfL8RPgORW&index=1)).

## Testing

To develop locally, 

1. make sure you [have meteor installed](https://www.meteor.com/install), 
2. clone the repo, and run `meteor npm install` to get the dependencies
3. launch locally with `meteor --settings local.json` (the default admin password is `password` -- change this in `local.json`.
4. go to `http://localhost:3000/admin` in your browser

## Guide to repo organization
- code: R and Py code for analyses
 - models contains large model files
- data: data files (un & pre-processed)
 - study1 has the real stuff
 	- content has some files output by Py processing
- experiments: code and stuff to run experiments
- write-ups: paper-like things

## Detailed workflow
- raw data (from empirica/experiment runs) is in data/ 1ab,2abc, 3
- raw data is turned into less raw data, including exporting/tagging for non-relevant lines and reimporting, and excluding incomplete parts of games  by prep_processed_data.R
- sbert data is created with run_sbert.R and sbert_play.ipynb (note that sbert data is in 2c for 1-2 and 3 for 3)
- sbert data is used to create similarities in use_sbert_embeddings.R 