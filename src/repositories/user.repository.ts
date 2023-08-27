import User from "../entities/user.entity";
import { AppDataSource } from "../data-source";

export const UserRepository = AppDataSource.getRepository(
  User
).extend({
  findByEmail(email: string) {
    const user = this.createQueryBuilder("user")
      .where({
        email: email,
      })
      .getOne();
    return user;
  },
  findById(id: string) {
    const user = this.createQueryBuilder("user")
      .where({
        id: id,
      })
      .getOne();
    return user;
  },
});
