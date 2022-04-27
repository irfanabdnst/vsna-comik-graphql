import { extendType, nonNull, objectType, stringArg } from 'nexus';

export const Tag = objectType({
    name: 'Tag',
    definition(t) {
        t.nonNull.string('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('name');
        t.string('description');
        t.int('comicTotal', {
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.bookmark.count({
                    where: {
                        tags: { some: { id } },
                    },
                });
            },
        });
        t.field('user', {
            type: 'User',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.tag.findUnique({ where: { id } }).user();
            },
        });
        t.field('bookmark', {
            type: 'Bookmark',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.tag
                    .findUnique({ where: { id } })
                    .bookmark();
            },
        });
    },
});

export const TagQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('tags', {
            type: 'Tag',
            args: { userId: nonNull(stringArg()) },
            resolve: async (_parent, { userId }, { prisma }) => {
                return await prisma.tag.findMany({
                    where: {
                        userId,
                    },
                    orderBy: { name: 'asc' },
                });
            },
        });

        t.field('tag', {
            type: 'Tag',
            args: { id: nonNull(stringArg()) },
            resolve: async (_parent, { id }, { prisma }) => {
                return await prisma.tag.findUnique({ where: { id } });
            },
        });
    },
});
