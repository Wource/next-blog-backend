export interface CommentItem {
  id: string;
  content: string;
  status: string;
  blogId: string;
  userId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  author: { id: string; name: string; image: string | null };
  responses: CommentItem[];
}

export interface PublicCommentItem {
  content: string;
  status: string;
  createdAt: string;
  author: { name: string; image: string | null };
  responses: PublicCommentItem[];
}
