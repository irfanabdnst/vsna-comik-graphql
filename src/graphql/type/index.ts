import { DateTimeResolver } from 'graphql-scalars';
import { asNexusMethod } from 'nexus';

export * from './User';
export * from './Comic';
export * from './Chapter';

export const DateTime = asNexusMethod(DateTimeResolver, 'date');
