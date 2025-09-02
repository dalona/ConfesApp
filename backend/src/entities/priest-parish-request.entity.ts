import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Parish } from './parish.entity';

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('priest_parish_requests')
export class PriestParishRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  priestId: string;

  @Column()
  parishId: string;

  @Column({
    type: 'varchar',
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'text', nullable: true })
  responseMessage: string;

  @Column({ nullable: true })
  reviewedByUserId: string;

  @Column({ type: 'datetime', nullable: true })
  reviewedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  requestedStartDate: Date;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'priestId' })
  priest: User;

  @ManyToOne(() => Parish)
  @JoinColumn({ name: 'parishId' })
  parish: Parish;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reviewedByUserId' })
  reviewedBy: User;
}