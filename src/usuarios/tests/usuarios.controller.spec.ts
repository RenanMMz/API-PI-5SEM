import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from '../usuarios.controller';
import { UsuariosService } from '../usuarios.service';
import { CreateUserDTO } from '../dto/usuarios.dto';
import { Usuario } from '../usuarios.entity';
import { UpdateUserDTO } from '../dto/updateUsuarios.dto';

describe('UsuariosController', () => {
    let controller: UsuariosController;
    let service: UsuariosService;

    const mockCreatedUserResponse = {
        message: 'Usuário e Vault criados com sucesso. Login automático realizado.',
        access_token: 'mocked_jwt_token_12345',
        usuario: {
            id: 2,
            email: 'novo@exemplo.com',
        },
        vaultData: {
            encryptedBlob: 'mockBlob',
            vaultIV: 'mockIV',
            vaultTag: 'mockTag',
        }
    };

    const mockUsuariosService = {
        createUsuarios: jest.fn().mockResolvedValue(mockCreatedUserResponse),
        updateUser: jest.fn().mockResolvedValue({ message: 'teste de update de senha e vault mockado com sucesso' }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsuariosController],
            providers: [
                {
                    provide: UsuariosService,
                    useValue: mockUsuariosService,
                },
            ],
        }).compile();

        controller = module.get<UsuariosController>(UsuariosController);
        service = module.get<UsuariosService>(UsuariosService);
    });

    it('deve criar um novo usuário e retornar token + vaultData', async () => {
        const dto: CreateUserDTO = {
            email: 'novo@exemplo.com',
            senha: '123456',
            kdfSalt: 'mockSalt',
            encryptedBlob: 'mockBlob',
            vaultIV: 'mockIV',
            vaultTag: 'mockTag',
        };

        const result = await controller.createUsuarios(dto);

        expect(service.createUsuarios).toHaveBeenCalledWith(dto);
        expect(result).toEqual(mockCreatedUserResponse);
        expect(result).toHaveProperty('access_token');
        expect(result.access_token).toBe('mocked_jwt_token_12345');
    });

    it('deve atualizar a senha e o vault do usuário (updateUsuarios)', async () => {
        const updateData: UpdateUserDTO = {
            novaSenha: 'novaSenha123',
            novoKdfSalt: 'novoSalt',
            novoEncryptedBlob: 'novoBlob',
            novoVaultIV: 'novoIV',
            novoVaultTag: 'novaTag',
        };

        const mockRequest = {
            user: {
                id: 1, // ID injetado pelo JwtAuthGuard
            }
        } as unknown as Request;

        const result = await controller.updateUsuarios(mockRequest, updateData);

        expect(service.updateUser).toHaveBeenCalledWith(1, updateData);
        expect(result).toEqual({ message: 'Senha e Vault atualizados com sucesso' });
    });
});