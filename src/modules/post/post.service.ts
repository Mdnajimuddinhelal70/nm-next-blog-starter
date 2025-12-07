import { prisma } from "../../config/db";
import { Post, Prisma } from "../../generated/client";

const createPost = async (payload: Prisma.PostCreateInput): Promise<Post> => {
  const result = await prisma.post.create({
    data: payload,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
  return result;
};

const getAllPost = async () => {
  const result = await prisma.post.findMany();
  return result;
};

const getSinglePost = async (id: number) => {
  const result = await prisma.post.findUnique({
    where: { id },
  });
  return result;
};

const updatePost = async (id: number, data: any) => {
  const result = await prisma.post.update({
    where: { id },
    data: data,
  });
  return result;
};
export const PostService = {
  createPost,
  getAllPost,
  getSinglePost,
  updatePost,
};
