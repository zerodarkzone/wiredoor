import { Exclude } from 'class-transformer';
import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('wg_interfaces')
export class WgInterface {
  @Column()
  @Index({ unique: true })
  @PrimaryColumn()
  config: string;

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  address: string;

  @Column()
  @Index({ unique: true })
  subnet: string;

  @Column()
  @Index({ unique: true })
  port: string;

  @Column()
  preUp?: string;

  @Column()
  postUp?: string;

  @Column()
  preDown?: string;

  @Column()
  postDown?: string;

  @Column()
  publicKey: string;

  @Exclude()
  @Column()
  privateKey: string;
}
