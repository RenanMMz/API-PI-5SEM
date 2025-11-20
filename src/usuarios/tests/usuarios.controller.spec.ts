import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from '../usuarios.controller';
import { UsuariosService } from '../usuarios.service';
import { CreateUserDTO } from '../dto/usuarios.dto';
import { Usuario } from '../usuarios.entity';

describe('UsuariosController', () => {
    let controller: UsuariosController;
    let service: UsuariosService;

    const mockUsuariosService = {
        getUsuarios: jest.fn(),
        createUsuarios: jest.fn(),
        updateUsuarios: jest.fn(),
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

    it('deve retornar todos os usuários', async () => {
        const usuarios: Usuario[] = [
            {
                id: 1,
                nome: 'Teste',
                email: 'teste@exemplo.com',
                senha: 'senhaHash',
                criadoEm: new Date(),
                tipo: 'admin',
                reservas: [],
                cartoes: [],

            } as any,
        ];
        mockUsuariosService.getUsuarios.mockResolvedValue(usuarios);
        const result = await controller.getUsuarios();
        expect(result).toEqual(usuarios);
    });

    it('deve criar um novo usuário', async () => {
        const dto: CreateUserDTO = {
            nome: 'Novo Usuário',
            email: 'novo@exemplo.com',
            senha: '123456',
            tipo: 'user',
        } as any; //verificar necessidade do "as any"

        const usuarioCriado: Usuario = {
            id: 2,
            ...dto,
            senha: 'senhaHasheada',
            criadoEm: new Date(),
            reservas: [],
            cartoes: [],
        }as any; //verificar necessidade do "as any"

        mockUsuariosService.createUsuarios.mockResolvedValue(usuarioCriado);
        const result = await controller.createUsuarios(dto);
        expect(result).toEqual(usuarioCriado);
    });

    it('deve atualizar um usuário existente', async () => {
        const updateData = { nome: 'Nome Atualizado' };
        const usuarioAtualizado: Usuario = {
            id: 1,
            nome: 'Nome Atualizado',
            email: 'teste@exemplo.com',
            senha: 'senhaHash',
            criadoEm: new Date(),
            tipo: 'admin',
            reservas: [],
            cartoes: [],

        } as any; //verificar necessidade do "as any"

        mockUsuariosService.updateUsuarios.mockResolvedValue(usuarioAtualizado);
        const result = await controller.updateUsuarios(1, updateData);
        expect(result).toEqual(usuarioAtualizado);
    });
});