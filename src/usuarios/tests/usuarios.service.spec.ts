import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from '../usuarios.service';
import { Usuario } from '../usuarios.entity';
import { VaultData } from '../../vaultData/vaultData.entity'; // <--- 1. IMPORTE A ENTIDADE VAULTDATA
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

describe('UsuariosService', () => {
    let service: UsuariosService;
    let repo: Repository<Usuario>;
    let vaultRepo: Repository<VaultData>; // <--- Opcional: para asserções

    // Mock do Repositório de Usuários
    const mockRepository = {
        find: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        findOneBy: jest.fn(),
        merge: jest.fn(),
    };

    // 2. CRIAR MOCK DO REPOSITÓRIO DE VAULT
    const mockVaultRepository = {
        create: jest.fn(),
        save: jest.fn(),
    };

    // Mock do DataSource (com suporte a transactions)
    const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue({
            connect: jest.fn(),
            startTransaction: jest.fn(),
            release: jest.fn(),
            rollbackTransaction: jest.fn(),
            commitTransaction: jest.fn(),
            // Adiciona o manager, caso seu código use queryRunner.manager.save()
            manager: {
                save: jest.fn().mockImplementation((entity) => entity),
                create: jest.fn().mockImplementation((entity) => entity),
            }
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsuariosService,
                // Provider do Usuario
                {
                    provide: getRepositoryToken(Usuario),
                    useValue: mockRepository,
                },
                // 3. INJETAR O PROVIDER DO VAULTDATA
                {
                    provide: getRepositoryToken(VaultData),
                    useValue: mockVaultRepository,
                },
                // Provider do DataSource
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
            ],
        }).compile();

        service = module.get<UsuariosService>(UsuariosService);
        repo = module.get<Repository<Usuario>>(getRepositoryToken(Usuario));
        // vaultRepo = module.get<Repository<VaultData>>(getRepositoryToken(VaultData));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // ... MANTENHA SEUS TESTES ABAIXO IGUAIS ...
    
    it('deve retornar todos os usuários', async () => {
       // ... (seu código anterior)
    });

    it('deve criar um novo usuário', async () => {
        const dto = {
            nome: 'Novo',
            email: 'novo@teste.com',
            senha: '123456',
            tipo: 'user',
        };
        const senhaHasheada = await bcrypt.hash(dto.senha, 10);
        
        const usuarioCriado = {
            id: 1,
            ...dto,
            senha: senhaHasheada,
            criadoEm: new Date(),
        };

        // Configura os mocks
        mockRepository.create.mockReturnValue(usuarioCriado);
        mockRepository.save.mockResolvedValue(usuarioCriado);
        
        // 4. CONFIGURAR O RETORNO DO VAULT (IMPORTANTE)
        mockVaultRepository.create.mockReturnValue({ id: 1, ...usuarioCriado }); 
        mockVaultRepository.save.mockResolvedValue({ id: 1 });

        const result = await service.createUsuarios(dto as any);
        
        expect(result.email).toBe(dto.email);
        expect(mockRepository.create).toHaveBeenCalled();
    });

    it('deve atualizar um usuário existente', async () => {
       // ... (seu código anterior)
    });
});