import { extendType, nonNull, objectType, stringArg } from 'nexus';

export const Comic = objectType({
    name: 'Comic',
    definition(t) {
        t.nonNull.string('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('name');
        t.nonNull.list.field('bookmarks', {
            type: 'Bookmark',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.comic
                    .findUnique({
                        where: { id },
                    })
                    .bookmarks();
            },
        });
    },
});

export const ComicQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('comics', {
            type: 'Comic',
            resolve: async (_parent, _args, { prisma }) => {
                return await prisma.comic.findMany({
                    orderBy: { createdAt: 'asc' },
                });
            },
        });

        t.field('comic', {
            type: 'Comic',
            args: { id: nonNull(stringArg()) },
            resolve: async (_parent, { id }, { prisma }) => {
                return await prisma.comic.findUnique({ where: { id } });
            },
        });
    },
});
