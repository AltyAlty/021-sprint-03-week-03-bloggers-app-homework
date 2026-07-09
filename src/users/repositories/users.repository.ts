import { DeleteResult } from 'mongodb';
import { UserType } from '../application/types/user.type';
import { UserDBType } from './types/user-db.type';
import { injectable } from 'inversify';
import { UserModel } from './models/user.model';
import { HydratedDocument } from 'mongoose';

/*Репозиторий для работы с пользователями в БД.*/
@injectable()
export class UsersRepository {
  /*Метод для добавления пользователя в БД.*/
  async create(newUser: UserType): Promise<string> {
    /*Просим модель "UserModel" создать пользователя в БД.*/
    const user: HydratedDocument<UserType> = new UserModel(newUser);
    await user.save();
    /*Возвращаем ID созданного пользователя.*/
    return user._id.toString();
  }

  /*Метод для поиска пользователя по ID в БД.*/
  async findById(id: string): Promise<UserDBType | null> {
    /*Просим модель "UserModel" найти пользователя по ID в БД.*/
    const user: UserDBType | null = await UserModel.findById(id).lean();
    /*Если пользователь был найден, то возвращаем его, иначе null.*/
    return user ?? null;
  }

  /*Метод для поиска пользователя по email в БД.*/
  async findByEmail(email: string): Promise<UserDBType | null> {
    /*Просим модель "UserModel" найти пользователя по email в БД.*/
    const user: UserDBType | null = await UserModel.findOne({ email }).lean();
    /*Если пользователь был найден, то возвращаем его, иначе null.*/
    return user ?? null;
  }

  /*Метод для поиска пользователя по логину/email в БД.*/
  async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null> {
    /*Просим модель "UserModel" найти пользователя по логину/email в БД.*/
    const user: UserDBType | null = await UserModel.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    }).lean();

    /*Если пользователь был найден, то возвращаем его, иначе null.*/
    return user ?? null;
  }

  /*Метод для подтверждения регистрации пользователя по ID пользователя в БД.*/
  async confirmById(id: string): Promise<number> {
    /*Просим модель "UserModel" найти пользователя по ID в БД.*/
    const user: HydratedDocument<UserType> | null = await UserModel.findById(id);
    /*Если пользователь не был найден, то сообщаем, что регистрация пользователя не была подтверждена.*/
    if (!user) return 0;
    /*Если пользователь был найден, то подтверждаем регистрацию пользователя в БД.*/
    user.isConfirmed = true;
    await user.save();
    /*Сообщаем, что регистрация пользователя была подтверждена.*/
    return 1;
  }

  /*Метод для изменения хеша для пароля пользователя по ID в БД.*/
  async updatePasswordHashById(id: string, passwordHash: string): Promise<number> {
    /*Просим модель "UserModel" найти пользователя по ID в БД.*/
    const user: HydratedDocument<UserType> | null = await UserModel.findById(id);
    /*Если пользователь не был найден, то сообщаем, что хеш для пароля пользователя не был изменен.*/
    if (!user) return 0;
    /*Если пользователь был найден, то изменяем хеш для пароля пользователя в БД.*/
    user.passwordHash = passwordHash;
    await user.save();
    /*Сообщаем, что хеш для пароля пользователя был изменен.*/
    return 1;
  }

  /*Метод для удаления пользователя по ID в БД.*/
  async deleteById(id: string): Promise<number> {
    /*Просим модель "UserModel" найти пользователя по ID в БД.*/
    const user: HydratedDocument<UserType> | null = await UserModel.findById(id);
    /*Если пользователь не был найден, то сообщаем, что он не был удален.*/
    if (!user) return 0;
    /*Если пользователь был найден, то удаляем его в БД.*/
    const result: DeleteResult = await user.deleteOne();
    /*Сообщаем, что пользователь был удален.*/
    return result.deletedCount;
  }
}
