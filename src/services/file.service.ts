import { Readable } from "stream";
import {
  GetObjectCommand,
  GetObjectCommandOutput,
  S3Client,
} from "@aws-sdk/client-s3";
import { IFileService } from "../interfaces/services.interfaces";
import { CreateFileDto, DownloadFileDto } from "../dtos/file.dto";
import File from "../entities/file.entity";
import {
  IFileRepository,
  IFolderRepository,
  IUserRepository,
} from "../interfaces/repos.interfaces";
import { APIError, NotFoundError } from "../utils/errors";
import Folder from "../entities/folder.entity";

export default class FileService implements IFileService {
  constructor(
    private fileRepository: IFileRepository,
    private userRepository: IUserRepository,
    private folderRepository: IFolderRepository
  ) {
    this.fileRepository = fileRepository;
    this.userRepository = userRepository;
    this.folderRepository = folderRepository;
  }

  public async create(
    createFileDto: CreateFileDto,
    userId: string,
    parentFoldername: string
  ): Promise<File> {
    const user = await this.userRepository.findById(userId);

    let parentFolder: Folder | null | undefined = null;

    if (parentFoldername) {
      parentFolder = await this.folderRepository.findByName(parentFoldername);
    } else {
      parentFolder = undefined;
    }

    if (parentFolder === null) {
      throw new NotFoundError("Folder does not exist");
    }

    let newFileInfo = {
      filename: createFileDto.filename,
      fileType: createFileDto.fileType,
      location: createFileDto.location,
      size: createFileDto.size,
      isSafe: true,
      user: user,
      parentFolder: parentFolder,
    };
    let file = await this.fileRepository.create(newFileInfo);
    file = await this.fileRepository.save(file);
    return file;
  }

  public async download(
    downloadFileDto: DownloadFileDto,
    s3Client: S3Client
  ): Promise<GetObjectCommandOutput> {
    const file = await this.fileRepository.findByFilenameAndUserId(
      downloadFileDto.filename,
      downloadFileDto.userId
    );
    if (!file) {
      throw new NotFoundError("File does not exist");
    }
    var bucketParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME || "",
      Key: downloadFileDto.filename,
    };

    let fileStream = await s3Client.send(new GetObjectCommand(bucketParams));

    if (fileStream.Body instanceof Readable) return fileStream;
    throw new APIError("File could not be downloaded", 400);
  }

  public async flagAsUnsafe(fileName: string, userId: string): Promise<File> {

    let file = await this.fileRepository.findByFilenameAndUserId(
      fileName,
      userId
    );

    if (!file) {
      throw new NotFoundError("File not found");
    }
    Object.assign(file, { isSafe: false });
    return this.fileRepository.save(file);
  }
}
