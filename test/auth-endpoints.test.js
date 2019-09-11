require('./setup')
const knex = require('knex')
const app = require('../src/app')
const jwt = require('jsonwebtoken')
const helpers = require('./test-helpers')

describe('Auth Endpoints', () => {
  let db 
  
  // why is knex in before and not above
  before('connect to db', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL
    })

    app.set('db', db)
  })

  after('Disconnect from db', () => db.destroy())
  before('cleanup', () => helpers.cleanTables(db))
  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('POST /api/auth/login', () => {
    const testUsers = helpers.makeUsersArray()
    beforeEach('seed users', () => helpers.seedUsers(db, testUsers))

    const requiredFields = ['']
    
  })

})