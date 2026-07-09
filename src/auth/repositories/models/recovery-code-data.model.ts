import mongoose from 'mongoose';
import { SETTINGS } from '../../../core/settings/settings';
import { RecoveryCodeDataType } from '../../application/types/recovery-code-data.type';

/*Схема для данных о коде восстановления пароля пользователя в БД.*/
const RecoveryCodeDataSchema = new mongoose.Schema<RecoveryCodeDataType>({
  userId: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  recoveryCode: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  expirationDate: {
    type: Date,
    required: true,
    immutable: true,
    expires: SETTINGS.PASSWORD_RECOVERY_CODE_EXPIRATION_TIME_IN_DB_IN_SECONDS,
  },
});

/*Модель для данных о коде восстановления пароля пользователя в БД.*/
export const RecoveryCodeDataModel = mongoose.model<RecoveryCodeDataType>(
  'RecoveryCodeData',
  RecoveryCodeDataSchema,
  'recoveryCodesData'
);
