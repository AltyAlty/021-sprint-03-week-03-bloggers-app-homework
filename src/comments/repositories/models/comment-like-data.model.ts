import mongoose from 'mongoose';
import { CommentLikeDataType, CommentLikeStatus } from '../../application/types/comment-like-data.type';

/*Схема для данных о лайке комментария в БД.*/
const CommentLikeDataSchema = new mongoose.Schema<CommentLikeDataType>({
  commentId: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  userId: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  likeStatus: {
    type: String,
    required: true,
    enum: Object.values(CommentLikeStatus),
  },
});

/*Составной индекс для защиты от дубликатов данных о лайке от одного пользователя на комментарий.*/
CommentLikeDataSchema.index({ commentId: 1, userId: 1 }, { unique: true });
/*Индекс для быстрых подсчетов лайков/дизлайков.*/
CommentLikeDataSchema.index({ commentId: 1 });

/*Модель для данных о лайке комментария в БД.*/
export const CommentLikeDataModel = mongoose.model<CommentLikeDataType>(
  'CommentLikeData',
  CommentLikeDataSchema,
  'commentLikesData'
);
