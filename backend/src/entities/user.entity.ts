import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { ConfessionSlot } from './confession-slot.entity';
import { ConfessionBand } from './confession-band.entity';
import { Confession } from './confession.entity';
import { Diocese } from './diocese.entity';
import { ParishStaff } from './parish-staff.entity';
import { PriestParishRequest } from './priest-parish-request.entity';
import { PriestParishHistory } from './priest-parish-history.entity';

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
    type: 'varchar',
    default: UserRole.FAITHFUL,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  dioceseId: string;

  @Column({ nullable: true })
  currentParishId: string;

  @Column({ default: 'es' })
  language: string;

  // Priest-specific fields
  @Column({ default: false })
  canConfess: boolean;

  @Column({ default: true })
  available: boolean;

  @Column({ nullable: true })
  ordinationDate: Date;

  // Contact information
  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => ConfessionSlot, confessionSlot => confessionSlot.priest)
  confessionSlots: ConfessionSlot[];

  @OneToMany(() => Confession, confession => confession.faithful)
  confessions: Confession[];

  @OneToOne(() => Diocese, diocese => diocese.bishop)
  diocese: Diocese;

  @OneToMany(() => ParishStaff, parishStaff => parishStaff.user)
  parishStaffRoles: ParishStaff[];

  @OneToMany(() => PriestParishRequest, request => request.priest)
  parishRequests: PriestParishRequest[];

  @OneToMany(() => PriestParishHistory, history => history.priest)
  parishHistory: PriestParishHistory[];
}