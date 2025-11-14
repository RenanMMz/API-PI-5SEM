import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/db/database.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/usuarios.entity';

@Module({
  imports: [JwtModule.register({
    secret: process.env.JWT_SECRET || 'EcksDee', // use env em produção
    signOptions: { expiresIn: '1h' },
  }),TypeOrmModule.forFeature([Usuario]), PassportModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
