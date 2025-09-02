import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { ConfessionSlot } from './confession-slot.entity';
import { ConfessionBand } from './confession-band.entity';

export enum ConfessionStatus {
  BOOKED = 'booked',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

@Entity('confessions')
export class Confession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  faithfulId: string;

  @Column({ nullable: true })
  confessionSlotId: string;

  @Column({
    type: 'varchar',
    default: ConfessionStatus.BOOKED,
  })
  status: ConfessionStatus;

  @Column({ type: 'datetime' })
  scheduledTime: Date;

  @Column({ nullable: true })
  confessionBandId: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  preparationNotes: string;

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.confessions)
  @JoinColumn({ name: 'faithfulId' })
  faithful: User;

  @ManyToOne(() => ConfessionSlot, confessionSlot => confessionSlot.confessions)
  @JoinColumn({ name: 'confessionSlotId' })
  confessionSlot: ConfessionSlot;

  @ManyToOne(() => ConfessionBand, band => band.confessions)
  @JoinColumn({ name: 'confessionBandId' })
  confessionBand: ConfessionBand;
}