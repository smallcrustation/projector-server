const xss = require('xss')
const Treeize = require('treeize')

const ProjectsService = {
  getAllUsersProjects(db, user_id) {
    return db
      .from('projector_projects')
      .where('user_id', user_id)
      .select('*')
  },

  async getProjectById(db, project_id, user_id) {
    const project = await db
      .from('projector_projects')
      .select('*')
      .where({ id: project_id })
      .andWhere({ user_id })

    if (project.length < 1) {
      throw 'Not Authorized'
    }

    return project
  },

  async deleteProjectById(db, project_id, user_id) {
    try{
      const delProj = await db('projector_projects')
        .where({ id: project_id })
        .andWhere({ user_id })
        .del()
      
        return delProj
    } catch(e){
      console.log(e)
    }
   
  },

  async projectCalcs(db, project) {
    project = project[0]
    const budget_total = !project.budget_adjusted
      ? parseFloat(project.budget_original) // if there isn't an adjusted budget
      : parseFloat(project.budget_original) +
        parseFloat(project.budget_adjusted)

    try {
      const payments = await this.getPaymentsForProject(db, project.id)
      // check if there are payments
      if (payments.length > 0) {
        // console.log('payments!')
        let total_completed = 0.0
        payments.forEach(
          payment => (total_completed += parseFloat(payment.total_amount))
        )

        const total_prev_payments =
          total_completed - payments[payments.length - 1].total_amount

        const current_payment = total_completed - total_prev_payments

        return {
          ...project,
          budget_total,
          total_completed,
          total_prev_payments,
          current_payment
        }
      }
      return {
        ...project,
        budget_total,
        total_completed: 0,
        total_prev_payments: 0,
        current_payment: 0
      }
    } catch (err) {
      return res(400).json({ error: err })
    }
  },

  insertProject(db, newProject) {
    return db
      .insert(newProject)
      .into('projector_projects')
      .returning('*')
      .then(([project]) => project)
      .then(project =>
        ProjectsService.getProjectById(db, project.id, project.user_id)
      )
  },

  getPaymentsForProject(db, project_id) {
    // console.log('getPaymentsForProject: ', project_id)
    return db('projector_payments')
      .select('*')
      .where('project_id', project_id)
  },

  async validateProjectFields(db, newProject, user) {
    const result = {}

    // check to make sure required fields are not null
    for (let key in newProject) {
      if (!newProject[key]) {
        result.error = `Missing ${key} in request body`
      }
    }

    // check if project name is white space
    if (newProject.project_name.trim() < 1) {
      result.error = 'project_name cannot be white space'
    }

    // check that project_name is not already used
    const projectExists = await db('projector_projects')
      .where({ project_name: newProject.project_name })
      // .where({user_id: user.id})
      .select('*')
    if (projectExists.length) {
      result.error = 'project_name already exists'
    }

    return result
  },

  serializeProjects(projects) {
    return projects.map(this.serializeProject)
  },

  serializeProject(project) {
    // console.log('PROJECT', project)

    const projectTree = new Treeize()

    // treeize only accepts arrays of objs, and we want to use a single obj
    if (!Array.isArray(project)) {
      project = [project]
    }

    const projectData = projectTree.grow(project).getData()[0]

    // console.log('PROJECT TREE', projectData)
    return {
      id: projectData.id,
      project_name: xss(projectData.project_name),
      location: xss(projectData.location),
      budget_original: xss(projectData.budget_original),
      budget_adjusted: projectData.budget_adjusted,
      amount_spent: projectData.amount_spent,
      date_created: projectData.date_created,
      date_modified: projectData.date_modified,
      user_id: projectData.user_id,
      budget_total: projectData.budget_total,
      total_completed: projectData.total_completed,
      total_prev_payments: projectData.total_prev_payments,
      current_payment: projectData.current_payment
    }
  },

  serializePayments(payment) {
    return payment.map(this.serializePayment)
  },

  serializePayment(payment) {
    const projectTree = new Treeize()

    // treeize only accepts arrays of objs, and we want to use a single obj
    if (!Array.isArray(payment)) {
      payment = [payment]
    }

    const paymentData = projectTree.grow(payment).getData()[0]

    // console.log('payment TREE', paymentData)
    return {
      id: paymentData.id,
      payment_number: xss(paymentData.payment_number),
      total_amount: xss(paymentData.total_amount),
      date_created: paymentData.date_created,
      date_modified: paymentData.date_modified,
      project_id: paymentData.project_id
    }
  }
}

module.exports = ProjectsService
