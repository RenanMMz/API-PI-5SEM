import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// Esta classe será usada pelo JwtAuthGuard
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Onde procurar o token: No Header 'Authorization' como 'Bearer'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // 2. Não ignora se o token expirou
      ignoreExpiration: false,
      
      // 3. O SEGREDO: Deve ser o MESMO do seu auth.module.ts
      secretOrKey: process.env.JWT_SECRET || 'EcksDee',
    });
  }

  /**
   * Esta função é chamada DEPOIS que o token é validado com sucesso.
   * O 'payload' é o que você colocou no `jwtService.sign(payload)` lá no AuthService.
   */
  async validate(payload: { sub: number; tipo: string }) {
    
    // O que for retornado aqui será injetado no 'req.user'
    // pelo JwtAuthGuard em qualquer rota protegida.
    return { id: payload.sub, tipo: payload.tipo };
  }
}