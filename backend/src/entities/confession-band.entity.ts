import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Confession } from './confession.entity';
import { Parish } from './parish.entity';

export enum BandStatus {
  AVAILABLE = 'available',
  FULL = 'full',
  CANCELLED = 'cancelled',
}

export enum RecurrenceType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

@Entity('confession_bands')
export class ConfessionBand {
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
    default: BandStatus.AVAILABLE,
  })
  status: BandStatus;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  parishId: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ default: 1 })
  maxCapacity: number;

  @Column({ default: 0 })
  currentBookings: number;

  // Recurrence fields
  @Column({
    type: 'varchar',
    default: RecurrenceType.NONE,
  })
  recurrenceType: RecurrenceType;

  @Column({ nullable: true })
  recurrenceDays: string; // JSON array of days [1,2,3,4,5] for Mon-Fri

  @Column({ type: 'datetime', nullable: true })
  recurrenceEndDate: Date;

  @Column({ default: false })
  isRecurrent: boolean;

  @Column({ nullable: true })
  parentBandId: string; // For recurring bands, reference to the original

  @CreateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.confessionBands)
  @JoinColumn({ name: 'priestId' })
  priest: User;

  @ManyToOne(() => Parish, parish => parish.confessionBands)
  @JoinColumn({ name: 'parishId' })
  parish: Parish;

  @OneToMany(() => Confession, confession => confession.confessionBand)
  confessions: Confession[];

  @ManyToOne(() => ConfessionBand, band => band.childBands)
  @JoinColumn({ name: 'parentBandId' })
  parentBand: ConfessionBand;

  @OneToMany(() => ConfessionBand, band => band.parentBand)
  childBands: ConfessionBand[];
}