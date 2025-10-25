import { DataSource } from 'typeorm';
import { TGFEST } from './tgfest.entity';

export const tgfestProviders = [
    {
        provide: 'TGFEST_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(TGFEST),
        inject: ['DATA_SOURCE'],
    },
];
