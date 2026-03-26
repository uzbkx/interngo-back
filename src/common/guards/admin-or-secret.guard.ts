import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminOrSecretGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Check admin secret header first (for cron/internal calls)
    const adminSecret = this.configService.get<string>('ADMIN_SECRET');
    const headerSecret = request.headers['x-admin-secret'];
    if (adminSecret && headerSecret === adminSecret) return true;

    // Check authenticated user role
    const user = request.user;
    if (user?.role === 'ADMIN') return true;

    return false;
  }
}
