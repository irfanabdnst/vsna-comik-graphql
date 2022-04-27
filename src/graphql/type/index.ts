import { DateTimeResolver } from 'graphql-scalars';
import { asNexusMethod } from 'nexus';

export * from './Comic';
export * from './User';
export * from './Bookmark';
export * from './Tag';

export const DateTime = asNexusMethod(DateTimeResolver, 'date');
