# Avance

Things to do before the MVP:
- Weight page -> should we use a custom graph implementation???
    - [ ] Remove the dead space at the end of the graph
    - [ ] Use an algorithm to simplify the graph when there are too many data points
    - [ ] Don't allow the graph labels to get so squished
    - [ ] Show the info for the data point on hover
    - [ ] Center the data point if the graph is empty (only 1 data point)
    - [ ] When grouping by weeks, it should start on sunday, not monday
- What to do when the requests fail? (or the user has slow wifi??)
- Backend
    - [ ] Switch from sqlite to postgresql
    - [ ] Package app into docker container