import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { User } from '../../users/entities/user.entity';

@Entity('links')
export class Link {
  @PrimaryGeneratedColumn({
    name: 'link_id',
    type: 'int',
  })
  linkId: number;

  @Column({
    name: 'link_name',
    type: 'nvarchar',
    length: 20,
  })
  linkName: string;

  @Column({
    name: 'display_order',
    type: 'tinyint',
  })
  displayOrder: number;

  @Column({
    name: 'link_url',
    type: 'nvarchar',
    length: 2083,
    nullable: true,
  })
  linkUrl?: string;

  @Column({
    name: 'link_image_url',
    type: 'nvarchar',
    length: 2083,
    nullable: true,
  })
  linkImageUrl?: string;

  @Exclude()
  @Column({
    name: 'link_image_public_id',
    type: 'nvarchar',
    length: 2083,
    nullable: true,
  })
  linkImageProfileId?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime2',
    default: () => 'SYSUTCDATETIME()',
  })
  createdAt: Date;

  // @UpdateDateColumn() stores the date in local time instead of UTC.
  // Therefore, @Column() with @BeforeUpdate() is used instead.
  @Column({
    name: 'updated_at',
    type: 'datetime2',
    default: () => 'SYSUTCDATETIME()',
  })
  updatedAt: Date;

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date(); //UTC
  }

  @ManyToOne(() => User, (user) => user.links, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'user_id' })
  userId: number;
}
