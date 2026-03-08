import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from '@nestjs/jwt'
import { UsersService } from "src/users/users.service"
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { Token } from './entities/tokens.entities'
import { AuthDto } from "./dto/auth.dto"
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService{
    constructor(
        private readonly jwtService: JwtService, 
        private usersService: UsersService,
        @InjectRepository(Token) private readonly tokenRepository: Repository<Token>
    ){}

    generateAccessToken(user: any) {
    const payload = { id: user.id, user: user.user };
        return this.jwtService.sign(payload, { 
            secret: process.env.ACCESS_TOKEN_KEY,
            expiresIn: '15m' 
        });
    }

    generateRefreshToken(user: any) {
        const payload = { id: user.id, user: user.user };
        return this.jwtService.sign(payload, { 
            secret: process.env.REFRESH_TOKEN_KEY,
            expiresIn: '7d' 
        });
    }
    async LogIn(loginDto: AuthDto){
        const user = await this.usersService.findOne(loginDto.user)

        if(!user){
            throw new UnauthorizedException('User or password wrong')
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password)
        
        if (!isPasswordValid) {
            throw new UnauthorizedException('User or password wrong');
        }
        
        const payload = { sub: user._id_user, username: user.user }
        
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.REFRESH_TOKEN_KEY,
            expiresIn: '7d'
        })

        await this.tokenRepository.save({
            id_user_tokens_fk: user._id_user,
            token: refreshToken
        })
        
        return {
            body: {
                accessToken: this.jwtService.sign(payload, { 
                    secret: process.env.ACCESS_TOKEN_KEY
                }),
                refreshToken: this.jwtService.sign(payload, { 
                    secret: process.env.REFRESH_TOKEN_KEY, 
                    expiresIn: '7d' 
                }),
                user: { _id_user: user._id_user, user: user.user }
            }
        }
    }

    async signOut(refreshToken: string) {
        try {
            const result = await this.tokenRepository.delete({ token: refreshToken });
            
            if (result.affected === 0) {
                console.warn("No token to delete was found in the database")
            } else {
                console.log("Token deleted succesfully from the database")
            }
            return result;
        } catch (error) {
            console.error("Error deleting token:", error)
            throw error
        }
    }

    async signUp(signUpDto: AuthDto){
        const userExists = await this.usersService.findOne(signUpDto.user)
        if(userExists) throw new ConflictException('User is already registered')
        return await this.usersService.create(signUpDto)
    }
}