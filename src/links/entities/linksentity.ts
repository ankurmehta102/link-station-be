import {
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
    name: 'link_url',
    type: 'nvarchar',
    length: 2083,
  })
  linkUrl: string;

  @Column({
    name: 'link_image_url',
    type: 'nvarchar',
    length: 2083,
  })
  linkImageUrl: string;

  @Column({
    name: 'link_image_public_id',
    type: 'nvarchar',
    length: 2083,
  })
  linkImageProfileId: string;

  @Column({
    name: 'display_order',
    type: 'tinyint',
  })
  displayOrder: number;

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
}
