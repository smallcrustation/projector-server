const express = require('express')
const ProjectsService = require('./projects-service')
const { requireAuth } = require('../middleware/jwt-auth')
const projectsRouter = express.Router()

projectsRouter
  .route('/')
  .get((req, res, next) => {
    ProjectsService.getAllProjects(req.app.get('db'))
    .then(projects => {
      res.json(ProjectsService.serializeProjects(projects))
    })    
  })
