import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { JwtPayloadT } from 'src/api/auth/types/types';

export const GetUser = createParamDecorator((data: keyof JwtPayloadT | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  if (data) return request.user[data];

  return request.user;
});
