import mongoose from 'mongoose';
import { SecurityDeviceType } from '../../application/types/security-device.type';

/*Схема для устройства пользователя из сессии в БД.*/
const SecurityDeviceSchema = new mongoose.Schema<SecurityDeviceType>({
  deviceId: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 1000,
  },

  ip: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  lastActiveDate: {
    type: Date,
    required: true,
  },
});

/*Модель для устройства пользователя из сессии в БД.*/
export const SecurityDeviceModel = mongoose.model<SecurityDeviceType>(
  'SecurityDevice',
  SecurityDeviceSchema,
  'securityDevices'
);
