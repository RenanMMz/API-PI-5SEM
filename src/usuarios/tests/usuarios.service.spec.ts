// usuarios/usuarios.service.spec.ts (Revisado)

import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from '../usuarios.service';
import { Usuario } from '../usuarios.entity';
import { VaultData } from '../../vaultData/vaultData.entity';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service'; // Importar AuthService
import { CreateUserDTO } from '../dto/usuarios.dto';
import { UpdateUserDTO } from '../dto/updateUsuarios.dto';
import { NotFoundException } from '@nestjs/common';

// Mocka o módulo bcrypt inteiramente
jest.mock('bcrypt', () => ({
    // Mantém todas as outras funções originais (se houver) ou apenas as que não são usadas
    // e mocka a função 'hash' de forma que o TypeScript a reconheça como uma função mockada.
    hash: jest.fn(),
    // Você pode adicionar outras funções necessárias, como 'compare':
    compare: jest.fn(),
}));

// --- MOCKS DE DEPENDÊNCIAS ---

// Mock do AuthService (apenas para generateAccessToken)
const mockAuthService = {
    generateAccessToken: jest.fn().mockResolvedValue('mocked_jwt_token_12345'),
};

// Mock do Query Runner (simulando a transação)
const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    release: jest.fn(),
    rollbackTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    manager: {
        // Simula os métodos de persistência dentro da transação
        save: jest.fn().mockImplementation((entity) => entity),
        create: jest.fn().mockImplementation((entity) => entity),
        findOne: jest.fn(), // Usado para buscar Usuario e VaultData
    }
};

// Mock do DataSource para retornar o Query Runner
const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
};

// Mock do Repositório de Usuários (para getUsuarioByEmail, etc.)
const mockUsuariosRepository = {
    findOne: jest.fn(),
};

