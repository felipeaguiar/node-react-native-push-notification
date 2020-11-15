import { Entity, BaseEntity, PrimaryGeneratedColumn, VersionColumn, CreateDateColumn, UpdateDateColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Grupo } from './grupo';

@Entity()
export class Usuario extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', nullable: true, select: false })
  senha?: string | null;

  @Column()
  papel: string;

  @Column({ type: 'varchar', nullable: true, name: 'reset_token', select: false })
  resetToken?: string | null;

  @Column({ type: 'datetime', nullable: true, select: false })
  validade?: Date | null;

  @ManyToMany(type => Grupo, grupos => grupos.usuarios)
  @JoinTable()
  grupos: Grupo[];

  @VersionColumn()
  version: number;

  @CreateDateColumn({ name: 'created_at', select: false })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', select: false })
  updatedAt?: Date;

}
