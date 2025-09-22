import { Exclude } from 'class-transformer';
import {
  BeforeUpdate,
  Check,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Link } from '../../links/entities/link.entity';

enum UserRole {
  Admin = 'admin',
  User = 'user',
}

@Entity('users')
@Check(`"user_role" IN ('${UserRole.Admin}', '${UserRole.User}')`)
export class User {
  @PrimaryGeneratedColumn({
    name: 'user_id',
    type: 'int',
  })
  userId: number;

  @Column({
    type: 'nvarchar',
    length: 255,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({
    name: 'password_hash',
    type: 'nvarchar',
    length: 100,
  })
  passwordHash: string;

  @Column({
    type: 'nvarchar',
    length: 30,
    unique: true,
  })
  username: string;

  @Column({
    name: 'first_name',
    type: 'nvarchar',
    length: 30,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    type: 'nvarchar',
    length: 30,
    nullable: true,
  })
  lastName: string;

  @Column({
    name: 'display_email',
    type: 'nvarchar',
    length: 50,
    nullable: true,
  })
  displayEmail: string;

  @Column({
    type: 'nvarchar',
    length: 150,
    nullable: true,
  })
  bio: string;

  @Column({
    name: 'profile_picture_url',
    type: 'nvarchar',
    length: 2083,
    nullable: true,
  })
  profilePictureUrl: string;

  @Exclude()
  @Column({
    name: 'profile_picture_public_id',
    type: 'nvarchar',
    length: 2083,
    nullable: true,
  })
  profilePicturePublicId: string;

  @Column({
    name: 'user_role',
    type: 'varchar',
    length: 8,
    default: UserRole.User,
  })
  userRole: UserRole;

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

  @OneToMany(() => Link, (link) => link.userId)
  links: Link[];
}
