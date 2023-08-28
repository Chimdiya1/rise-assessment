import { ConflictError, NotFoundError } from "../../../utils/errors";
import File from "../../../entities/file.entity";
import Folder from "../../../entities/folder.entity";
import {
  IFolderService,
} from "../../../interfaces/services.interfaces";
import FileService from "../../../services/file.service";
import {
  mockFileRepository,
  mockUserRepository,
  mockFolderRepository,
} from "../../mocks/repo.mocks";
import { CreateFileDto } from "../../../dtos/file.dto";
import { Readable } from "stream";
import User from "../../../entities/user.entity";
import { S3Client } from "@aws-sdk/client-s3";
import FolderService from "../../../services/folder.service";

describe("folder service", () => {
  let folderService: IFolderService;
  const sample_file: CreateFileDto = {
    filename: "test.txt",
    fileType: "text/plain",
    location: "path/to/file",
    size: 100,
  };
  const s3ClientMock = {
    send: jest.fn().mockResolvedValue({
      Body: new Readable(),
    }),
  } as unknown as S3Client;

  const file = new File();
  const user = new User();

  beforeEach(() => {
    folderService = new FolderService(mockFolderRepository, mockUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  // Tests that the method creates a file with valid input
  it("should create a folder with valid input", async () => {
    // Arrange
    const createFolderDto = {
      name: "test folder",
    };
    const ownerId = "123";
    const parentFoldername = "parent folder";
    const user = new User();
    const parentFolder = new Folder();
    const newFolderInfo = {
      name: createFolderDto.name,
      owner: user,
      parentFolder: parentFolder,
    };
    const folder = new Folder();
    const findExistingFolderSpy = jest
      .spyOn(mockFolderRepository, "findExistingFolder")
      .mockResolvedValue(null);
    const findByIdSpy = jest
      .spyOn(mockUserRepository, "findById")
      .mockResolvedValue(user);
    const findByNameSpy = jest
      .spyOn(mockFolderRepository, "findByName")
      .mockResolvedValue(parentFolder);
    const createSpy = jest
      .spyOn(mockFolderRepository, "create")
      .mockReturnValue(folder);
    const saveSpy = jest
      .spyOn(mockFolderRepository, "save")
      .mockResolvedValue(folder);

    // Act
    const result = await folderService.create(
      createFolderDto,
      ownerId,
      parentFoldername
    );

    // Assert
    expect(findExistingFolderSpy).toHaveBeenCalledWith(
      createFolderDto.name,
      ownerId,
      parentFoldername
    );
    expect(findByIdSpy).toHaveBeenCalledWith(ownerId);
    expect(findByNameSpy).toHaveBeenCalledWith(parentFoldername);
    expect(createSpy).toHaveBeenCalledWith(newFolderInfo);
    expect(saveSpy).toHaveBeenCalledWith(folder);
    expect(result).toBe(folder);
  });

  it("should create a folder if the parent folder is not provided", async () => {
    // Arrange
    const createFolderDto = {
      name: "test folder",
    };
    const ownerId = "123";
    const parentFoldername = "";
    const user = new User();
    const newFolderInfo = {
      name: createFolderDto.name,
      owner: user,
      parentFolder: undefined,
    };
    const folder = new Folder();
    const findExistingFolderSpy = jest
      .spyOn(mockFolderRepository, "findExistingFolder")
      .mockResolvedValue(null);
    const findByIdSpy = jest
      .spyOn(mockUserRepository, "findById")
      .mockResolvedValue(user);
    const createSpy = jest
      .spyOn(mockFolderRepository, "create")
      .mockReturnValue(folder);
    const saveSpy = jest
      .spyOn(mockFolderRepository, "save")
      .mockResolvedValue(folder);

    // Act
    const result = await folderService.create(
      createFolderDto,
      ownerId,
      parentFoldername
    );

    // Assert
    expect(findExistingFolderSpy).toHaveBeenCalledWith(
      createFolderDto.name,
      ownerId,
      parentFoldername
    );
    expect(findByIdSpy).toHaveBeenCalledWith(ownerId);
    expect(createSpy).toHaveBeenCalledWith(newFolderInfo);
    expect(saveSpy).toHaveBeenCalledWith(folder);
    expect(result).toBe(folder);
  });

  it("should throw a ConflictError if a folder with the same name already exists", async () => {
    // Arrange
    const createFolderDto = {
      name: "test folder",
    };
    const ownerId = "123";
    const parentFoldername = "parent folder";
    const user = new User();
    const existingFolder = new Folder();
    const findExistingFolderSpy = jest
      .spyOn(mockFolderRepository, "findExistingFolder")
      .mockResolvedValue(existingFolder);
    const findByIdSpy = jest
      .spyOn(mockUserRepository, "findById")
      .mockResolvedValue(user);

    // Act & Assert
    await expect(
      folderService.create(createFolderDto, ownerId, parentFoldername)
    ).rejects.toBeInstanceOf(ConflictError);
    expect(findExistingFolderSpy).toHaveBeenCalledWith(
      createFolderDto.name,
      ownerId,
      parentFoldername
    );
    expect(findByIdSpy).toHaveBeenCalledWith(ownerId);
  });
});
