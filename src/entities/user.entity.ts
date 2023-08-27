import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import File from "./file.entity";
import Folder from "./folder.entity";
import { UserRole } from "../utils/enum/userRole.enum";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  fullName!: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  password!: string;

  @Column({
    type: "varchar",
    unique: true,
    nullable: false,
    transformer: {
      to: (value: string) => value.toLowerCase(),
      from: (value) => value,
    },
  })
  email!: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @OneToMany(() => File, (file) => file.user, { nullable: true }) 
  files!: File[];

  @OneToMany(() => Folder, (folder) => folder.owner, { nullable: true })
  folders!: Folder[];
}
