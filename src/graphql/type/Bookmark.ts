import { enumType, extendType, nonNull, objectType, stringArg } from 'nexus';

export const Bookmark = objectType({
    name: 'Bookmark',
    definition(t) {
        t.nonNull.string('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('name');
        t.nonNull.field('status', { type: 'Status' });
        t.string('comicUrl');
        t.nonNull.list.field('tags', {
            type: 'Tag',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.bookmark
                    .findUnique({ where: { id } })
                    .tags();
            },
        });
        t.field('user', {
            type: 'User',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.bookmark
                    .findUnique({ where: { id } })
                    .user();
            },
        });
        t.field('comic', {
            type: 'Comic',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.bookmark
                    .findUnique({
                        where: { id },
                    })
                    .comic();
            },
        });
    },
});

export const Status = enumType({
    name: 'Status',
    members: ['READING', 'ON_HOLD', 'PLAN_TO_READ', 'COMPLETED', 'DROPPED'],
});

export const BookmarkQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('bookmarks', {
            type: 'Bookmark',
            args: {
                userId: nonNull(stringArg()),
            },
            resolve: async (_parent, { userId }, { prisma }) => {
                return await prisma.bookmark.findMany({
                    where: { userId },
                    orderBy: { createdAt: 'asc' },
                });
            },
        });

        t.field('bookmark', {
            type: 'Bookmark',
            args: {
                id: nonNull(stringArg()),
            },
            resolve: async (_parent, { id }, { prisma }) => {
                return await prisma.bookmark.findUnique({
                    where: { id },
                });
            },
        });
    },
});
