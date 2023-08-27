import User from "../entities/user.entity";
import { CreateUserDto } from "../dtos/users.dto";
import { CreateFileDto } from "../dtos/file.dto";
import File from "../entities/file.entity";
import Folder from "../entities/folder.entity";
import { CreateFolderDto } from "../dtos/folder.dto";
import { UpdateResult } from "typeorm";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(createUserDto: CreateUserDto): User;
  save(user: User): Promise<User>;
}

export interface IFileRepository {
  create(createFileDto: CreateFileDto): File;
  save(file: File): Promise<File>;
  findByFilenameAndUserId(
    filename: string,
    userId: string
  ): Promise<File | null>;
  findById(id: string): Promise<File | null>;
  findByName(name: string): Promise<File | null>;
}

export interface IFolderRepository {
  create(createFolderDto: CreateFolderDto): Folder;
  save(folder: Folder): Promise<Folder>;
  findExistingFolder(
    foldername: string,
    userId: string,
    parentFoldername?: string
  ): Promise<Folder | null>;
  findByName(name?: string): Promise<Folder | null>;
}
