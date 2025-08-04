import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Confession } from './confession.entity';

export enum SlotStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

@Entity('confession_slots')
export class ConfessionSlot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  priestId: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({
    type: 'enum',
    enum: SlotStatus,
    default: SlotStatus.AVAILABLE,
  })
  status: SlotStatus;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  parishId: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: 1 })
  maxBookings: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.confessionSlots)
  @JoinColumn({ name: 'priestId' })
  priest: User;

  @OneToMany(() => Confession, confession => confession.confessionSlot)
  confessions: Confession[];
}