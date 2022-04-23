import { objectType } from 'nexus';

export const Tag = objectType({
    name: 'Tag',
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('name');
        t.list.field('comics', {
            type: 'Comic',
            async resolve({ id }, _args, { prisma }) {
                return await prisma.tag
                    .findUnique({
                        where: { id },
                    })
                    .comics();
            },
        });
    },
});
