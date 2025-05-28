import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user-dto.interface';
import { AuthResponse } from './interfaces/auth-response';
@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
      ) {}

    async login(loginUserDto: LoginUserDto): Promise<AuthResponse> {
        const { email, password } = loginUserDto;
    
        const user = await this.usersService.findOneByEmail(email);
    
        if (!user) {
          throw new UnauthorizedException('Credentials are not valid (email)');
        }
    
        if (!bcrypt.compareSync(password, user.password)) {
          throw new UnauthorizedException('Credentials are not valid (password)');
        }
        
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          token: this.getJwtToken({ id: user.id }),
        };
      }
    
      checkAuthStatus(user: User): AuthResponse {
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          token: this.getJwtToken({ id: user.id }),
        };
      }
    
      private getJwtToken(payload: { id: string }): string {
        const token = this.jwtService.sign(payload);
        return token;
      }
}
