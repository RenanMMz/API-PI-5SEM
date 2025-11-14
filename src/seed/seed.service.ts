import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreateSeedDto } from './dto/create-seed.dto';
import { UpdateSeedDto } from './dto/update-seed.dto';

import { TGFDOCA } from 'src/tgfdoca/tgfdoca.entity';
import { TGFCAB } from 'src/tgfcab/tgfcab.entity';
import { TGFITE } from 'src/tgfite/tgfite.entity';
import { TGFEST } from 'src/tgfest/tgfest.entity';
import { TGFREC } from 'src/tgfrec/tgfrec.entity';
import { Usuario } from 'src/usuarios/usuarios.entity';
import { Codigo } from 'src/codigos/codigos.entity';

import * as bcrypt from 'bcrypt';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SeedService {

  private readonly logger = new Logger(SeedService.name);

  private tgfrecRepository: Repository<TGFREC>;
  private tgfdocaRepository: Repository<TGFDOCA>;
  private tgfcabRepository: Repository<TGFCAB>;
  private tgfiteRepository: Repository<TGFITE>;
  private tgfestRepository: Repository<TGFEST>;
  private usuarioRepository: Repository<Usuario>;
  private codigoRepository: Repository<Codigo>;

  constructor(@Inject('DATA_SOURCE') private dataSource: DataSource) {
    this.tgfrecRepository = this.dataSource.getRepository(TGFREC);
    this.tgfdocaRepository = this.dataSource.getRepository(TGFDOCA);
    this.tgfcabRepository = this.dataSource.getRepository(TGFCAB);
    this.tgfiteRepository = this.dataSource.getRepository(TGFITE);
    this.tgfestRepository = this.dataSource.getRepository(TGFEST);
    this.usuarioRepository = this.dataSource.getRepository(Usuario);
    this.codigoRepository = this.dataSource.getRepository(Codigo);
  }

  async seedAll() {
    this.logger.log('Iniciando o Seed de dados de desenvolvimento...');

    await this.clearData();
    await this.seedUsuarios();
    await this.seedProdutos();
    await this.seedPedido();
    await this.seedDocas();

    this.logger.log('Seed de dados concluído com sucesso!');
  }
  // --- 0. Limpar tabelas ---
  async clearData() {
    this.logger.log('Limpando tabelas...');
    // A ordem importa devido a FKs
    await this.tgfrecRepository.delete({});
    await this.tgfdocaRepository.delete({});
    await this.codigoRepository.delete({});
    await this.tgfiteRepository.delete({});
    await this.tgfcabRepository.delete({});
    await this.tgfestRepository.delete({});
    await this.usuarioRepository.delete({});
  }

  // --- 1. Usuários de Teste ---
  async seedUsuarios() {
    this.logger.log('Criando Usuário de Teste...');
    const salt = await bcrypt.genSalt();
    const senhaHashed = await bcrypt.hash('123456', salt); // Senha fácil para teste

    const usuario = this.usuarioRepository.create({
      nome: 'coletor1',
      senha: senhaHashed,
      email: 'coletor1@teste.com',
      tipo: 'operador',
    });

    await this.usuarioRepository.save(usuario);
    this.logger.log(`Usuário 'coletor1' criado (ID: ${usuario.id})`);
  }

  // --- 2. Produtos de Teste (TGFEST) ---
  async seedProdutos() {
    this.logger.log('Criando Produtos de Teste...');
    const produtos = [
      {
        codigoBarra: '7891000100010',
        codProd: 101,
        descrProd: 'COCA COLA 2L',
        codEmp: 1,
        codLocal: 1,
        codParc: 0,
        estoqueMinimo: 5,
        estoqueMaximo: 50,
        estoqueAtual: 20,
        dtVal: new Date('2026-12-31'),
      },
      {
        codigoBarra: '7891000100027',
        codProd: 102,
        descrProd: 'SUCO DE LARANJA 1L',
        codEmp: 1,
        codLocal: 1,
        codParc: 0,
        estoqueMinimo: 10,
        estoqueMaximo: 100,
        estoqueAtual: 45,
        dtVal: new Date('2025-06-30'),
      }
    ];

    await this.tgfestRepository.save(produtos);
    this.logger.log(`2 Produtos criados.`);
  }

  // --- 3. Pedido de Coleta (TGFCAB e TGFITE) ---
  async seedPedido() {
    this.logger.log('Criando Pedido de Coleta (TGFCAB e TGFITE)...');

    // 3.1. Cabeçalho (TGFCAB)
    const nunota = 100001;
    const cabecalho = this.tgfcabRepository.create({
      nunota: nunota,
      codEmp: 1,
      statusNota: 'pendente', // Status que a coletora deve trabalhar
      nunNota: 'NF-001',
      codParc: 500,
    });
    await this.tgfcabRepository.save(cabecalho);
    this.logger.log(`Cabeçalho criado (NUNOTA: ${nunota})`);

    // 3.2. Itens (TGFITE)
    const itens = [
      {
        nunota: nunota,
        sequencia: 1,
        codEmp: 1,
        codProd: 101, // COCA COLA (código de barras 7891000100010)
        qtdProd: 5,   // 5 registros
      },
      {
        nunota: nunota,
        sequencia: 2,
        codEmp: 1,
        codProd: 102, // SUCO DE LARANJA (código de barras 7891000100027)
        qtdProd: 10,  // 10 registros
      }
    ];

    await this.tgfiteRepository.save(itens as any); // O 'as any' pode ser necessário devido à relação com TGFCAB
    this.logger.log(`2 Itens criados para o NUNOTA ${nunota}.`);
  }

  async seedDocas() {
    const count = await this.tgfdocaRepository.count();
    if (count === 0) {
      const doca = this.tgfdocaRepository.create({
        codDoca: 10,
        descrDoca: 'DOCA PRINCIPAL - RECEBIMENTO',
      });
      await this.tgfdocaRepository.save(doca);
      this.logger.log('Doca de teste inserida.');
    }
  }


  create(createSeedDto: CreateSeedDto) {
    return 'This action adds a new seed';
  }

  findAll() {
    return `This action returns all seed`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seed`;
  }

  update(id: number, updateSeedDto: UpdateSeedDto) {
    return `This action updates a #${id} seed`;
  }

  remove(id: number) {
    return `This action removes a #${id} seed`;
  }
}
