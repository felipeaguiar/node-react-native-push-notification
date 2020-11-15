import { createConnection, getConnection, ConnectionOptions } from 'typeorm';
import moment from 'moment';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const config: any = {
  type: 'sqlite',
  logging: false,
  synchronize: true,
  entities: [
    'src/model/**/*.ts'
  ],
  migrations: [
    'src/migration/**/*.ts'
  ],
  subscribers: [
    'src/subscriber/**/*.ts'
  ]
};

const db = {
  async create(nome: string) {
    const date = moment().format('YYYY-MM-DD_HH-mm-ss-SSS');
    config.database = `test/db_${nome}_${date}.sqlite`;
    await createConnection(config);
  },

  async close() {
    await getConnection().close();
  },

  async dump() {
    const result: any = {};
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      const value = await repository.find();

      if (value.length) {
        result[entity.name] = value;
      }
    }

    return result;
  },

  async createUser() {
    const connection = getConnection();
    const password = await bcrypt.hash('123456', 10);

    await connection.query(`INSERT INTO usuario(nome, email, senha, papel, version)
      VALUES ('Admin', 'admin@desafio.com', '${password}', 'admin', 1)`);
  },

  async exec(statement: string) {
    const connection = getConnection();
    await connection.query(statement);
  }
};

export default db;
