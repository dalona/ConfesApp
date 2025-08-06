import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Diocese } from './diocese.entity';
import { ParishStaff } from './parish-staff.entity';
import { PriestParishHistory } from './priest-parish-history.entity';
import { ConfessionSlot } from './confession-slot.entity';
import { ConfessionBand } from './confession-band.entity';

@Entity('parishes')
export class Parish {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  dioceseId: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  postalCode: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  googlePlaceId: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number;

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  foundedDate: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  massSchedule: string[];

  @Column({ type: 'simple-array', nullable: true })
  confessionSchedule: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Diocese, diocese => diocese.parishes)
  @JoinColumn({ name: 'dioceseId' })
  diocese: Diocese;

  @OneToMany(() => ParishStaff, parishStaff => parishStaff.parish)
  parishStaff: ParishStaff[];

  @OneToMany(() => PriestParishHistory, history => history.parish)
  priestHistory: PriestParishHistory[];

  @OneToMany(() => ConfessionSlot, confessionSlot => confessionSlot.parish)
  confessionSlots: ConfessionSlot[];

  @OneToMany(() => ConfessionBand, band => band.parish)
  confessionBands: ConfessionBand[];
}