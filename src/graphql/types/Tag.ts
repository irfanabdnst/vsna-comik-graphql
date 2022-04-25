import { extendType, intArg, nonNull, objectType, stringArg } from 'nexus';

export const Tag = objectType({
    name: 'Tag',
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('name');
        t.list.field('comics', {
            type: 'Comic',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.tag
                    .findUnique({
                        where: { id },
                    })
                    .comics();
            },
        });
    },
});

export const TagQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('tags', {
            type: 'Tag',
            resolve: async (_parent, _args, { prisma }) => {
                return await prisma.tag.findMany({
                    orderBy: { name: 'asc' },
                });
            },
        });
        t.field('tag', {
            type: 'Tag',
            args: { id: nonNull(intArg()) },
            resolve: async (_parent, { id }, { prisma }) => {
                return await prisma.tag.findUnique({ where: { id } });
            },
        });
    },
});

export const TagMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createTag', {
            type: 'Tag',
            args: { name: nonNull(stringArg()) },
            resolve: async (_parent, { name }, { prisma }) => {
                return await prisma.tag.create({ data: { name } });
            },
        });

        t.nonNull.field('deleteTag', {
            type: 'Tag',
            args: { id: nonNull(intArg()) },
            resolve: async (_parent, { id }, { prisma }) => {
                return await prisma.tag.delete({ where: { id } });
            },
        });
    },
});
