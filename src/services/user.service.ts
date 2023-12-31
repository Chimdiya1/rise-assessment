import bcrypt from "bcrypt";
import _ from "lodash";
import { IUserRepository } from "../interfaces/repos.interfaces";
import { AuthUserDto, CreateUserDto } from "../dtos/users.dto";
import { APIError, ConflictError, NotFoundError } from "../utils/errors";
import User from "../entities/user.entity";
import config from "config";
import jwt from "jsonwebtoken";
import { IUserService } from "../interfaces/services.interfaces";

export default class UserService implements IUserService {
  constructor(private userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  private async _hashPassword(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }

  public async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await this._hashPassword(password);
    let user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // const account = new Account()
    // user.account = account
    user = await this.userRepository.save(user);
    return _.omit(user, ["password", "account"]);
  }

  public async auth(authUserDto: AuthUserDto) {
    const { email: userEmail, password: userPassword } = authUserDto;
    const user = await this.userRepository.findByEmail(userEmail);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const comparePasswordResult = await this._comparePassword(
      userPassword,
      user.password
    );
    if (!comparePasswordResult) {
      throw new APIError("Invalid password", 401);
    }

    const { accessToken } = await this._generateToken(user);

    const userWithoutPasssword = _.omit(user, "password");
    return { accessToken, user: userWithoutPasssword };
  }

  public async _comparePassword(inputPass: string, password: string) {
    return bcrypt.compare(inputPass, password);
  }

  public async _generateToken(user: User): Promise<{ accessToken: string }> {
    const payload = {
      email: user.email,
      id: user.id,
      fullName: user.fullName,
      role:user.role
    };
    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        process.env.JWT_SECRET || "jwt_secret",
        {
          // expiresIn: '600000'
          expiresIn: "18000000",
        },
        (err: any, token: any) => {
          if (err) {
            return reject(err);
          }
          return resolve({ accessToken: token as string });
        }
      );
    });
  }
}
