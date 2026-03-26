import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private configService: ConfigService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    // Allow admin secret header to bypass JWT
    const request = context.switchToHttp().getRequest();
    const adminSecret = this.configService.get<string>('ADMIN_SECRET');
    const headerSecret = request.headers['x-admin-secret'];
    if (adminSecret && headerSecret === adminSecret) return true;

    return super.canActivate(context);
  }
}
