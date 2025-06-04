import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const validRoles: string[] = this.reflector.get<string[]>(META_ROLES, context.getHandler());
    const user = context.switchToHttp().getRequest().user;

    if (!user) {
      throw new BadRequestException('User not found (request)');
    }

    // Si no hay roles específicos requeridos, permitir acceso
    if (!validRoles || validRoles.length === 0) {
      return true;
    }

    // En Prisma tenemos un solo role, no un array como en TypeORM
    if (validRoles.includes(user.role)) {
      return true;
    }

    throw new ForbiddenException(
      `User ${user.email} need one of these roles: [${validRoles}]`
    );
  }
} 