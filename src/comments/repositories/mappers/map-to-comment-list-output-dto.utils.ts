import { CommentListDBType } from '../types/comment-list-db.type';
import { CommentsQueryRepository } from '../comments.query-repository';
import { CommentListOutputDTO } from '../../routes/output-dto/comment-list.output-dto';
import { commentLikeStatusOutputDTO } from '../../routes/output-dto/comment.output-dto';
import { CommentLikeDataDBType } from '../types/comment-like-data-db.type';
import { mapToCommentOutputDTO } from './map-to-comment-output-dto.util';

/*Функция для преобразования комментариев из БД в подготовленные для отправки клиенту без пагинации комментарии.*/
export const mapToCommentListOutputDTO = async (
  comments: CommentListDBType,
  commentsQueryRepository: CommentsQueryRepository,
  userId: string | undefined
): Promise<CommentListOutputDTO> => {
  return await Promise.all(
    comments.map(async comment => {
      const commentId: string = comment._id.toString();
      /*Формируем статус лайка комментария.*/
      let likeStatus: commentLikeStatusOutputDTO = commentLikeStatusOutputDTO.None;

      if (userId) {
        const commentLikeDataDB: CommentLikeDataDBType | null =
          await commentsQueryRepository.findCommentLikeDataByCommentIdAndUserId(commentId, userId);

        if (commentLikeDataDB) likeStatus = commentLikeDataDB.likeStatus as unknown as commentLikeStatusOutputDTO;
      }

      return mapToCommentOutputDTO(comment, likeStatus);
    })
  );
};
