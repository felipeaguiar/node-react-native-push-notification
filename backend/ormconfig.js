const config = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectTimeout: 100000,
  acquireTimeout: 100000,
  synchronize: false,
  logging: Boolean(process.env.DB_LOGGING),
  entities: [
    'src/model/**/*.ts'
  ],
  migrations: [
    'src/migration/**/*.ts'
  ],
  subscribers: [
    'src/subscriber/**/*.ts'
  ],
  cli: {
    entitiesDir: 'src/model/',
    migrationsDir: 'src/migration/'
  }
};

if (process.env.JS) {
  config.entities = ['dist/model/**/*.js'];
  config.migrations = ['dist/migration/**/*.js'];
  config.subscribers = ['dist/subscriber/**/*.js'];
}

module.exports = config;
