import { PostType } from '../application/types/post.type';
import { DeleteResult } from 'mongodb';
import { UpdatePostByIdInputDTO } from '../routes/input-dto/update-post-by-id.input-dto';
import { PostDBType } from './types/post-db.type';
import { injectable } from 'inversify';
import { PostListDBType } from './types/post-list-db.type';
import { PostModel } from './models/post.model';
import { HydratedDocument } from 'mongoose';

/*Репозиторий для работы с постами в БД.*/
@injectable()
export class PostsRepository {
  /*Метод для добавления поста в БД.*/
  async create(newPost: PostType): Promise<string> {
    /*Просим модель "PostModel" создать пост в БД.*/
    const post: HydratedDocument<PostType> = new PostModel(newPost);
    await post.save();
    /*Возвращаем ID созданного поста.*/
    return post._id.toString();
  }

  /*Метод для поиска поста по ID в БД.*/
  async findById(id: string): Promise<PostDBType | null> {
    /*Просим модель "PostModel" найти пост по ID в БД.*/
    const post: PostDBType | null = await PostModel.findById(id).lean();
    /*Если пост был найден, то возвращаем его, иначе возвращаем null.*/
    return post ?? null;
  }

  /*Метод для поиска постов по ID блога в БД.*/
  async findAllByBlogId(blogId: string): Promise<PostListDBType | null> {
    /*Просим модель "PostModel" найти посты по ID блога в БД.*/
    const posts: PostListDBType = await PostModel.find({ blogId }).lean();
    /*Если посты были найдены, то возвращаем их, иначе возвращаем null.*/
    return posts.length === 0 ? null : posts;
  }

  /*Метод для изменения поста по ID в БД.*/
  async updateById(id: string, dto: UpdatePostByIdInputDTO): Promise<number> {
    /*Просим модель "PostModel" найти пост по ID в БД.*/
    const post: HydratedDocument<PostType> | null = await PostModel.findById(id);
    /*Если пост не был найден, то сообщаем, что он не был изменен.*/
    if (!post) return 0;
    /*Если пост был найден, то изменяем его в БД.*/
    post.title = dto.title;
    post.shortDescription = dto.shortDescription;
    post.content = dto.content;
    post.blogId = dto.blogId;
    await post.save();
    /*Сообщаем, что пост был изменен.*/
    return 1;
  }

  /*Метод для удаления поста по ID в БД.*/
  async deleteById(id: string): Promise<number> {
    /*Просим модель "PostModel" найти пост по ID в БД.*/
    const post: HydratedDocument<PostType> | null = await PostModel.findById(id);
    /*Если пост не был найден, то сообщаем, что он не был удален.*/
    if (!post) return 0;
    /*Если пост был найден, то удаляем его в БД.*/
    const result: DeleteResult = await post.deleteOne();
    /*Сообщаем, что пост был удален.*/
    return result.deletedCount;
  }

  /*Метод для удаления постов по ID блога в БД.*/
  async deleteAllByBlogId(blogId: string): Promise<number> {
    /*Просим модель "PostModel" удалить посты по ID блога в БД.*/
    const result: DeleteResult = await PostModel.deleteMany({ blogId });
    /*Возвращаем количество удаленных постов.*/
    return result.deletedCount ?? 0;
  }
}
