import { ConflictError, NotFoundError } from "../../../utils/errors";
import File from "../../../entities/file.entity";
import { IFileService } from "../../../interfaces/services.interfaces";
import FileService from "../../../services/file.service";
import {
  mockFileRepository,
  mockUserRepository,
  mockFolderRepository,
} from "../../mocks/repo.mocks";
import { CreateFileDto } from "../../../dtos/file.dto";
import { Readable } from "stream";
import User from "../../../entities/user.entity";
import Folder from "../../../entities/folder.entity";
import { S3Client } from "@aws-sdk/client-s3";

describe("File service", () => {
  let fileService: IFileService;
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
    fileService = new FileService(
      mockFileRepository,
      mockUserRepository,
      mockFolderRepository
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  // Tests that the method creates a file with valid input
  it("should create a file with valid input", async () => {
    const userId = "123";
    const parentFoldername = "folder";

    const user = new User();
    const parentFolder = new Folder();
    const newFileInfo = {
      filename: sample_file.filename,
      fileType: sample_file.fileType,
      location: sample_file.location,
      size: sample_file.size,
      isSafe: true,
      user: user,
      parentFolder: parentFolder,
    };
    const file = new File();
    const createSpy = jest
      .spyOn(mockFileRepository, "create")
      .mockReturnValue(file);
    const saveSpy = jest
      .spyOn(mockFileRepository, "save")
      .mockResolvedValue(file);
    const findByIdSpy = jest
      .spyOn(mockUserRepository, "findById")
      .mockResolvedValue(user);
    const findByNameSpy = jest
      .spyOn(mockFolderRepository, "findByName")
      .mockResolvedValue(parentFolder);

    const result = await fileService.create(
      sample_file,
      userId,
      parentFoldername
    );

    expect(findByIdSpy).toHaveBeenCalledWith(userId);
    expect(findByNameSpy).toHaveBeenCalledWith(parentFoldername);
    expect(createSpy).toHaveBeenCalledWith(newFileInfo);
    expect(saveSpy).toHaveBeenCalledWith(file);
    expect(result).toBe(file);
  });

  it("should create a file if the parent folder is not provided", async () => {
    const userId = "123";
    const parentFoldername = "";

    const user = new User();
    const newFileInfo = {
      filename: sample_file.filename,
      fileType: sample_file.fileType,
      location: sample_file.location,
      size: sample_file.size,
      isSafe: true,
      user: user,
      parentFolder: undefined,
    };
    const createSpy = jest
      .spyOn(mockFileRepository, "create")
      .mockReturnValue(file);
    const saveSpy = jest
      .spyOn(mockFileRepository, "save")
      .mockResolvedValue(file);
    const findByIdSpy = jest
      .spyOn(mockUserRepository, "findById")
      .mockResolvedValue(user);

    const result = await fileService.create(
      sample_file,
      userId,
      parentFoldername
    );

    expect(findByIdSpy).toHaveBeenCalledWith(userId);
    expect(createSpy).toHaveBeenCalledWith(newFileInfo);
    expect(saveSpy).toHaveBeenCalledWith(file);
    expect(result).toBe(file);
  });

  it("Should throw error on create if parent folder is provided and doesnt exist", async () => {
    const userId = "123";
    const parentFoldername = "folder";

    const user = new User();
    const findByIdSpy = jest
      .spyOn(mockUserRepository, "findById")
      .mockResolvedValue(user);
    const findByNameSpy = jest
      .spyOn(mockFolderRepository, "findByName")
      .mockResolvedValue(null);

    await expect(
      fileService.create(sample_file, userId, parentFoldername)
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(findByIdSpy).toHaveBeenCalledWith(userId);
    expect(findByNameSpy).toHaveBeenCalledWith(parentFoldername);
  });

  it("should successfully download a valid file", async () => {
    // Arrange
    const downloadFileDto = {
      filename: "valid_file.txt",
      userId: "valid_user_id",
    };

    const findByFilenameAndUserIdSpy = jest
      .spyOn(mockFileRepository, "findByFilenameAndUserId")
      .mockResolvedValue(file);
    // Act
    const result = await fileService.download(downloadFileDto, s3ClientMock);
    // Assert
    expect(result?.Body).toBeInstanceOf(Readable);
    expect(mockFileRepository.findByFilenameAndUserId).toHaveBeenCalledWith(
      downloadFileDto.filename,
      downloadFileDto.userId
    );
    expect(s3ClientMock.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: downloadFileDto.filename,
        },
      })
    );
  });

  it("should throw NotFoundError when the file does not exist", async () => {
    // Arrange
    const downloadFileDto = {
      filename: "nonexistent_file.txt",
      userId: "valid_user_id",
    };

    const findByFilenameAndUserIdSpy = jest
      .spyOn(mockFileRepository, "findByFilenameAndUserId")
      .mockResolvedValue(null);

    // Act & Assert
    await expect(
      fileService.download(downloadFileDto, s3ClientMock)
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(mockFileRepository.findByFilenameAndUserId).toHaveBeenCalledWith(
      downloadFileDto.filename,
      downloadFileDto.userId
    );
  });
});
