import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm";
import User from "./user.entity";
import File from "./file.entity";

@Entity()
export default class Folder extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @ManyToOne(() => User, (user) => user.folders)
  @JoinColumn()
  owner!: User;

  @OneToMany(() => File, (file) => file.folder)
  files!: File[];

  @OneToMany(() => Folder, (folder) => folder.parentFolder)
  childFolders!: Folder[];

  @ManyToOne(() => Folder, (folder) => folder.childFolders, { nullable: true })
  @JoinColumn()
  parentFolder?: Folder;
}
