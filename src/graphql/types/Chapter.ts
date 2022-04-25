import {
    extendType,
    inputObjectType,
    intArg,
    nonNull,
    objectType,
} from 'nexus';

export const Chapter = objectType({
    name: 'Chapter',
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('chapterNumber');
        t.string('title');
        t.nonNull.boolean('published');
        t.field('comic', {
            type: 'Comic',
            async resolve({ id }, _args, { prisma }) {
                return await prisma.chapter
                    .findUnique({
                        where: { id },
                    })
                    .comic();
            },
        });
    },
});

export const ChapterQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('chapters', {
            type: 'Chapter',
            async resolve(_parent, _args, { prisma }) {
                return await prisma.chapter.findMany({
                    orderBy: { createdAt: 'desc' },
                });
            },
        });

        t.field('chapter', {
            type: 'Chapter',
            args: { id: nonNull(intArg()) },
            async resolve(_parent, { id }, { prisma }) {
                return await prisma.chapter.findUnique({ where: { id } });
            },
        });
    },
});

export const CreateChapterInput = inputObjectType({
    name: 'CreateChapterInput',
    definition(t) {
        t.nonNull.string('chapterNumber');
        t.string('title');
        t.boolean('published');
    },
});

export const UpdateChapterInput = inputObjectType({
    name: 'UpdateChapterInput',
    definition(t) {
        t.string('chapterNumber');
        t.string('title');
        t.boolean('published');
    },
});

export const ChapterMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createChapter', {
            type: 'Chapter',
            args: {
                comicId: nonNull(intArg()),
                data: nonNull('CreateChapterInput'),
            },
            resolve: async (_parent, { comicId, data }, { prisma }) => {
                return await prisma.chapter.create({
                    data: {
                        ...data,
                        comicId,
                        published: data.published || false,
                    },
                });
            },
        });

        t.nonNull.field('updateChapter', {
            type: 'Chapter',
            args: {
                id: nonNull(intArg()),
                data: nonNull('UpdateChapterInput'),
            },
            resolve: async (_parent, { id, data }, { prisma }) => {
                return await prisma.chapter.update({
                    where: { id },
                    data: {
                        ...data,
                        chapterNumber: data.chapterNumber || undefined,
                        published: data.published || false,
                    },
                });
            },
        });

        t.nonNull.field('updateChapterComic', {
            type: 'Chapter',
            args: {
                chapterId: nonNull(intArg()),
                comicId: nonNull(intArg()),
            },
            resolve: async (_parent, { chapterId, comicId }, { prisma }) => {
                return await prisma.chapter.update({
                    where: { id: chapterId },
                    data: {
                        comicId,
                    },
                });
            },
        });

        t.nonNull.field('deleteChapter', {
            type: 'Chapter',
            args: { id: nonNull(intArg()) },
            resolve: async (_parent, { id }, { prisma }) => {
                return await prisma.chapter.delete({ where: { id } });
            },
        });
    },
});
