const app = require('./app')
const knex = require('knex')
const { PORT, DATABASE_URL, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } = require('./config')

const db = knex({
  client: 'pg',
  connection: {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    // connectionSting: DATABASE_URL,
    ssl: true
  }
})

app.set('db', db)

app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server listening at http://localhost:${PORT}`)
  }
})
