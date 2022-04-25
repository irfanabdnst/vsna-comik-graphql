import {
    extendType,
    inputObjectType,
    intArg,
    list,
    nonNull,
    objectType,
} from 'nexus';

export const Comic = objectType({
    name: 'Comic',
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('title');
        t.string('description');
        t.field('releaseDate', { type: 'DateTime' });
        t.string('author');
        t.nonNull.boolean('published');
        t.string('coverImageUrl');
        t.list.field('tags', {
            type: 'Tag',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.comic
                    .findUnique({
                        where: { id },
                    })
                    .tags();
            },
        });
        t.list.field('users', {
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

        t.field('comic', {
            type: 'Comic',
            args: { id: nonNull(intArg()) },
            resolve: async (_parent, { id }, { prisma }) => {
                return await prisma.comic.findUnique({ where: { id } });
            },
        });
    },
});

export const CreateComicInput = inputObjectType({
    name: 'CreateComicInput',
    definition(t) {
        t.nonNull.string('title');
        t.string('description');
        t.field('releaseDate', { type: 'DateTime' });
        t.string('author');
        t.boolean('published', { default: false });
        t.string('coverImageUrl');
        t.list.int('tagId');
    },
});

export const UpdateComicInput = inputObjectType({
    name: 'UpdateComicInput',
    definition(t) {
        t.string('title');
        t.string('description');
        t.field('releaseDate', { type: 'DateTime' });
        t.string('author');
        t.boolean('published', { default: false });
        t.string('coverImageUrl');
    },
});

export const ComicMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createComic', {
            type: 'Comic',
            args: { data: nonNull('CreateComicInput') },
            resolve: async (_parent, { data }, { prisma }) => {
                const tagId = await data.tagId?.map((t) => {
                    return { id: t || undefined };
                });

                return await prisma.comic.create({
                    data: {
                        ...data,
                        published: data.published || undefined,
                        tags: { connect: tagId },
                    },
                });
            },
        });

        t.nonNull.field('updateComic', {
            type: 'Comic',
            args: {
                id: nonNull(intArg()),
                data: nonNull('UpdateComicInput'),
            },
            resolve: async (_parent, { id, data }, { prisma }) => {
                return await prisma.comic.update({
                    where: { id },
                    data: {
                        ...data,
                        title: data.title || undefined,
                        published: data.published || false,
                    },
                });
            },
        });

        t.nonNull.field('updateComicTag', {
            type: 'Comic',
            args: {
                comicId: nonNull(intArg()),
                tagId: nonNull(list(intArg())),
            },
            resolve: async (_parent, { comicId, tagId }, { prisma }) => {
                const tags = await tagId.map((t) => ({ id: t || undefined }));

                return prisma.comic.update({
                    where: { id: comicId },
                    data: {
                        tags: { set: tags },
                    },
                });
            },
        });

        t.nonNull.field('deleteComic', {
            type: 'Comic',
            args: { id: nonNull(intArg()) },
            resolve: async (_parent, { id }, { prisma }) => {
                return prisma.comic.delete({ where: { id } });
            },
        });
    },
});
