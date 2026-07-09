import { DeleteResult } from 'mongodb';
import { SessionType } from '../application/types/session.type';
import { SessionDBType } from './types/session-db.type';
import { RequestRateLimitLogType } from '../application/types/request-rate-limit-log.type';
import { EmailConfirmationType } from '../application/types/email-сonfirmation.type';
import { EmailConfirmationDBType } from './types/email-сonfirmation-db.type';
import { RecoveryCodeDataType } from '../application/types/recovery-code-data.type';
import { RecoveryCodeDataDBType } from './types/recovery-code-data-db.type';
import { injectable } from 'inversify';
import { SessionListDBType } from './types/session-list-db.type';
import { SessionModel } from './models/session.model';
import { HydratedDocument } from 'mongoose';
import { EmailConfirmationModel } from './models/email-сonfirmation.model';
import { RequestRateLimitLogModel } from './models/request-rate-limit-log.model';
import { RecoveryCodeDataModel } from './models/recovery-code-data.model';

/*Репозиторий для работы с аутентификацией и авторизацией в БД.*/
@injectable()
export class AuthRepository {
  /*Метод для добавления сессии в БД.*/
  async createSession(newSession: SessionType): Promise<string> {
    /*Просим модель "SessionModel" создать сессию в БД.*/
    const session: HydratedDocument<SessionType> = new SessionModel(newSession);
    await session.save();
    /*Возвращаем ID созданной сессии.*/
    return session._id.toString();
  }

  /*Метод для создания данных о подтверждении регистрации пользователя в БД.*/
  async createEmailConfirmation(newEmailConfirmation: EmailConfirmationType): Promise<string> {
    /*Просим модель "EmailConfirmationModel" создать данные о подтверждении регистрации пользователя в БД.*/
    const emailConfirmation: HydratedDocument<EmailConfirmationType> = new EmailConfirmationModel(newEmailConfirmation);
    await emailConfirmation.save();
    /*Возвращаем ID созданных данных о подтверждении регистрации пользователя.*/
    return emailConfirmation._id.toString();
  }

  /*Метод для добавления записи в журнал лимитов запросов в БД.*/
  async createRequestRateLimitLog(newRequestRateLimitLog: RequestRateLimitLogType): Promise<string> {
    /*Просим модель "RequestRateLimitLogModel" создать запись в журнале лимитов запросов в БД.*/
    const requestRateLimitLog: HydratedDocument<RequestRateLimitLogType> = new RequestRateLimitLogModel(
      newRequestRateLimitLog
    );

    await requestRateLimitLog.save();
    /*Возвращаем ID созданной записи в журнале лимитов запросов.*/
    return requestRateLimitLog._id.toString();
  }

  /*Метод для создания данных о коде восстановления пароля пользователя в БД.*/
  async createRecoveryPasswordCodeData(newRequestRateLimitLog: RecoveryCodeDataType): Promise<string> {
    /*Просим модель "RecoveryCodeDataModel" создать данные о коде восстановления пароля пользователя в БД.*/
    const recoveryCodeData: HydratedDocument<RecoveryCodeDataType> = new RecoveryCodeDataModel(newRequestRateLimitLog);
    await recoveryCodeData.save();
    /*Возвращаем ID созданных данных о коде восстановления пароля пользователя.*/
    return recoveryCodeData._id.toString();
  }

  /*Метод для поиска сессии по ID пользователя и ID устройства пользователя в БД.*/
  async findSessionByUserIdAndDeviceId(userId: string, deviceId: string): Promise<SessionDBType | null> {
    /*Просим модель "SessionModel" найти сессию по ID пользователя и ID устройства пользователя в БД.*/
    const session: SessionDBType | null = await SessionModel.findOne({ userId, deviceId }).lean();
    /*Если сессия была найдена, то возвращаем ее, иначе возвращаем null.*/
    return session ?? null;
  }

  /*Метод для поиска сессии по ID пользователя, ID устройства пользователя и дате выдачи RT в БД.*/
  async findSessionByUserIdAndDeviceIdAndIat(
    userId: string,
    deviceId: string,
    iat: Date
  ): Promise<SessionDBType | null> {
    /*Просим модель "SessionModel" найти сессию по ID пользователя, ID устройства пользователя и дате выдачи RT в БД.*/
    const session: SessionDBType | null = await SessionModel.findOne({ userId, deviceId, iat }).lean();
    /*Если сессия была найдена, то возвращаем ее, иначе возвращаем null.*/
    return session ?? null;
  }

  /*Метод для поиска сессий по ID пользователя в БД.*/
  async findAllSessionsByUserId(userId: string): Promise<SessionListDBType> {
    /*Просим модель "SessionModel" найти сессии по ID пользователя в БД.*/
    return await SessionModel.find({ userId }).lean();
  }

