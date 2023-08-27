import Folder from "../entities/folder.entity";
import { AppDataSource } from "../data-source";

export const FolderRepository = AppDataSource.getRepository(Folder).extend({
  findExistingFolder(
    foldername: string,
    userId: string,
    parentFoldername?: string
  ) {
    const folder = this.findOne({
      where: {
        name: foldername,
        owner: {
          id: userId,
        },
        parentFolder: {
          name: parentFoldername,
        },
      },
    });
    return folder;
  },
  findByName(name?: string) {
    const folder = this.createQueryBuilder("folder")
      .where({
        name: name,
      })
      .getOne();
    return folder;
  },
});
