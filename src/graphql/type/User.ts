import { enumType, extendType, nonNull, objectType, stringArg } from 'nexus';
import bcrypt from 'bcryptjs';

export const User = objectType({
    name: 'User',
    definition(t) {
        t.nonNull.string('id');
        t.nonNull.field('createdAt', { type: 'DateTime' });
        t.nonNull.field('updatedAt', { type: 'DateTime' });
        t.nonNull.string('email');
        t.nonNull.string('username');
        t.nonNull.field('role', { type: 'Role' });
        t.field('profile', {
            type: 'Profile',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.user
                    .findUnique({ where: { id } })
                    .profile();
            },
        });
        t.nonNull.list.field('bookmarks', {
            type: 'Bookmark',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.user
                    .findUnique({ where: { id } })
                    .bookmarks();
            },
        });
        t.nonNull.list.field('tagsCreated', {
            type: 'Tag',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.user
                    .findUnique({ where: { id } })
                    .tagsCreated();
            },
        });
    },
});

export const Profile = objectType({
    name: 'Profile',
    definition(t) {
        t.string('firstName');
        t.string('lastName');
        t.field('birthDate', { type: 'DateTime' });
        t.string('profileImageUrl');
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

        t.field('user', {
            type: 'User',
            args: { id: nonNull(stringArg()) },
            resolve: async (_parent, { id }, { prisma }) => {
                return await prisma.user.findUnique({ where: { id } });
            },
        });
    },
});