  /*Метод для поиска данных о подтверждении регистрации пользователя по коду подтверждения в БД.*/
  async findEmailConfirmationByCode(confirmationCode: string): Promise<EmailConfirmationDBType | null> {
    /*Просим модель "EmailConfirmationModel" найти данные о подтверждении регистрации пользователя по коду подтверждения
    в БД.*/
    const emailConfirmation: EmailConfirmationDBType | null = await EmailConfirmationModel.findOne({
      confirmationCode,
    }).lean();

    /*Если данные о подтверждении регистрации пользователя были найдены, то возвращаем их, иначе возвращаем null.*/
    return emailConfirmation ?? null;
  }

  /*Метод для поиска данных о подтверждении регистрации пользователя по ID пользователя в БД.*/
  async findEmailConfirmationByUserId(userId: string): Promise<EmailConfirmationDBType | null> {
    /*Просим модель "EmailConfirmationModel" найти данные о подтверждении регистрации пользователя по ID пользователя в
    БД.*/
    const emailConfirmation: EmailConfirmationDBType | null = await EmailConfirmationModel.findOne({ userId }).lean();
    /*Если данные о подтверждении регистрации пользователя были найдены, то возвращаем их, иначе возвращаем null.*/
    return emailConfirmation ?? null;
  }

  /*Метод для подсчета количества записей в журнале лимитов запросов за указанный период по IP-адресу и URL в БД.*/
  async countRequestRateLimitLogsByIpAndUrl(ip: string, url: string, seconds: number): Promise<number> {
    /*Просим модель "RequestRateLimitLogModel" подсчитать количество записей в журнале лимитов запросов за указанный
    период по IP-адресу и URL в БД.*/
    return RequestRateLimitLogModel.countDocuments({
      ip,
      url,
      timestamp: { $gte: new Date(Date.now() - seconds * 1000) },
    });
  }

  /*Метод для поиска данных о коде восстановления пароля пользователя по коду в БД.*/
  async findRecoveryPasswordCodeDataByCode(recoveryCode: string): Promise<RecoveryCodeDataDBType | null> {
    /*Просим модель "RecoveryCodeDataModel" найти данные о коде восстановления пароля пользователя по коду в БД.*/
    const recoveryCodeData: RecoveryCodeDataDBType | null = await RecoveryCodeDataModel.findOne({
      recoveryCode,
    }).lean();

    /*Если данные о коде восстановления пароля пользователя были найдены, то возвращаем их, иначе возвращаем null.*/
    return recoveryCodeData ?? null;
  }

  /*Метод для поиска данных о коде восстановления пароля пользователя по ID пользователя в БД.*/
  async findRecoveryPasswordCodeDataByUserId(userId: string): Promise<RecoveryCodeDataDBType | null> {
    /*Просим модель "RecoveryCodeDataModel" найти данные о коде восстановления пароля пользователя по ID пользователя в
    БД.*/
    const recoveryCodeData: RecoveryCodeDataDBType | null = await RecoveryCodeDataModel.findOne({ userId }).lean();
    /*Если данные о коде восстановления пароля пользователя были найдены, то возвращаем их, иначе возвращаем null.*/
    return recoveryCodeData ?? null;
  }

  /*Метод для изменения сессии по дате создания RT в БД.*/
  async updateSessionByIat(currentIat: Date, ip: string, iat: Date, exp: Date): Promise<number> {
    /*Просим модель "SessionModel" найти сессию по дате создания RT в БД.*/
    const session: HydratedDocument<SessionType> | null = await SessionModel.findOne({ iat: currentIat });
    /*Если сессия не была найдена, то сообщаем, что она не была изменена.*/
    if (!session) return 0;
    /*Если сессия была найдена, то изменяем ее в БД.*/
    session.ip = ip;
    session.iat = iat;
    session.exp = exp;
    await session.save();
    /*Сообщаем, что сессию была изменена.*/
    return 1;
  }

  /*Метод для изменения данных о подтверждении регистрации пользователя по ID пользователя в БД.*/
  async updateEmailConfirmationByUserId(
    userId: string,
    confirmationCode: string,
    expirationDate: Date
  ): Promise<number> {
    /*Просим модель "EmailConfirmationModel" найти данные о подтверждении регистрации пользователя по ID пользователя в
    БД.*/
    const emailConfirmation: HydratedDocument<EmailConfirmationType> | null = await EmailConfirmationModel.findOne({
      userId,
    });

    /*Если данные о подтверждении регистрации пользователя не были найдены, то сообщаем, что они не были изменены.*/
    if (!emailConfirmation) return 0;
    /*Если данные о подтверждении регистрации пользователя были найдены, то изменяем их в БД.*/
    emailConfirmation.confirmationCode = confirmationCode;
    emailConfirmation.expirationDate = expirationDate;
    await emailConfirmation.save();
    /*Сообщаем, что данные о подтверждении регистрации пользователя были изменены.*/
    return 1;
  }

