import { enumType, extendType, objectType } from 'nexus';

export const User = objectType({
    name: 'User',
    definition(t) {
        t.string('id');
        t.string('email');
        t.string('username');
        t.field('role', { type: 'Role' });
        t.field('createdAt', { type: 'DateTime' });
        t.field('updatedAt', { type: 'DateTime' });
        t.list.field('bookmarks', {
            type: 'Comic',
            async resolve({ id }, _args, { prisma }) {
                return await prisma.user
                    .findUnique({
                        where: { id: id || undefined },
                    })
                    .bookmarks();
            },
        });
    },
});

export const AllUser = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('users', {
            type: 'User',
            resolve(_parent, _args, { prisma }) {
                return prisma.user.findMany();
            },
        });
    },
});

export const Role = enumType({
    name: 'Role',
    members: ['ADMIN', 'USER'],
});
