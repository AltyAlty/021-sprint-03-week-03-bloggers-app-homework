import { db } from '../../db/mongodb/mongo.db';
import { injectable } from 'inversify';
import { SecurityDeviceListDBType } from './types/security-device-list-db.type';

/*Query-репозиторий для работы с устройствами пользователей в БД.*/
@injectable()
export class SecurityDevicesQueryRepository {
  /*Метод для поиска устройств пользователя по ID устройств пользователя в БД.*/
  async findAllByIds(ids: string[]): Promise<SecurityDeviceListDBType> {
    /*Просим коллекцию "securityDevicesCollection" найти устройства пользователя по ID устройств пользователя в БД.*/
    return await db.securityDevicesCollection.find({ deviceId: { $in: ids } }).toArray();
  }
}
