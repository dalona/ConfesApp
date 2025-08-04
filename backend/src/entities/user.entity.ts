import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ConfessionSlot } from './confession-slot.entity';
import { Confession } from './confession.entity';

export enum UserRole {
  FAITHFUL = 'faithful',
  PRIEST = 'priest',
  PARISH_STAFF = 'parish_staff',
  BISHOP = 'bishop',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.FAITHFUL,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  parishId: string;

  @Column({ default: 'es' })
  language: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => ConfessionSlot, confessionSlot => confessionSlot.priest)
  confessionSlots: ConfessionSlot[];

  @OneToMany(() => Confession, confession => confession.faithful)
  confessions: Confession[];
}