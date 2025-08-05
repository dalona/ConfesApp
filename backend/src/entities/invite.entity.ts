import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Diocese } from './diocese.entity';
import { Parish } from './parish.entity';

export enum InviteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

export enum InviteRole {
  PRIEST = 'priest',
  PARISH_STAFF = 'parish_staff',
  PARISH_COORDINATOR = 'parish_coordinator',
}

@Entity('invites')
export class Invite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({
    type: 'varchar',
    default: InviteRole.PRIEST,
  })
  role: InviteRole;

  @Column()
  dioceseId: string;

  @Column({ nullable: true })
  parishId: string;

  @Column({ unique: true })
  token: string;

  @Column()
  expiresAt: Date;

  @Column()
  createdByUserId: string;

  @Column({
    type: 'varchar',
    default: InviteStatus.PENDING,
  })
  status: InviteStatus;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ nullable: true })
  acceptedByUserId: string;

  @Column({ nullable: true })
  acceptedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Diocese)
  @JoinColumn({ name: 'dioceseId' })
  diocese: Diocese;

  @ManyToOne(() => Parish, { nullable: true })
  @JoinColumn({ name: 'parishId' })
  parish: Parish;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdByUserId' })
  createdBy: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'acceptedByUserId' })
  acceptedBy: User;
}