describe('UsuariosService', () => {
    let service: UsuariosService;
    let authService: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsuariosService,
                // Provider do Usuario (Usado fora de transações)
                {
                    provide: getRepositoryToken(Usuario),
                    useValue: mockUsuariosRepository,
                },
                // Provider do AuthService (Novo)
                {
                    provide: AuthService,
                    useValue: mockAuthService,
                },
                // Provider do DataSource (para transações)
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
                // O TypeOrmModule.forFeature([VaultData]) é injetado no service,
                // mas não é usado diretamente no service.ts (pois usamos queryRunner.manager),
                // então não precisa ser mockado aqui, mas o mockAuthService precisa.
            ],
        }).compile();

        service = module.get<UsuariosService>(UsuariosService);
        authService = module.get<AuthService>(AuthService);

        // Limpar mocks antes de cada teste
        jest.clearAllMocks();
    });

    // --- TESTE DE CRIAÇÃO (COM TRANSAÇÃO E LOGIN) ---

    it('deve criar um novo usuário e vault em transação e retornar token', async () => {
        const createUserDTO: CreateUserDTO = {
            email: 'novo@teste.com',
            senha: 'senha123',
            kdfSalt: 'mockSalt',
            encryptedBlob: 'mockBlob',
            vaultIV: 'mockIV',
            vaultTag: 'mockTag',
        };

        // Simula que o usuário NÃO existe
        mockUsuariosRepository.findOne.mockResolvedValue(null);

        const createdUserMock = { id: 1, email: createUserDTO.email, senha: 'hashedPassword', kdfSalt: createUserDTO.kdfSalt };
        const createdVaultMock = { encryptedBlob: createUserDTO.encryptedBlob, vaultIV: createUserDTO.vaultIV, vaultTag: createUserDTO.vaultTag };

        // Mock the queryRunner.manager.create and save calls to return the entities
        mockQueryRunner.manager.create.mockImplementation((type, data) => {
            if (type === Usuario) return createdUserMock;
            if (type === VaultData) return createdVaultMock;
            return data;
        });
        mockQueryRunner.manager.save.mockResolvedValue(true); // Sucesso ao salvar

        const result = await service.createUsuarios(createUserDTO);

        // Verifica se a transação foi commitada
        expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
        expect(mockQueryRunner.rollbackTransaction).not.toHaveBeenCalled();

        // Verifica se o token foi gerado
        expect(authService.generateAccessToken).toHaveBeenCalledWith(createdUserMock.id);

        // Verifica o retorno
        expect(result).toHaveProperty('access_token', 'mocked_jwt_token_12345');
        expect(result.usuario.email).toBe(createUserDTO.email);
        expect(result.vaultData.encryptedBlob).toBe(createUserDTO.encryptedBlob);
    });

    it('deve realizar rollback se a criação do vault falhar', async () => {
        const createUserDTO: CreateUserDTO = {
            email: 'novo@teste.com',
            senha: 'senha123',
            kdfSalt: 'mockSalt',
            encryptedBlob: 'mockBlob',
            vaultIV: 'mockIV',
            vaultTag: 'mockTag',
        };

        mockUsuariosRepository.findOne.mockResolvedValue(null);

        // Simula que a SEGUNDA chamada ao save (VaultData) falha
        mockQueryRunner.manager.save.mockImplementationOnce(async () => true); // Sucesso no Usuario
        mockQueryRunner.manager.save.mockImplementationOnce(async () => {
            throw new Error('Erro simulado no banco de dados');
        });

        await expect(service.createUsuarios(createUserDTO)).rejects.toThrow();

        // Verifica se o rollback foi chamado e o commit não
        expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
        expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    // --- TESTE DE ATUALIZAÇÃO (COM TRANSAÇÃO) ---

    it('deve atualizar usuario e vaultData em transação com sucesso', async () => {
        const userId = 5;
        const updateData: UpdateUserDTO = {
            novaSenha: 'senhaSuperNova',
            novoKdfSalt: 'novoSalt',
            novoEncryptedBlob: 'novoBlob',
            novoVaultIV: 'novoIV',
            novoVaultTag: 'novaTag',
        };

        // Mock: Simula o usuário e vaultData encontrados
        const existingUsuario = { id: userId, email: 'teste@teste.com', senha: 'oldHash', kdfSalt: 'oldSalt' };
        const existingVaultData = { id: 10, encryptedBlob: 'oldBlob', vaultIV: 'oldIV', vaultTag: 'oldTag' };

        // Configura o mock da função 'hash' antes de chamá-la no serviço
        (bcrypt.hash as jest.Mock).mockResolvedValue('novoHashDaSenha');
        
        // Mock do findOne (queryRunner.manager.findOne)
        mockQueryRunner.manager.findOne
            .mockResolvedValueOnce(existingUsuario) // 1. Busca Usuario
            .mockResolvedValueOnce(existingVaultData); // 2. Busca VaultData

        await service.updateUser(userId, updateData);

        // Verifica se o hash foi chamado
        expect(bcrypt.hash).toHaveBeenCalledWith(updateData.novaSenha, 10);

        // Verifica se o save foi chamado para o usuário com os novos dados
        expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
            expect.objectContaining({
                id: userId,
                senha: 'novoHashDaSenha',
                kdfSalt: updateData.novoKdfSalt,
            })
        );

        // Verifica se o save foi chamado para o vaultData com os novos dados
        expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 10,
                encryptedBlob: updateData.novoEncryptedBlob,
                vaultIV: updateData.novoVaultIV,
                vaultTag: updateData.novoVaultTag,
            })
        );

        // Verifica se a transação foi commitada
        expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
        expect(mockQueryRunner.rollbackTransaction).not.toHaveBeenCalled();
    });

    it('deve realizar rollback se a atualização do vault falhar', async () => {
        const userId = 5;
        const updateData: UpdateUserDTO = {
            novaSenha: 'senhaSuperNova',
            novoKdfSalt: 'novoSalt',
            novoEncryptedBlob: 'novoBlob',
            novoVaultIV: 'novoIV',
            novoVaultTag: 'novaTag',
        };

        const existingUsuario = { id: userId, email: 'teste@teste.com', senha: 'oldHash', kdfSalt: 'oldSalt' };

        // 1. Busca Usuario (Sucesso)
        mockQueryRunner.manager.findOne.mockResolvedValueOnce(existingUsuario);
        // 2. Mock do save do Usuario (Simula sucesso)
        mockQueryRunner.manager.save.mockResolvedValueOnce(true);
        // 3. Busca VaultData (Sucesso)
        mockQueryRunner.manager.findOne.mockResolvedValueOnce({ id: 10 });

        // 4. Mock do save do VaultData (Simula falha)
        mockQueryRunner.manager.save.mockImplementationOnce(async () => {
            throw new Error('Erro ao salvar vaultData');
        });

        await expect(service.updateUser(userId, updateData)).rejects.toThrow();

        // Verifica se o rollback foi chamado e o commit não
        expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
        expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });

    it('deve lançar NotFoundException se o usuário não for encontrado', async () => {
        const userId = 99;
        const updateData: UpdateUserDTO = {} as any;

        // Mock: Simula usuário não encontrado
        mockQueryRunner.manager.findOne.mockResolvedValue(null);

        await expect(service.updateUser(userId, updateData)).rejects.toThrow(NotFoundException);

        // Verifica se o rollback foi chamado (para limpar recursos)
        expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
        expect(mockQueryRunner.commitTransaction).not.toHaveBeenCalled();
    });
});