import { Entity, BaseEntity, PrimaryGeneratedColumn, VersionColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToMany } from 'typeorm';
import { Usuario } from './usuario';

@Entity()
export class Grupo extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @ManyToMany(type => Usuario, usuarios => usuarios.grupos)
  usuarios: Usuario;

  @VersionColumn()
  version: number;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt?: Date;

}
