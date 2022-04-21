import { DateTimeResolver } from 'graphql-scalars';
import { asNexusMethod } from 'nexus';

export * from './User';

export const DateTime = asNexusMethod(DateTimeResolver, 'date');
