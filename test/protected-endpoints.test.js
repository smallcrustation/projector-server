require('./setup')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Protected Endpoints', () => {
  let db

  const { testUsers, testProjects } = helpers.makeProjectorFixtures()

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

  beforeEach('seed projector tables', () => {
    helpers.seedProjectorTables(db, testUsers, testProjects)
  })

  const protectedEndpoints = [
    {
      name: 'GET /api/projects/',
      path: '/api/projects/',
      method: supertest(app).get
    }
  ]

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it('responds 404 "Missing bearer token" if no token provided', () => {
        return endpoint.method(endpoint.path)
        .expect(401, {error: 'Missing Bearer token'})
      })
      it('responds 401 "Unauthorized request" when invalid JWT secret', () =>{
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0], 'badSecret'))
          .expect(401, {error: 'Unauthorized request'})
      })
      
    })
  })
})
