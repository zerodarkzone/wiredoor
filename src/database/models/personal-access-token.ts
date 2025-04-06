import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Node } from './node';

export interface PersonalAccessTokenWithToken extends PersonalAccessToken {
  token: string;
}

@Entity('personal-access-tokens')
export class PersonalAccessToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 40,
  })
  name: string;

  @Column({
    nullable: true,
  })
  expireAt: Date;

  @Column({
    default: false,
  })
  revoked: boolean;

  @Column()
  nodeId: number;

  @ManyToOne(() => Node, { createForeignKeyConstraints: false })
  @JoinColumn({ name: 'nodeId' })
  node: Node;

  @CreateDateColumn()
  //@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  created_at: Date;

  @UpdateDateColumn()
  //@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
  updated_at: Date;
}
