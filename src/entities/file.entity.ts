import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn
} from "typeorm";
import User from "./user.entity";
import Folder from "./folder.entity";

@Entity()
export default class File extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  filename!: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  fileType!: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  location!: string;

  @Column({
    type: "int",
    nullable: false,
  })
  size!: number;

  @Column({
    type: "boolean",
    nullable: false,
  })
  isSafe: boolean = true;

  @ManyToOne(() => User, (user) => user.files)
  @JoinColumn()
  user!: User;

  @ManyToOne(() => Folder, (folder) => folder.files)
  @JoinColumn()
  folder?: Folder;
}
