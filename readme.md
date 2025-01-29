# Avance

Things to do before the MVP:
- Execise page
    - [ ] Fix the uplicate key error when creating a new exercise
    - [ ] Play sounds when changing HIIT session
- Weight page -> should we use a custom graph implementation???
    - [ ] Remove the dead space at the end of the graph
    - [ ] Use an algorithm to simplify the graph when there are too many data points
    - [ ] Don't allow the graph labels to get so squished
    - [ ] Show the info for the data point on hover
    - [ ] Center the data point if the graph is empty (only 1 data point)
    - [ ] When grouping by weeks, it should start on sunday, not monday
- Auth page
    - [ ] Don't show the auth screen at all if the user is already logged in
- Backend
    - [ ] Switch from sqlite to postgresql
    - [ ] Package app into docker container