## Projector
-----
Projector keeps track of your projects by your projects budget as you make payment requests.

Base Url:
https://ancient-mesa-23863.herokuapp.com/api

Endpoints

POST /auth/login
Log's into an account if it exists, creates jsonwebtoken
key      - value
username - string
password - string

POST /users
Creates a new user account
key - value
username - string, cannot start or end with empty space
email    - string cannot start or end with empty space
password - string cannot start or end with empty space, between 4 and 72 characters

GET /projects
gets all projects for user with users jsonwebtoken
key - value

GET /projects/[id]
gets project with id id user has project users jsonwebtoken
key - value

POST /projects
creates a new project for user with users jsonwebtoken
key - value
project_id - integer
user_id - integer

GET /projects/[project_id]/payments
gets payments for project if projects user matches users jsonwebtoken

POST /payments
key - value
total_amount - decimal with no more than 2 decimals


Authorization : `Bearer ${TokenService.getAuthToken()}`,




---

https://projector.krill.now.sh/

link to client: https://github.com/smallcrustation/projector-client