import { MigrationInterface, QueryRunner } from 'typeorm';
import bcrypt from 'bcryptjs';

export class Data implements MigrationInterface {

  name = 'data1604967389721'

  public async up(queryRunner: QueryRunner): Promise<void> {
    const senha = process.env.APP_ADMIN_PASSWORD as string;
    const password = await bcrypt.hash(senha, 10);

    await queryRunner.query(`INSERT INTO usuario(nome, email, senha, papel, reset_token, validade, version, created_at, updated_at)
      VALUES ('Admin', 'admin@desafio.com', '${password}', 'admin', DEFAULT, DEFAULT, 1, DEFAULT, DEFAULT)`);

    await queryRunner.query(`INSERT INTO grupo (nome, version, created_at, updated_at) VALUES ('Grupo Stark', 1, DEFAULT, DEFAULT)`);
    await queryRunner.query(`INSERT INTO grupo (nome, version, created_at, updated_at) VALUES ('Grupo Lannister', 1, DEFAULT, DEFAULT)`);
    await queryRunner.query(`INSERT INTO grupo (nome, version, created_at, updated_at) VALUES ('Grupo Targaryen', 1, DEFAULT, DEFAULT)`);
    await queryRunner.query(`INSERT INTO grupo (nome, version, created_at, updated_at) VALUES ('Grupo Baratheon', 1, DEFAULT, DEFAULT)`);
    await queryRunner.query(`INSERT INTO grupo (nome, version, created_at, updated_at) VALUES ('Grupo Tyrell', 1, DEFAULT, DEFAULT)`);
    await queryRunner.query(`INSERT INTO grupo (nome, version, created_at, updated_at) VALUES ('Grupo Greyjoy', 1, DEFAULT, DEFAULT)`);
    await queryRunner.query(`INSERT INTO grupo (nome, version, created_at, updated_at) VALUES ('Grupo Mormont', 1, DEFAULT, DEFAULT)`);
    await queryRunner.query(`INSERT INTO grupo (nome, version, created_at, updated_at) VALUES ('Grupo Bolton', 1, DEFAULT, DEFAULT)`);
    await queryRunner.query(`INSERT INTO grupo (nome, version, created_at, updated_at) VALUES ('Grupo Frey', 1, DEFAULT, DEFAULT)`);
    await queryRunner.query(`INSERT INTO grupo (nome, version, created_at, updated_at) VALUES ('Grupo Tully', 1, DEFAULT, DEFAULT)`);
    await queryRunner.query(`INSERT INTO grupo (nome, version, created_at, updated_at) VALUES ('Grupo Arryn', 1, DEFAULT, DEFAULT)`);
    await queryRunner.query(`INSERT INTO grupo (nome, version, created_at, updated_at) VALUES ('Grupo Martell', 1, DEFAULT, DEFAULT)`);
    await queryRunner.query(`INSERT INTO grupo (nome, version, created_at, updated_at) VALUES ('Grupo Tarly', 1, DEFAULT, DEFAULT)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM usuario`);
    await queryRunner.query(`DELETE FROM grupo`);
  }

}
