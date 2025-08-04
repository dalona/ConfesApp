import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Parish } from './parish.entity';

export enum ParishStaffRole {
  PRIEST = 'priest',
  VOLUNTEER = 'volunteer',
  ADMIN = 'admin',
}

@Entity('parish_staff')
export class ParishStaff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  parishId: string;

  @Column({
    type: 'varchar',
    default: ParishStaffRole.VOLUNTEER,
  })
  role: ParishStaffRole;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  responsibilities: string;

  @Column({ nullable: true })
  assignedByUserId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Parish, parish => parish.parishStaff)
  @JoinColumn({ name: 'parishId' })
  parish: Parish;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assignedByUserId' })
  assignedBy: User;
}