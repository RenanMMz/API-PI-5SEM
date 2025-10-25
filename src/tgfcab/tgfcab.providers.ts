import { DataSource } from 'typeorm';
import { TGFCAB } from './tgfcab.entity';

export const tgfcabProviders = [
    {
        provide: 'TGFCAB_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(TGFCAB),
        inject: ['DATA_SOURCE'],
    },
];
