import { extendType, nonNull, objectType, stringArg } from 'nexus';

export const Tag = objectType({
    name: 'Tag',
    definition(t) {
        t.nonNull.string('id');
        t.field('createdAt', { type: 'DateTime' });
        t.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('name');
        t.list.field('comics', {
            type: 'Comic',
            async resolve({ name }, _args, { prisma }) {
                return await prisma.tag
                    .findUnique({
                        where: { name: name || undefined },
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
            async resolve(_parent, _args, { prisma }) {
                return await prisma.tag.findMany();
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
            async resolve(_parent, { name }, { prisma }) {
                return await prisma.tag.create({
                    data: {
                        name,
                    },
                });
            },
        });

        t.nonNull.field('deleteTag', {
            type: 'Tag',
            args: { tagId: nonNull(stringArg()) },
            async resolve(_parent, { tagId }, { prisma }) {
                return await prisma.tag.delete({
                    where: { id: tagId },
                });
            },
        });
    },
});
