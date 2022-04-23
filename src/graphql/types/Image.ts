import { extendType, intArg, nonNull, objectType } from 'nexus';

export const Image = objectType({
    name: 'Image',
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.int('pageNumber');
        t.nonNull.string('imageUrl');
        t.field('chapter', {
            type: 'Chapter',
            async resolve({ id }, _args, { prisma }) {
                return await prisma.image
                    .findUnique({
                        where: { id },
                    })
                    .chapter();
            },
        });
    },
});

export const ImageQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('images', {
            type: 'Image',
            args: { chapterId: nonNull(intArg()) },
            async resolve(_parent, { chapterId }, { prisma }) {
                return await prisma.image.findMany({ where: { chapterId } });
            },
        });
    },
});
