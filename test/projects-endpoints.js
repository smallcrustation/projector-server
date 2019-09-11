require('./setup')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Projects Endpoints', () => {
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

  beforeEach('seed users table', () => {
    return helpers.seedUsers(db, testUsers)
  })

  // beforeEach('seed projector tables', () => {
  //   return helpers.seedProjectorTables(db, testUsers, testProjects) // RETURN PROMISES DAMNIT
  // })

  // const Endpoints = [
  //   {
  //     name: 'GET /api/projects/',
  //     path: '/api/projects/',
  //     method: supertest(app).get
  //   }
  // ]

  describe('GET /api/projects', () => {
    // test returns 200 and empty [] when no projects
    context('Given no projects', () => {
      it('responds with 200 and []', () => {
        const user = testUsers[0]
        return supertest(app)
          .get('/api/projects')
          .set('Authorization', helpers.makeAuthHeader(user))
          .expect(200, [])
      })
    })
  })
})
