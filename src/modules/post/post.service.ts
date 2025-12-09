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

const getBlogStat = async () => {
  return await prisma.$transaction(async (tx) => {
    const aggregates = await tx.post.aggregate({
      _count: true,
      _sum: { views: true },
      _avg: { views: true },
      _max: { views: true },
      _min: { views: true },
    });

    const featuredCount = await tx.post.count({
      where: {
        isFeatured: true,
      },
    });

    const topFeatured = await tx.post.count({
      where: { isFeatured: true },
      orderBy: { views: "desc" },
    });

    const lassWeek = new Date();
    lassWeek.setDate(lassWeek.getDate() - 7);

    const lasrWeekPostCount = await tx.post.count({
      where: {
        createdAt: {
          gte: lassWeek,
        },
      },
    });
    return {
      stats: {
        totalPosts: aggregates._count ?? 0,
        totalViews: aggregates._sum.views ?? 0,
        avglViews: aggregates._avg.views ?? 0,
        minlViews: aggregates._min.views ?? 0,
        maxlViews: aggregates._max.views ?? 0,
      },
      featured: {
        count: featuredCount,
      },
      topFeatured: {
        count: topFeatured,
        lasrWeekPostCount,
      },
    };
  });
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
  getBlogStat,
};
