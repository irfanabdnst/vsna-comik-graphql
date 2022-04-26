import { objectType } from 'nexus';

export const Source = objectType({
    name: 'Source',
    definition(t) {
        t.nonNull.string('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('name');
        t.nonNull.string('homepageUrl');
        t.nonNull.string('imageUrl');
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
