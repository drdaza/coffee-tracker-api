import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from 'generated/prisma';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto';
import { AuthResponse, RefreshTokenPayload } from './interfaces';
import { envs } from 'src/config';

@Injectable()
export class AuthService extends PrismaClient {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
      ) {
        super();
      }

    async login(loginUserDto: LoginUserDto, deviceId?: string): Promise<AuthResponse> {
        const { email, password } = loginUserDto;
    
        const user = await this.usersService.findOneByEmail(email);
    
        if (!user) {
          throw new UnauthorizedException('Credentials are not valid (email)');
        }
    
        if (!bcrypt.compareSync(password, user.password)) {
          throw new UnauthorizedException('Credentials are not valid (password)');
        }
        
        const tokens = await this.generateTokens(user, deviceId);
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          token: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresIn: 15 * 60, // 15 minutos en segundos
        };
      }

      private async generateTokens(user: any, deviceId?: string) {
        const payload = { id: user.id, email: user.email };
        
        // Access token - corta duración
        const accessToken = this.jwtService.sign(payload, {
          expiresIn: envs.JWT_ACCESS_EXPIRATION,
          secret: envs.JWT_SECRET
        });
        
        // Refresh token - larga duración
        const refreshPayload: RefreshTokenPayload = { 
          userId: user.id, 
          deviceId,
          type: 'refresh' 
        };
        
        const refreshToken = this.jwtService.sign(refreshPayload, {
          expiresIn: envs.JWT_REFRESH_EXPIRATION,
          secret: envs.JWT_REFRESH_SECRET
        });

        // Guardar en BD
        await this.createRefreshToken({
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
          deviceId
        });
        
        return { accessToken, refreshToken };
      }

      async refreshTokens(refreshToken: string) {
        try {
          // Validar refresh token
          const payload = this.jwtService.verify(refreshToken, {
            secret: envs.JWT_REFRESH_SECRET
          }) as RefreshTokenPayload;
          
          // Verificar que existe en BD y no está expirado
          const storedToken = await this.findRefreshToken(refreshToken);
          
          if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new UnauthorizedException('Invalid refresh token');
          }
          
          // Eliminar el refresh token usado
          await this.deleteRefreshToken(refreshToken);
          
          // Generar nuevos tokens
          const user = storedToken.user;
          const newTokens = await this.generateTokens(user, storedToken.deviceId || undefined);
          
          return {
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
            expiresIn: 15 * 60 // 15 minutos en segundos
          };
        } catch (error) {
          throw new UnauthorizedException('Invalid refresh token');
        }
      }

      async refreshAccessToken(refreshToken: string) {
        try {
          // Validar refresh token
          const payload = this.jwtService.verify(refreshToken, {
            secret: envs.JWT_REFRESH_SECRET
          }) as RefreshTokenPayload;
          
          // Verificar que existe en BD y no está expirado
          const storedToken = await this.findRefreshToken(refreshToken);
          
          if (!storedToken || storedToken.expiresAt < new Date()) {
            throw new UnauthorizedException('Invalid refresh token');
          }
          
          // Generar nuevo access token
          const user = storedToken.user;
          const newAccessToken = this.jwtService.sign(
            { id: user.id, email: user.email },
            { 
              expiresIn: envs.JWT_ACCESS_EXPIRATION,
              secret: envs.JWT_SECRET 
            }
          );
          
          return {
            accessToken: newAccessToken,
            expiresIn: 15 * 60 // 15 minutos en segundos
          };
        } catch (error) {
          throw new UnauthorizedException('Invalid refresh token');
        }
      }

      async logout(userId: string, refreshToken?: string) {
        if (refreshToken) {
          // Logout específico (un dispositivo)
          await this.deleteRefreshToken(refreshToken);
        } else {
          // Logout global (todos los dispositivos)
          await this.deleteAllRefreshTokens(userId);
        }
      }

      @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
      async cleanExpiredTokens() {
        await this.cleanExpiredRefreshTokens();
      }

      // Métodos para Refresh Tokens - ahora en AuthService donde pertenecen
      private async createRefreshToken(data: {
        token: string;
        userId: string;
        expiresAt: Date;
        deviceId?: string;
      }) {
        return this.refreshToken.create({
          data: {
            token: data.token,
            userId: data.userId,
            expiresAt: data.expiresAt,
            deviceId: data.deviceId,
          },
        });
      }

      private async findRefreshToken(token: string) {
        return this.refreshToken.findUnique({
          where: { token },
          include: { user: true },
        });
      }

      private async deleteRefreshToken(token: string) {
        return this.refreshToken.delete({
          where: { token },
        });
      }

      private async deleteAllRefreshTokens(userId: string) {
        return this.refreshToken.deleteMany({
          where: { userId },
        });
      }

      private async cleanExpiredRefreshTokens() {
        const now = new Date();
        return this.refreshToken.deleteMany({
          where: {
            expiresAt: {
              lt: now, // less than now = expired
            },
          },
        });
      }
    
      async checkToken(token: string) {
        try {
          const tokenVerified = this.jwtService.verify(token);
          const userId = tokenVerified.id;
          const user = await this.usersService.findOneById(userId);
          if (!user) {
            throw new UnauthorizedException('User not found');
          }
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            token: this.getJwtToken({ id: user.id }),
          };
        } catch (error) {
          throw new UnauthorizedException('Token not valid');
        }
      }
    
      public getJwtToken(payload: { id: string }): string {
        const token = this.jwtService.sign(payload);
        return token;
      }
}
