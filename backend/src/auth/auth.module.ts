import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtModule } from '@nestjs/jwt'
import { RefreshJwtStrategy } from './strategies/refreshToken-jwt.strategy'
import { JwtStrategy } from './strategies/jwt.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from 'src/users/entities/users.entity'
import { Token } from './entities/tokens.entities'

@Module({
  imports: [
    TypeOrmModule.forFeature([Token, User]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN_KEY'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService, RefreshJwtStrategy, JwtStrategy]
})

export class AuthModule {}
