import { extendType, inputObjectType, nonNull, objectType } from 'nexus';

export const Source = objectType({
    name: 'Source',
    definition(t) {
        t.nonNull.string('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('name');
        t.string('homepageUrl');
        t.string('imageUrl');
        t.nonNull.list.field('comics', {
            type: 'Comic',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.source
                    .findUnique({
                        where: { id },
                    })
                    .comics();
            },
        });
    },
});

export const SourceCreateInput = inputObjectType({
    name: 'SourceCreateInput',
    definition(t) {
        t.nonNull.string('name');
        t.string('homepageUrl');
        t.string('imageUrl');
        t.string('comicId');
    },
});

export const SourceQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('sources', {
            type: 'Source',
            resolve: async (_parent, _args, { prisma }) => {
                return await prisma.source.findMany({
                    orderBy: { createdAt: 'asc' },
                });
            },
        });
    },
});

export const SourceMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createSource', {
            type: 'Source',
            args: { data: nonNull('SourceCreateInput') },
            resolve: async (_parent, { data }, { prisma }) => {
                return await prisma.source.create({
                    data: {
                        ...data,
                    },
                });
            },
        });
    },
});
