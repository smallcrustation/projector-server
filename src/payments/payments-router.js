const PaymentsService = require('./payments-service')
const express = require('express')
const paymentsRouter = express.Router()
const bodyParser = express.json()

paymentsRouter.route('/')
  .post(bodyParser, async (req, res, next) => {
    // get data from req, make the payment object, sanitize, insert it into db
    const {payment_number, total_amount, project_id} = req.body // project_id comes from react
    const user = req.user

    const newPayment = {payment_number, total_amount, project_id, user_id : user.id}

    // check that project is correct & project belongs to user
    try{
      const validatePayment = await PaymentsService.validatePayment( req.app.get('db'), newPayment)
      // console.log(validatePayment.error)
      if(validatePayment.error){
        // console.log('error')
        return res.status(400).json(validatePayment)
      }

      // sanitize
      const cleanNewPayment = PaymentsService.sanitize(newPayment)
      // console.log(cleanNewPayment)

      const savedPayment = await PaymentsService.insertPayment(req.app.get('db'), cleanNewPayment)

      return res.status(200).json(savedPayment)

    }catch(err){
      next(err)
    }

  })

  module.exports = paymentsRouter