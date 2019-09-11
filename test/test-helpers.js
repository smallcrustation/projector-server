const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

// USERS HELPERS
function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'User1',
      email: 'user1@gmail.com',
      password: 'password',
      date_created: '2019-01-22T12:12:12.666Z'
    },
    {
      id: 2,
      username: 'User2',
      email: 'user2@gmail.com',
      password: 'password',
      date_created: '2019-01-22T12:12:12.666Z'
    },
    {
      id: 3,
      username: 'User3',
      email: 'user3@gmail.com',
      password: 'password',
      date_created: '2019-01-22T12:12:12.666Z'
    }
  ]
}

function seedUsers(db, users) {
  const hashedPassUsers = users.map(user => {
    return { ...user, password: bcrypt.hashSync(user.password, 1) }
  })

  return db.from('projector_users').insert(hashedPassUsers)
}

// PROJECTS HELPERS
function makeProjectsArray() {
  return [
    {
      id: 1,
      project_name: 'Project1',
      location: 'test1',
      budget_original: 111.0,
      date_created: '2019-09-11T21:54:23.019Z',
      user_id: 1
    },
    {
      id: 2,
      project_name: 'Project2',
      location: 'test2',
      budget_original: 222.0,
      date_created: '2019-09-11T21:54:23.019Z',
      user_id: 2
    },
    {
      id: 3,
      project_name: 'Project3',
      location: 'test3',
      budget_original: 333.0,
      date_created: '2019-09-11T21:54:23.019Z',
      user_id: 3
    },
    {
      id: 4,
      project_name: 'Project4',
      location: 'test4',
      budget_original: 444.0,
      date_created: '2019-09-11T21:54:23.019Z',
      user_id: 1
    },
    {
      id: 5,
      project_name: 'Project5',
      location: 'test5',
      budget_original: 555.0,
      date_created: '2019-09-11T21:54:23.019Z',
      user_id: 1
    }
  ]
}

function seedProjects(db, projects) {
  return db('projector_projects').insert(projects)
}

// OTHER
function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      projector_users,
      projector_projects
      RESTART IDENTITY CASCADE;`
  )
}

function makeProjectorFixtures() {
  return {
    testUsers: makeUsersArray(),
    testProjects: makeProjectsArray()
  }
}

function seedProjectorTables(db, users, projects) {
  return db
    .into('projector_users')
    .insert(users)
    .then(() => db.into('projector_projects').insert(projects))
    .catch(console.log)
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  // console.log(user)
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256'
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeProjectsArray,
  cleanTables,
  makeProjectorFixtures,
  seedProjectorTables,
  makeAuthHeader,
  seedUsers
}
