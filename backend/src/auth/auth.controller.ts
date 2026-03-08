import { AuthService } from './auth.service'
import { Controller, Request, Post, UseGuards, Body, Delete, Put, ConflictException, HttpException, HttpStatus } from '@nestjs/common'
import { RefreshJwtGuard } from './guards/refreshToken-jwt.guard'
import { AuthDto } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}
    @UseGuards(RefreshJwtGuard)
    @Post('refreshToken')
    refreshToken(@Request() req){
        const accessToken = this.authService.generateAccessToken(req.user)
        return {
            accessToken: accessToken
        }
    }

    @Post('login')
    async LogIn(@Body() loginDto: AuthDto){
        return await this.authService.LogIn(loginDto)
    }

    @UseGuards(RefreshJwtGuard)
    @Delete('signout')
    async signOut(@Request() req){
        const refreshToken = req.get('Authorization').replace('Bearer ', '')
        await this.authService.signOut(refreshToken)
        return {
            message: "Session cerrada exitosamente"
        }
    }

    @Post('signup')
    async signUp(@Body() signUpDto: AuthDto){
        try{
            return await this.authService.signUp(signUpDto)
        }catch(error){
            if(error instanceof ConflictException){
                throw new HttpException('El usuario ya esta registrado', HttpStatus.METHOD_NOT_ALLOWED)
            }
        }
        throw Error
    }
}

