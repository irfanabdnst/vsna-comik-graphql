import {
    enumType,
    extendType,
    inputObjectType,
    nonNull,
    objectType,
} from 'nexus';

export const Comic = objectType({
    name: 'Comic',
    definition(t) {
        t.nonNull.string('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('title');
        t.boolean('published');
        t.field('status', { type: 'Status' });
        t.nonNull.list.field('sources', {
            type: 'Source',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.comic
                    .findUnique({
                        where: { id },
                    })
                    .sources();
            },
        });
        t.nonNull.list.field('users', {
            type: 'User',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.comic
                    .findUnique({
                        where: { id },
                    })
                    .users();
            },
        });
    },
});

export const ComicCreateInput = inputObjectType({
    name: 'ComicCreateInput',
    definition(t) {
        t.nonNull.string('title');
        t.boolean('published');
        t.field('status', { type: 'Status' });
        t.string('sourceId');
    },
});

export const Status = enumType({
    name: 'Status',
    members: ['READING', 'ON_HOLD', 'PLAN_TO_READ', 'COMPLETED', 'DROPPED'],
});

export const ComicQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('comics', {
            type: 'Comic',
            resolve: async (_parent, _args, { prisma }) => {
                return await prisma.comic.findMany({
                    orderBy: { createdAt: 'desc' },
                });
            },
        });
    },
});

export const ComicMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createComic', {
            type: 'Comic',
            args: { data: nonNull('ComicCreateInput') },
            resolve: async (_parent, { data }, { prisma }) => {
                return await prisma.comic.create({
                    data: {
                        title: data.title,
                        published: data.published,
                        status: data.status,
                        sources: {
                            connect: { id: data.sourceId },
                        },
                    },
                });
            },
        });
    },
});
