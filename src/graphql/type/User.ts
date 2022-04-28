import { extendType, inputObjectType, nonNull, objectType } from 'nexus';
import ObjectID from 'bson-objectid';

export const User = objectType({
    name: 'User',
    definition(t) {
        t.nonNull.string('id');
        t.nonNull.string('email');
        t.nonNull.string('username');
        t.field('profil', {
            type: 'Profile',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.user
                    .findUnique({
                        where: { id },
                        select: { profile: true },
                    })
                    .then((p) => {
                        return p?.profile || null;
                    });
            },
        });
        t.list.field('bookmarks', {
            type: 'Bookmark',
            resolve: async ({ id }, _args, { prisma }) => {
                return await prisma.user
                    .findUnique({
                        where: { id },
                    })
                    .then((user) => {
                        return user?.bookmarks || [];
                    });
            },
        });
    },
});

export const Profile = objectType({
    name: 'Profile',
    definition(t) {
        t.string('firstName');
        t.string('lastName');
    },
});

export const Bookmark = objectType({
    name: 'Bookmark',
    definition(t) {
        t.string('id'), t.string('name');
    },
});

export const CreateUserInput = inputObjectType({
    name: 'CreateUserInput',
    definition(t) {
        t.nonNull.string('email');
        t.nonNull.string('username');
        t.nonNull.string('password');
        t.field('profile', { type: 'ProfileInput' });
        t.list.field('bookmarks', { type: 'BookmarkInput' });
    },
});

export const BookmarkInput = inputObjectType({
    name: 'BookmarkInput',
    definition(t) {
        t.nonNull.string('name');
    },
});

export const ProfileInput = inputObjectType({
    name: 'ProfileInput',
    definition(t) {
        t.string('firstName');
        t.string('lastName');
    },
});

export const UserQuery = extendType({
    type: 'Query',
    definition(t) {
        t.nonNull.list.field('users', {
            type: 'User',
            resolve: async (_parent, _args, { prisma }) => {
                return await prisma.user.findMany();
            },
        });
    },
});

export const UserMutation = extendType({
    type: 'Mutation',
    definition(t) {
        t.nonNull.field('createUser', {
            type: 'User',
            args: { data: nonNull('CreateUserInput') },
            resolve: async (_parent, { data }, { prisma }) => {
                const bookmarks: bookmarks = [];

                if (data.bookmarks) {
                    data.bookmarks?.forEach((b) => {
                        const objectid = new ObjectID();
                        bookmarks.push({
                            id: objectid.toHexString(),
                            name: b?.name,
                        });
                    });
                }

                return await prisma.user.create({
                    data: {
                        ...data,
                        bookmarks: bookmarks,
                    },
                });
            },
        });
    },
});

type bookmarks = {
    id?: string | undefined;
    name?: string | undefined;
}[];
