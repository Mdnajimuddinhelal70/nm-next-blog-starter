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

const getAllPost = async ({
  page = 1,
  limit = 3,
  search,
  isFeatured,
  tags,
  sortBy,
}: {
  page?: number;
  limit?: number;
  search?: string;
  isFeatured?: boolean;
  tags?: string[];
  sortBy?: string;
}) => {
  const skip = (page - 1) * limit;
  console.log({ tags });
  const where: any = {
    AND: [
      search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      },
      typeof isFeatured === "boolean" && { isFeatured },
      tags && tags.length > 0 && { tags: { hasEvery: tags } },
      sortBy,
    ].filter(Boolean),
  };
  let orderBy: any = { createdAt: "desc" }; // default sort

  if (sortBy) {
    if (sortBy.startsWith("-")) {
      const field = sortBy.substring(1);
      orderBy = { [field]: "desc" };
    } else {
      orderBy = { [sortBy]: "asc" };
    }
  }

  const result = await prisma.post.findMany({
    skip,
    take: limit,
    where,
    orderBy,
  });
  const total = await prisma.post.count({ where });
  return {
    data: result,
    pagination: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getSinglePost = async (id: number) => {
  const result = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const postData = await tx.post.findUnique({
      where: { id },
      include: { author: true },
    });
    return postData;
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
