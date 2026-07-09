import { Filter } from 'mongodb';
import { CommentType } from '../application/types/comment.type';
import { GetCommentListByPostIdQueryInputDTO } from '../routes/input-dto/query/get-comment-list-by-post-id-query.input-dto';
import { SortDirection } from '../../core/types/pagination/sort-direction';
import { CommentSortFieldQueryInputDTO } from '../routes/input-dto/query/comment-sort-field-query.input-dto';
import { CommentDBType } from './types/comment-db.type';
import { injectable } from 'inversify';
import { CommentListDBType } from './types/comment-list-db.type';
import { CommentModel } from './models/comment.model';

/*Query-репозиторий для работы с комментариями в БД.*/
@injectable()
export class CommentsQueryRepository {
  /*Метод для поиска комментария по ID в БД.*/
  async findById(id: string): Promise<CommentDBType | null> {
    /*Просим модель "CommentModel" найти комментарий по ID в БД.*/
    const comment: CommentDBType | null = await CommentModel.findById(id).lean();
    /*Если комментарий был найден, то возвращаем его, иначе null.*/
    return comment ?? null;
  }

  /*Метод для поиска комментариев по ID поста в БД.*/
  async findAllByPostId(
    postId: string,
    queryDTO: GetCommentListByPostIdQueryInputDTO
  ): Promise<{ items: CommentListDBType; totalCount: number }> {
    /*Создаем переменные на основе параметра "queryDTO" при помощи деструктуризации.*/
    const {
      pageNumber,
      pageSize,
      sortBy,
      sortDirection,
    }: {
      pageNumber: number;
      pageSize: number;
      sortBy: CommentSortFieldQueryInputDTO;
      sortDirection: SortDirection;
    } = queryDTO;

    /*Переменная "skip" обозначает сколько записей надо пропустить перед тем, как начать отдавать запрошенную страницу
    "pageNumber".*/
    const skip: number = (pageNumber - 1) * pageSize;
    /*Динамически собираем фильтр для поиска в MongoDB. Начинаем с пустого фильтра.*/
    const filter: Filter<CommentType> = {};
    /*Добавляем в фильтр ID поста.*/
    filter.postId = postId;

    /*Просим модель "CommentModel" найти комментарии в посте по ID в БД и подсчитать общее количество документов,
    подходящих под фильтр, без учета пагинации.*/
    const [items, totalCount]: [CommentListDBType, number] = await Promise.all([
      CommentModel.find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      CommentModel.countDocuments(filter),
    ]);

    /*Возвращаем данные по комментариям.*/
    return { items, totalCount };
  }
}
