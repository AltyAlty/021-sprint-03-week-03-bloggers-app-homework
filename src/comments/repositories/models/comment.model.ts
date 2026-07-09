import mongoose from 'mongoose';
import { CommentType } from '../../application/types/comment.type';

/*Схема для комментария в БД.*/
const CommentSchema = new mongoose.Schema<CommentType>({
  content: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 1000,
  },

  postId: {
    type: String,
    required: true,
    trim: true,
    minLength: 1,
    maxLength: 100,
  },

  commentatorInfo: {
    userId: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 100,
    },

    userLogin: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 100,
    },
  },

  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now,
  },
});

/*Модель для комментария в БД.*/
export const CommentModel = mongoose.model<CommentType>('Comment', CommentSchema, 'comments');
