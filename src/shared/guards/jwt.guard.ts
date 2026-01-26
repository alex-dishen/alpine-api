import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { AppConfigService } from '../services/config-service/config.service';
import { CanActivate, ExecutionContext, Injectable, SetMetadata, UnauthorizedException } from '@nestjs/common';

export const IgnoreAuthGuard = (): ReturnType<typeof SetMetadata> => SetMetadata('isAuthGuardIgnored', true);

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private config: AppConfigService,
    private jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isIgnoreTenantGuard = this.reflector.get<boolean>('isAuthGuardIgnored', context.getHandler());

    if (isIgnoreTenantGuard) return true;

    const request = context.switchToHttp().getRequest();
    const accessToken = request.signedCookies?.accessToken as string | undefined;

    if (!accessToken) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.config.get('ACCESS_TOKEN_SECRET'),
      });

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
