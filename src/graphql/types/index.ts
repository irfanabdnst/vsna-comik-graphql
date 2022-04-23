import { asNexusMethod } from 'nexus';
import { DateTimeResolver } from 'graphql-scalars';

export * from './User';
export * from './Comic';
export * from './Tag';
export * from './Chapter';
export * from './Image';

export const DateTime = asNexusMethod(DateTimeResolver, 'date');
