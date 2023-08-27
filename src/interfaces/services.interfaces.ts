import { AuthUserDto, CreateUserDto } from "../dtos/users.dto";
import { GetObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";
import { CreateFolderDto } from "../dtos/folder.dto";
import { CreateFileDto, DownloadFileDto } from "../dtos/file.dto";
import File from "../entities/file.entity";

export interface IUserService {
  create(createUserDto: CreateUserDto): any;
  auth(authUserDto: AuthUserDto): any;
  _comparePassword(inputPass: string, password: string): Promise<boolean>;
  _generateToken(user: object): Promise<{ accessToken: string }>;
}

export interface IFileService {
  create(
    createFileDto: CreateFileDto,
    userId: string,
    parentFoldername: string
  ): any;
  download(
    downloadFileDto: DownloadFileDto,
    s3Client: S3Client
  ): Promise<GetObjectCommandOutput | undefined>;
  flagAsUnsafe(fileId: string, userId: string): Promise<File>;
}

export interface IFolderService {
  create(
    createFolderDto: CreateFolderDto,
    ownerId: string,
    parentFoldername?: string
  ): any;
}
