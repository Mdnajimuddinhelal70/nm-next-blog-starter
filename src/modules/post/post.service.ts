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

const getAllPost = async ({ page, limit }: { page: number; limit: number }) => {
  const skip = (page - 1) * limit;
  const result = await prisma.post.findMany({
    skip,
    take: limit,
  });
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

const deletePost = async (id: number) => {
  const result = await prisma.post.delete({
    where: { id },
  });
  return null;
};
export const PostService = {
  createPost,
  getAllPost,
  getSinglePost,
  updatePost,
  deletePost,
};
