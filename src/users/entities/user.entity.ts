import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime2',
    default: () => 'SYSUTCDATETIME()',
  })
  updatedAt: Date;
}
