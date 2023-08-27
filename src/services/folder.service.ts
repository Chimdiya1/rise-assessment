import { IFolderService } from "../interfaces/services.interfaces";
import { ConflictError, NotFoundError } from "../utils/errors";
import { CreateFolderDto } from "../dtos/folder.dto";
import Folder from "../entities/folder.entity";
import {
  IFolderRepository,
  IUserRepository,
} from "../interfaces/repos.interfaces";

export default class FolderService implements IFolderService {
  constructor(
    private folderRepository: IFolderRepository,
    private userRepository: IUserRepository
  ) {
    this.folderRepository = folderRepository;
    this.userRepository = userRepository;
  }

  public async create(
    createFolderDto: CreateFolderDto,
    ownerId: string,
    parentFoldername?: string
  ) {
    const user = await this.userRepository.findById(ownerId);
    const existingFolder = await this.folderRepository.findExistingFolder(
      createFolderDto.name,
      ownerId,
      parentFoldername
    );
    if (existingFolder) {
      throw new ConflictError("A Folder with this name already exists");
    }

    let parentFolder: Folder | null | undefined = null;
    if (parentFoldername) {
      parentFolder = await this.folderRepository.findByName(parentFoldername);
    } else {
      parentFolder = undefined;
    }
    if (parentFolder === null) {
      throw new NotFoundError("Parent Folder does not exist");
    }

    let newFolderInfo = {
      name: createFolderDto.name,
      owner: user,
      parentFolder: parentFolder || undefined,
    };
    let folder = await this.folderRepository.create(newFolderInfo);
    folder = await this.folderRepository.save(folder);

    return folder;
  }
}
