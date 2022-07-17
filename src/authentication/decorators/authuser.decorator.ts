import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator((data, req: ExecutionContext) => {
  return req.switchToHttp().getRequest().user;
});
