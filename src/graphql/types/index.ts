import { DateTimeResolver } from 'graphql-scalars';
import { asNexusMethod } from 'nexus';

export * from './User';
export * from './Comic';
export * from './Tag';

export const DateTime = asNexusMethod(DateTimeResolver, 'date');
