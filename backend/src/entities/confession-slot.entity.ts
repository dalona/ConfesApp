import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Confession } from './confession.entity';
import { Parish } from './parish.entity';

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

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime' })
  endTime: Date;

  @Column({
    type: 'varchar',
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

  @ManyToOne(() => Parish, parish => parish.confessionSlots)
  @JoinColumn({ name: 'parishId' })
  parish: Parish;

  @OneToMany(() => Confession, confession => confession.confessionSlot)
  confessions: Confession[];
}