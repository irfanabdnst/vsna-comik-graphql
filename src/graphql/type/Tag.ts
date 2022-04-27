import { objectType } from 'nexus';

export const Tag = objectType({
    name: 'Tag',
    definition(t) {
        t.nonNull.string('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('name');
        t.string('description');
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
