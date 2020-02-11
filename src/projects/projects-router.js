const express = require('express')
const ProjectsService = require('./projects-service')
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

// GET OR DELETE project by id
projectsRouter
  .route('/:project_id')
  .get(async (req, res, next) => {
    try {
      const project = await ProjectsService.getProjectById(
        req.app.get('db'),
        req.params.project_id,
        req.user.id
      )

      const calculatedProject = await ProjectsService.projectCalcs(
        req.app.get('db'),
        project
      )

      res.json(ProjectsService.serializeProject(calculatedProject))
    } catch (err) {
      next(err)
    }

  })
  .delete(async (req, res, next) => {
    try{
      ProjectsService.deleteProjectById(
        res.app.get('db'),
        req.params.project_id,
        req.user.id
      )

      res.status(200).end()

    } catch (err){
      // console.log('err')
      next(err)
    }
  })

// ADD PROJECTS ROUTER
// projectsRouter.use('/:project_id/paymentsRequest', )

projectsRouter.route('/:project_id/payments').get(async (req, res, next) => {
  try {
    const payments = await ProjectsService.getPaymentsForProject(
      req.app.get('db'),
      req.params.project_id,
      req.user.id
    )
    // console.log(payments)
    // console.log(ProjectsService.serializePayments(payments))
    res.json(ProjectsService.serializePayments(payments))
  } catch (err) {
    next(err)
  }
})

projectsRouter.route('/').post(jsonBodyParser, async (req, res, next) => {
  const { project_name, location, budget_original } = req.body
  const newProject = { project_name, location, budget_original }
  const user = req.user

  try {
    const result = await ProjectsService.validateProjectFields(
      req.app.get('db'),
      newProject,
      user
    )
    if (result.error) {
      return res.status(400).json(result)
    }

    newProject.user_id = user.id
    // console.log(newProject)
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
