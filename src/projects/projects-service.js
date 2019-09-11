const xss = require('xss')
const Treeize = require('treeize')

const ProjectsService = {
  getAllUsersProjects(db, user_id){
    return db
      .from('projector_projects')
      .where('user_id', user_id)
      .select('*')
  },

  getProjectById(db, project_id){
    return db
    .from('projector_projects')
    .select('*')
    .where('id', project_id)
  },

  insertProject(db, newProject){
    return db
      .insert(newProject)
      .into('projector_projects')
      .returning('*')
      .then(([project]) => project)
      .then(project => 
        ProjectsService.getProjectById(db, project.id)
        )
  },

  async validateProjectFields(db, newProject){
    const result = {}

    // check to make sure required fields are not null
    for(let key in newProject){
      if(!newProject[key]){
          result.error = `Missing ${key} in request body`
      }
    }

    // check if project name is white space
    if(newProject.project_name.trim() < 1){
      result.error = 'project_name cannot be white space'
    }

    // check that project_name is not already used
    const projectExists = await db('projector_projects')
      .where({project_name: newProject.project_name})
      .select('*')
      if(projectExists.length){
        result.error = 'project_name already exists'
      }

      return result
  },

  serializeProjects(projects){
    return projects.map(this.serializeProject)
  },

  serializeProject(project){
    console.log(project)

    const projectTree = new Treeize()

    // treeize only accepts arrays of objs, and we want to use a single obj
    const projectData = projectTree.grow(project).getData()[0];

    return {
      id: projectData.id,
      project_name: xss(projectData.project_name),
      location: projectData.location,
      budget_original: projectData.budget_original,
      budget_adjusted: projectData.budget_adjusted,
      amount_spent: projectData.amount_spent,
      date_created: projectData.date_created,
      date_modified: projectData.date_modified,
      user_id: projectData.user_id
    }
  }
}

module.exports = ProjectsService