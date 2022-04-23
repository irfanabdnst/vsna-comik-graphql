import { objectType } from 'nexus';

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
            async resolve({ id }, _args, { prisma }) {
                return await prisma.comic
                    .findUnique({
                        where: { id },
                    })
                    .tags();
            },
        });
        t.list.field('users', {
            type: 'User',
            async resolve({ id }, _args, { prisma }) {
                return await prisma.comic
                    .findUnique({
                        where: { id },
                    })
                    .users();
            },
        });
    },
});
