import { Controller, Get, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { GetUserId } from "src/decorators/get-user-id.decorators";

@Controller('users')
export class UserController{
    constructor(private readonly usersService: UsersService){}
    @Get()
    @UseGuards(JwtAuthGuard)
    async getUserInfo(@GetUserId() _id_user: number){ // <--- Recibe el ID
        return await this.usersService.findOneById(_id_user) // <--- Busca por ID
    }
}