import {
    enumType,
    extendType,
    inputObjectType,
    intArg,
    nonNull,
    objectType,
} from 'nexus';
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

enum RoleEnum {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

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
            args: { id: nonNull(intArg()) },
            resolve: async (_parent, { id }, { prisma }) => {
                return await prisma.user.findUnique({ where: { id } });
            },
        });
    },
});

export const CreateUserInput = inputObjectType({
    name: 'CreateUserInput',
    definition(t) {
        t.nonNull.string('email');
        t.nonNull.string('username');
        t.nonNull.string('password');
    },
});

export const UserMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createUser', {
            type: 'User',
            args: { data: nonNull('CreateUserInput') },
            resolve: async (_parent, { data }, { prisma }) => {
                const createData = {
                    ...data,
                    role: RoleEnum.USER,
                };

                return await prisma.user.create({ data: createData });
            },
        });

        t.nonNull.field('deleteUser', {
            type: 'User',
            args: { id: nonNull(intArg()) },
            resolve: async (_parent, { id }, { prisma }) => {
                return await prisma.user.delete({ where: { id } });
            },
        });
    },
});
