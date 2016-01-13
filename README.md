# poucedorREST

## Background
"Le Pouce d'Or" is a hitchhiking contest. 
It involves more than 23 schools and more than 400 participants.
www.poucedor.fr

This is a REST Server allowing users to see the leaderboard for the distance each team has hitchiked.

## Prerequisites
- Mongoose
- NodeJS

## Installation
Before running the server, it is important to create `config/secret.js` exporting a function returning a string. This string is used as the secret for JSON web tokens.

```
npm install
npm start
```

## Use
When the server is started on port 8080 or `$PORT` if specified, it opens up the following routes:

### GET
-api/v1/teams/simple
-api/v1/teams

### POST
-api/v1/login
-api/v1/teams/:id/positions
-api/v1/teams
-api/v1/universities
