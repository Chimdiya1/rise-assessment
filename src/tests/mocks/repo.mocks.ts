import {
  IUserRepository,
  IFileRepository,
  IFolderRepository,
} from "../../interfaces/repos.interfaces";
import User from "../../entities/user.entity";
import { Repository } from "typeorm";
import { FileRepository } from "../../repositories/file.repository";
import File from "../../entities/file.entity";
import { UserRepository } from "../../repositories/user.repository";
import Folder from "../../entities/folder.entity";
import { FolderRepository } from "../../repositories/folder.repository";

// const sample_user = {
//   email: "sample@gmail.com",
//   firstName: "Sample",
//   lastName: "Gmail",
//   phoneNumber: "",
//   password: "samplepassword",
// };
const user = new User();
const file = new File();
const folder = new Folder();

export const mockUserRepository: IUserRepository = {
  create() {
    return user;
  },
  findByEmail() {
    return Promise.resolve(user);
  },
  findById() {
    return Promise.resolve(user);
  },
  save() {
    return Promise.resolve(user);
  },
};

export const mockFileRepository: IFileRepository = {
  create() {
    return file;
  },
  findByFilenameAndUserId() {
    return Promise.resolve(file);
  },
  save() {
    return Promise.resolve(file);
  },
};
export const mockFolderRepository: IFolderRepository = {
  create() {
    return folder;
  },
  findByName() {
    return Promise.resolve(folder);
  },
  findExistingFolder() {
    return Promise.resolve(folder);
  },
  save() {
    return Promise.resolve(folder);
  },
};
