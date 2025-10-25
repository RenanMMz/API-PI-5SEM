import { DataSource } from 'typeorm';
import { TGFITE } from './tgfite.entity';

export const tgfiteProviders = [
    {
        provide: 'TGFITE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(TGFITE),
        inject: ['DATA_SOURCE'],
    },
];
