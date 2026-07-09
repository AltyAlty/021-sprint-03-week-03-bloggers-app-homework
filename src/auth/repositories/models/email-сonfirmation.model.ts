import mongoose from 'mongoose';
import { SETTINGS } from '../../../core/settings/settings';
import { EmailConfirmationType } from '../../application/types/email-сonfirmation.type';

/*Схема для данных о подтверждении регистрации пользователя в БД.*/
const EmailConfirmationSchema = new mongoose.Schema<EmailConfirmationType>({
  userId: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  confirmationCode: {
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
    expires: SETTINGS.COMPLETE_REGISTRATION_CODE_EXPIRATION_TIME_IN_DB_IN_SECONDS,
  },
});

/*Модель для данных о подтверждении регистрации пользователя в БД.*/
export const EmailConfirmationModel = mongoose.model<EmailConfirmationType>(
  'EmailConfirmation',
  EmailConfirmationSchema,
  'emailConfirmations'
);
