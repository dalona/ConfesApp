import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Parish } from './parish.entity';

@Entity('priest_parish_history')
export class PriestParishHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  priestId: string;

  @Column()
  parishId: string;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime', nullable: true })
  endDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  assignedByUserId: string;

  @Column({ type: 'text', nullable: true })
  assignmentReason: string;

  @Column({ type: 'text', nullable: true })
  endReason: string;

  @Column({ nullable: true })
  endedByUserId: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'priestId' })
  priest: User;

  @ManyToOne(() => Parish, parish => parish.priestHistory)
  @JoinColumn({ name: 'parishId' })
  parish: Parish;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assignedByUserId' })
  assignedBy: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'endedByUserId' })
  endedBy: User;
}