  /*Метод для удаления сессии по дате создания RT в БД.*/
  async deleteSessionByIat(iat: Date): Promise<number> {
    /*Просим модель "SessionModel" найти сессию по дате создания RT в БД.*/
    const session: HydratedDocument<SessionType> | null = await SessionModel.findOne({ iat });
    /*Если сессия не была найдена, то сообщаем, что она не была удалена.*/
    if (!session) return 0;
    /*Если сессия была найдена, то удаляем ее в БД.*/
    const result: DeleteResult = await session.deleteOne();
    /*Сообщаем, что сессия была удалена.*/
    return result.deletedCount;
  }

  /*Метод для удаления сессии по ID пользователя и ID устройства пользователя в БД.*/
  async deleteSessionByUserIdAndDeviceId(userId: string, deviceId: string): Promise<number> {
    /*Просим модель "SessionModel" найти сессию по ID пользователя и ID устройства пользователя RT в БД.*/
    const session: HydratedDocument<SessionType> | null = await SessionModel.findOne({ userId, deviceId });
    /*Если сессия не была найдена, то сообщаем, что она не была удалена.*/
    if (!session) return 0;
    /*Если сессия была найдена, то удаляем ее в БД.*/
    const result: DeleteResult = await session.deleteOne();
    /*Сообщаем, что сессия была удалена.*/
    return result.deletedCount;
  }

  /*Метод для удаления всех сессий пользователя, кроме текущей, в БД.*/
  async deleteSessionsExceptCurrentDevice(userId: string, deviceId: string): Promise<number> {
    /*Просим модель "SessionModel" удалить все сессии пользователя, кроме текущей, в БД.*/
    const result: DeleteResult = await SessionModel.deleteMany({ userId, deviceId: { $ne: deviceId } });
    /*Возвращаем количество удаленных устройств пользователя.*/
    return result.deletedCount ?? 0;
  }

  /*Метод для удаления всех сессий пользователя по ID пользователя в БД.*/
  async deleteAllSessionsByUserId(userId: string): Promise<number> {
    /*Просим модель "SessionModel" удалить все сессии пользователя по ID пользователя в БД.*/
    const result: DeleteResult = await SessionModel.deleteMany({ userId });
    /*Возвращаем количество удаленных устройств пользователя.*/
    return result.deletedCount ?? 0;
  }

  /*Метод для удаления данных о подтверждении регистрации пользователя по ID пользователя в БД.*/
  async deleteEmailConfirmationByUserId(userId: string): Promise<number> {
    /*Просим модель "EmailConfirmationModel" найти данные о подтверждении регистрации пользователя по ID пользователя в
    БД.*/
    const emailConfirmation: HydratedDocument<SessionType> | null = await EmailConfirmationModel.findOne({ userId });
    /*Если данные о подтверждении регистрации пользователя не были найдены, то сообщаем, что они не были удалены.*/
    if (!emailConfirmation) return 0;
    /*Если данные о подтверждении регистрации пользователя были найдены, то удаляем их в БД.*/
    const result: DeleteResult = await emailConfirmation.deleteOne();
    /*Сообщаем, что данные о подтверждении регистрации пользователя были удалены.*/
    return result.deletedCount;
  }

  /*Метод для удаления данных о коде восстановления пароля пользователя по коду в БД.*/
  async deleteRecoveryCodeDataByCode(recoveryCode: string): Promise<number> {
    /*Просим модель "RecoveryCodeDataModel" найти данные о коде восстановления пароля пользователя по коду в БД.*/
    const recoveryCodeData: HydratedDocument<RecoveryCodeDataType> | null = await RecoveryCodeDataModel.findOne({
      recoveryCode,
    });

    /*Если данные о коде восстановления пароля пользователя не были найдены, то сообщаем, что они не были удалены.*/
    if (!recoveryCodeData) return 0;
    /*Если данные о коде восстановления пароля пользователя были найдены, то удаляем их в БД.*/
    const result: DeleteResult = await recoveryCodeData.deleteOne();
    /*Сообщаем, что данные о коде восстановления пароля пользователя были удалены.*/
    return result.deletedCount;
  }

  /*Метод для удаления данных о всех кодах восстановления пароля пользователя по ID пользователя в БД.*/
  async deleteAllRecoveryCodesDataByUserId(userId: string): Promise<number> {
    /*Просим модель "RecoveryCodeDataModel" найти данные о коде восстановления пароля пользователя по ID пользователя в
    БД.*/
    const recoveryCodeData: HydratedDocument<RecoveryCodeDataType> | null = await RecoveryCodeDataModel.findOne({
      userId,
    });

    /*Если данные о коде восстановления пароля пользователя не были найдены, то сообщаем, что они не были удалены.*/
    if (!recoveryCodeData) return 0;
    /*Если данные о коде восстановления пароля пользователя были найдены, то удаляем их в БД.*/
    const result: DeleteResult = await recoveryCodeData.deleteOne();
    /*Сообщаем, что данные о коде восстановления пароля пользователя были удалены.*/
    return result.deletedCount;
  }
}
