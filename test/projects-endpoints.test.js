require('./setup')
const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Projects Endpoints', () => {
  let db

  const { testUsers, testProjects } = helpers.makeProjectorFixtures()

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

  // beforeEach('seed projector tables', () => {
  //   return helpers.seedProjectorTables(db, testUsers, testProjects) // RETURN PROMISES DAMNIT
  // })

  describe('GET /api/projects', () => {
    // test returns 200 and empty [] when no projects
    context('Given no projects', () => {
      beforeEach('seed users table', () => {
        return helpers.seedUsers(db, testUsers)
      })
      it('responds with 200 and []', () => {
        const user = testUsers[0]
        return supertest(app)
          .get('/api/projects')
          .set('Authorization', helpers.makeAuthHeader(user))
          .expect(200, [])
      })
    })

    context('Given projects', () => {
      beforeEach('seed projector tables', () => {
        helpers.seedProjectorTables(db, testUsers, testProjects)
      })

      it('responds with 200 and a list of projects', () => {
        
        const user = testUsers[0]
        return supertest(app)
          .get('/api/projects')
          .set('Authorization', helpers.makeAuthHeader(user))
          .expect(200, testProjects)
            // expect(res).to.have.property.of('projects')
      })
    })
  })
})
