import {
    enumType,
    extendType,
    inputObjectType,
    nonNull,
    objectType,
    stringArg,
} from 'nexus';
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

export const ProfileInput = inputObjectType({
    name: 'ProfileInput',
    definition(t) {
        t.string('firstName');
        t.string('lastName');
        t.field('birthDate', { type: 'DateTime' });
        t.string('profileImageUrl');
    },
});

export const UserCreateInput = inputObjectType({
    name: 'UserCreateInput',
    definition(t) {
        t.nonNull.string('email');
        t.nonNull.string('username');
        t.nonNull.string('password');
        t.field('role', { type: 'Role' });
        t.field('profile', { type: 'ProfileInput' });
    },
});

export const UserUpdateInput = inputObjectType({
    name: 'UserUpdateInput',
    definition(t) {
        t.string('email');
        t.string('username');
        t.field('role', { type: 'Role' });
        t.field('profile', { type: 'ProfileInput' });
    },
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

export const UserMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createUser', {
            type: 'User',
            args: { data: nonNull('UserCreateInput') },
            resolve: async (_parent, { data }, { prisma }) => {
                const password = bcrypt.hashSync(data.password);

                return await prisma.user.create({
                    data: {
                        ...data,
                        password,
                        role: data.role || undefined,
                    },
                });
            },
        });

        t.nonNull.field('updateUser', {
            type: 'User',
            args: {
                id: nonNull(stringArg()),
                data: nonNull('UserUpdateInput'),
            },
            resolve: async (_parent, { id, data }, { prisma }) => {
                const dataUpdate = {
                    ...data,
                    email: data.email || undefined,
                    username: data.username || undefined,
                    role: data.role || undefined,
                };

                return await prisma.user.update({
                    where: { id },
                    data: dataUpdate,
                });
            },
        });

        t.nonNull.field('deleteUser', {
            type: 'User',
            args: { id: nonNull(stringArg()) },
            resolve: async (_parent, { id }, { prisma }) => {
                return await prisma.user.delete({ where: { id } });
            },
        });
    },
});
