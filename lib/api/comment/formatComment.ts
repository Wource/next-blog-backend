import { CommentItem, PublicCommentItem } from "./schema/comment";

interface CommentAuthorInput {
  id: string;
  name: string;
  image: string | null;
}

interface CommentInput {
  id: string;
  content: string;
  status: string;
  blogId: string;
  userId: string;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: CommentAuthorInput;
}

export function formatComment(c: CommentInput): CommentItem {
  return {
    id: c.id,
    content: c.content,
    status: c.status,
    blogId: c.blogId,
    userId: c.userId,
    parentId: c.parentId,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    author: {
      id: c.user.id,
      name: c.user.name,
      image: c.user.image,
    },
    responses: [],
  };
}

export function formatPublicComment(c: CommentInput): PublicCommentItem {
  return {
    content: c.content,
    status: c.status,
    createdAt: c.createdAt.toISOString(),
    author: {
      name: c.user.name,
      image: c.user.image,
    },
    responses: [],
  };
}
