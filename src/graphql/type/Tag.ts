import {
    extendType,
    inputObjectType,
    nonNull,
    objectType,
    stringArg,
} from 'nexus';

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

export const TagCreateInput = inputObjectType({
    name: 'TagCreateInput',
    definition(t) {
        t.nonNull.string('name');
        t.nonNull.string('description');
        t.nonNull.string('userId');
    },
});

export const TagUpdateInput = inputObjectType({
    name: 'TagUpdateInput',
    definition(t) {
        t.string('name');
        t.string('description');
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

export const TagMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createTag', {
            type: 'Tag',
            args: { data: nonNull('TagCreateInput') },
            resolve: async (_parent, { data }, { prisma }) => {
                return await prisma.tag.create({ data });
            },
        });

        t.nonNull.field('updateTag', {
            type: 'Tag',
            args: {
                data: nonNull('TagUpdateInput'),
                id: nonNull(stringArg()),
            },
            resolve: async (_parent, { id, data }, { prisma }) => {
                return await prisma.tag.update({
                    where: { id },
                    data: {
                        name: data.name || undefined,
                        description: data.description || undefined,
                    },
                });
            },
        });

        t.nonNull.field('deleteTag', {
            type: 'Tag',
            args: { id: nonNull(stringArg()) },
            resolve: async (_parent, { id }, { prisma }) => {
                return await prisma.tag.delete({ where: { id } });
            },
        });
    },
});
