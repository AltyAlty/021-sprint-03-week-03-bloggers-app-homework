import { UpdateCommentByIdInputDTO } from '../routes/input-dto/update-comment-by-id.input-dto';
import { DeleteResult } from 'mongodb';
import { CommentType } from '../application/types/comment.type';
import { CommentDBType } from './types/comment-db.type';
import { injectable } from 'inversify';
import { CommentModel } from './models/comment.model';
import { HydratedDocument } from 'mongoose';

/*Репозиторий для работы с комментариями в БД.*/
@injectable()
export class CommentsRepository {
  /*Метод для добавления комментария в БД.*/
  async create(newComment: CommentType): Promise<string> {
    /*Просим модель "CommentModel" создать комментарий в БД.*/
    const comment: HydratedDocument<CommentType> = new CommentModel(newComment);
    await comment.save();
    /*Возвращаем ID созданного комментария.*/
    return comment._id.toString();
  }

  /*Метод для поиска комментария по ID в БД.*/
  async findById(id: string): Promise<CommentDBType | null> {
    /*Просим модель "CommentModel" найти комментарий по ID в БД.*/
    const comment: CommentDBType | null = await CommentModel.findById(id).lean();
    /*Если комментарий был найден, то возвращаем его, иначе null.*/
    return comment ?? null;
  }

  /*Метод для изменения комментария по ID в БД.*/
  async updateById(id: string, dto: UpdateCommentByIdInputDTO): Promise<number> {
    /*Просим модель "CommentModel" найти комментарий по ID в БД.*/
    const comment: HydratedDocument<CommentType> | null = await CommentModel.findById(id);
    /*Если комментарий не был найден, то сообщаем, что он не был изменен.*/
    if (!comment) return 0;
    /*Если комментарий был найден, то изменяем его в БД.*/
    comment.content = dto.content;
    await comment.save();
    /*Сообщаем, что комментарий был изменен.*/
    return 1;
  }

  /*Метод для удаления комментария по ID в БД.*/
  async deleteById(id: string): Promise<number> {
    /*Просим модель "CommentModel" найти комментарий по ID в БД.*/
    const comment: HydratedDocument<CommentType> | null = await CommentModel.findById(id);
    /*Если комментарий не был найден, то сообщаем, что он не был удален.*/
    if (!comment) return 0;
    /*Если комментарий был найден, то удаляем его в БД.*/
    const result: DeleteResult = await comment.deleteOne();
    /*Сообщаем, что комментарий был удален.*/
    return result.deletedCount;
  }

  /*Метод для удаления комментариев по ID поста в БД.*/
  async deleteAllByPostId(postId: string): Promise<number> {
    /*Просим модель "CommentModel" удалить комментарии по ID поста в БД.*/
    const result: DeleteResult = await CommentModel.deleteMany({ postId });
    /*Возвращаем количество удаленных комментариев.*/
    return result.deletedCount ?? 0;
  }

  /*Метод для удаления комментариев по ID пользователя в БД.*/
  async deleteAllByUserId(userId: string): Promise<number> {
    /*Просим модель "CommentModel" удалить комментарии по ID пользователя в БД.*/
    const result: DeleteResult = await CommentModel.deleteMany({ 'commentatorInfo.userId': userId });
    /*Возвращаем количество удаленных комментариев.*/
    return result.deletedCount ?? 0;
  }

  /*Метод для удаления комментариев по ID постов в БД.*/
  async deleteAllByPostIds(postIds: string[]): Promise<number> {
    /*Просим модель "CommentModel" удалить комментарии по ID постов в БД.*/
    const result: DeleteResult = await CommentModel.deleteMany({ postId: { $in: postIds } });
    /*Возвращаем количество удаленных комментариев.*/
    return result.deletedCount ?? 0;
  }
}
