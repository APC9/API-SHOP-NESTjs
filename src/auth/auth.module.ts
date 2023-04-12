import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity'; 
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports:[
    ConfigModule,

    TypeOrmModule.forFeature([User]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    //Modulo asincrono
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
          signOptions: { expiresIn: '2h' },
      }),
    })
    
    //Modulo sincrono
    //JwtModule.register({
    //  secret: process.env.JWT_SECRET,
    //  signOptions: { expiresIn: '2h' },
    //})
  ],
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}


// instalaciones para JWT
// yarn add @nestjs/passport passport
// yarn add @nestjs/jwt passport-jwt
// yarn add -D @types/passport-jwt

// ver achivo strategies jwt.strategies.ts para implementar las estrategias personalizadas