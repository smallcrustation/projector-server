module.exports = {
  PORT: process.env.PORT || 8000,

  NODE_ENV: process.env.NODE_ENV || 'development',

  DATABASE_URL: process.env.NODE_ENV === 'production'?
  process.env.DATABASE_URL : process.env.LOCAL_DB_URL,

  CLIENT_ORIGIN: process.env.NODE_ENV === 'production'?
    'https://projector.krill.now.sh':'http://localhost:3000',

  JWT_SECRET: process.env.JWT_SECRET || 'secret',
}