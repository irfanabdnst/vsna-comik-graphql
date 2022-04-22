import { extendType, nonNull, objectType, stringArg } from 'nexus';

export const Comic = objectType({
    name: 'Comic',
    definition(t) {
        t.string('id');
        t.string('title');
        t.string('description');
        t.string('author');
        t.boolean('published');
        t.string('coverImageUrl');
        t.field('createdAt', { type: 'DateTime' });
        t.field('updatedAt', { type: 'DateTime' });
        t.list.string('tags', {
            async resolve({ id }, _args, { prisma }) {
                return await prisma.comic
                    .findUnique({
                        where: { id: id || undefined },
                    })
                    .tags()
                    .then((tag) => tag.map((t) => t.name));
            },
        });
        t.list.field('users', {
            type: 'User',
            async resolve({ id }, _args, { prisma }) {
                return await prisma.comic
                    .findUnique({
                        where: { id: id || undefined },
                    })
                    .users();
            },
        });
    },
});

export const ComicMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('addTag', {
            type: 'Comic',
            args: {
                comicId: nonNull(stringArg()),
                tagId: nonNull(stringArg()),
            },
            async resolve(_parent, { comicId, tagId }, { prisma }) {
                return await prisma.comic.update({
                    where: { id: comicId },
                    data: {
                        tags: {
                            connect: { id: tagId },
                        },
                    },
                });
            },
        });
    },
});
