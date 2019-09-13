const xss = require('xss')

const PaymentsService = {
  async validatePayment(db, newPayment) {
    result = {}

    // console.log(newPayment)
    // check key/val's exist
    for (let [key, val] of Object.entries(newPayment)) {
      if (!val) {
        return (result.error = `${key} is required`)
      }
    }

    // check if user has access to project.
    const canAccessProject = await db('projector_projects')
      .select('*')
      .where({ id: newPayment.project_id })
      .andWhere({ user_id: newPayment.user_id })

    if (canAccessProject.length < 1) {
      throw 'Access Denied'
    }

    // validate $
    if (newPayment.total_amount < 0) {
      result.error = `total_amount must be positive`
    }
    const regex = /^\d+(?:\.\d{0,2})$/
    if (!regex.test(newPayment.total_amount)) result.error = 'total_amount is invalid'

    return result
  },

  sanitize(newPayment){
    return{
      payment_number: xss(newPayment.payment_number), 
      total_amount: xss(newPayment.total_amount), 
      project_id: xss(newPayment.project_id),
      user_id: newPayment.user_id
    }
  },

  insertPayment(db, cleanPayment){
    return db('projector_payments')
      .insert(cleanPayment)
      .returning('*')
  }

}

module.exports = PaymentsService
