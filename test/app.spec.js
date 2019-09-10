const app = require('../src/app')

describe('App', () => {
  it('GET / responds with 200 containing "Hell, World"', () => {
    return supertest(app)
    .get('/')
    .expect(200, 'Hell, World')
  })
})