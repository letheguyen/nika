import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';

import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'module/user/user.module';
import { AuthController } from 'module/auth/auth.controller';
import { AuthService } from 'module/auth/services/auth.service';
import { JwtStrategy } from '@/modules/auth/services/jwt.strategy';

@Module({
  imports: [
    HttpModule,
    UserModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: Number(process.env.JWT_EXPIRE_SECONDS),
        },
      }),
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [],
})
export class AuthModule {}
