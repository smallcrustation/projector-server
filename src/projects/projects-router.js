const express = require('express')
const ProjectsService = require('./projects-service')
const { requireAuth } = require('../middleware/jwt-auth')
const projectsRouter = express.Router()
const jsonBodyParser = express.json()

projectsRouter
  .route('/')
  // .all(requireAuth) // user attached to req after verification
  .get((req, res, next) => {
    // console.log(req.user)
    ProjectsService.getAllUsersProjects(req.app.get('db'), req.user.id)
      .then(projects => {
        res.json(ProjectsService.serializeProjects(projects))
      })
      .catch(next)
  })

projectsRouter.route('/').post(jsonBodyParser, async (req, res, next) => {
  const { project_name, location, budget_original } = req.body
  const newProject = { project_name, location, budget_original }

  try {
    const result = await ProjectsService.validateProjectFields(
      req.app.get('db'),
      newProject
    )
    if (result.error) {
      return res.status(404).json(result)
    }

    newProject.user_id = req.user.id
    const savedProject = await ProjectsService.insertProject(
      req.app.get('db'),
      newProject
    )
    return res.status(201).json(ProjectsService.serializeProject(savedProject))
  } catch (err) {
    next(err)
  }
})

module.exports = projectsRouter
