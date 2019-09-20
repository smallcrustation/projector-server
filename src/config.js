module.exports = {
  PORT: process.env.PORT || 8000,

  NODE_ENV: process.env.NODE_ENV || 'development',

  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://krill@localhost/projector',

  CLIENT_ORIGIN: process.env.NODE_ENV === 'production'?
    'https://projector.krill.now.sh':'http://localhost:3000',

  JWT_SECRET: process.env.JWT_SECRET || 'secret',
}