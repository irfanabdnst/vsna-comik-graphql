import { objectType } from 'nexus';

export const Chapter = objectType({
    name: 'Chapter',
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('chapterNumber');
        t.string('title');
        t.field('releaseDate', { type: 'DateTime' });
        t.nonNull.boolean('published');
        t.field('comic', {
            type: 'Comic',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.chapter
                    .findUnique({
                        where: { id },
                    })
                    .comic();
            },
        });
    },
});
