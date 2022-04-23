import { enumType, objectType } from 'nexus';
export const User = objectType({
    name: 'User',
    definition(t) {
        t.nonNull.int('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('email');
        t.nonNull.string('username');
        t.nonNull.field('role', { type: 'Role' });
        t.list.field('bookmarks', {
            type: 'Comic',
            async resolve({ id }, _args, { prisma }) {
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
