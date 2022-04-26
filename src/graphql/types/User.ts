import { enumType, extendType, objectType } from 'nexus';

export const User = objectType({
    name: 'User',
    definition(t) {
        t.nonNull.string('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('email');
        t.nonNull.string('username');
        t.field('role', { type: 'Role' });
        t.nonNull.list.field('bookmarks', {
            type: 'Comic',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.user
                    .findUnique({
                        where: { id },
                    })
                    .bookmarks();
            },
        });
    },
});

export const Role = enumType({
    name: 'Role',
    members: ['ADMIN', 'USER'],
});

export const UserQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('users', {
            type: 'User',
            resolve: async (_parent, _args, { prisma }) => {
                return await prisma.user.findMany({
                    orderBy: { createdAt: 'asc' },
                });
            },
        });
    },
});
