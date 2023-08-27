export interface CreateFileDto {
  filename: string;
  fileType: string;
  location: string;
  size: number;
}
export interface DownloadFileDto {
  filename: string;
  userId: string;
}
