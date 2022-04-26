import { enumType, objectType } from 'nexus';

export const Comic = objectType({
    name: 'Comic',
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('title');
        t.nonNull.boolean('published');
        t.nonNull.field('status', { type: 'Status' });
        t.nonNull.list.field('users', {
            type: 'User',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.comic
                    .findUnique({
                        where: { id },
                    })
                    .users();
            },
        });
        t.nonNull.list.field('chapters', {
            type: 'Chapter',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.comic
                    .findUnique({
                        where: { id },
                    })
                    .chapters();
            },
        });
    },
});

export const Status = enumType({
    name: 'Status',
    members: ['READING', 'ON_HOLD', 'PLAN_TO_READ', 'COMPLETED', 'DROPPED'],
});
