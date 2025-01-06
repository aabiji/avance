# Avance

**Avance is still under heavy development.**

Avance is an app for tracking your weight, food intake and exercises.
I had been looking for a free app that did those 3 three things, but I couldn't find anything satisfactory.
So Avance was born out of that necessity.

Tech stack:
- Frontend and backend in Typescript
- Frontend using React Native and various React Native libraries
- REST API backend using ExpressJS
- Database using Postgresql
    - ** Actually, what if we let each user have their own sqlite database? Then it'd just be a matter of querying their specific .db file**
- Authentication using magic links and JWTs
- Deployment using Docker and Azure
