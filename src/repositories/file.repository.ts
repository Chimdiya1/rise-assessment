import File from "../entities/file.entity";
import { AppDataSource } from "../data-source";

export const FileRepository = AppDataSource.getRepository(File).extend({
  findByFilenameAndUserId(filename: string, userId: string) {
    const file = this.createQueryBuilder("file")
      .where({
        filename: filename,
        user: {
          id: userId,
        },
      })
      .getOne();
    return file;
  },
  findById(id: string) {
    const file = this.createQueryBuilder("file")
      .where({
        id: id,
      })
      .getOne();
    return file;
  },
  findByName(name: string) {
    const file = this.createQueryBuilder("file")
      .where({
        filename: name,
      })
      .getOne();
    return file;
  },
  flagAsUnsafe(id: string) {
    const file = this.update(id, { isSafe: false });
    return file;
  },
});
