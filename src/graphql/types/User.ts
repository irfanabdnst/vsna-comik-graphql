import { enumType, objectType } from 'nexus';

export const User = objectType({
    name: 'User',
    definition(t) {
        t.string('id');
        t.string('email');
        t.string('username');
        t.field('role', { type: 'Role' });
        t.field('createdAt', { type: 'DateTime' });
    },
});

export const Role = enumType({
    name: 'Role',
    members: ['ADMIN', 'USER'],
});
