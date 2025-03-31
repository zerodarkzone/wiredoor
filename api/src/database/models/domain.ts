import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum SSLTermination {
  SelfSigned = 'self-signed',
  Certbot = 'certbot',
}

export interface SSLCerts {
  fullchain: string;
  privkey: string;
}

@Entity('domains')
export class Domain {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({
    length: 40,
  })
  domain: string;

  @Column({
    default: SSLTermination.SelfSigned,
  })
  ssl: string;

  @Exclude()
  @Column('simple-json', {
    nullable: true,
  })
  sslPair: SSLCerts;

  @Column({
    default: false,
  })
  skipValidation: boolean;

  @CreateDateColumn()
  //@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  created_at: Date;

  @UpdateDateColumn()
  //@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updated_at: Date;
}
