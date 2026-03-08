import { Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from "./entities/users.entity"
import { AuthDto } from "src/auth/dto/auth.dto"
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService{
    constructor(@InjectRepository(User) private usersRepository: Repository<User>) {}
    async findOne(user: string): Promise<User | null> {
        return await this.usersRepository.createQueryBuilder('user')
            .addSelect('user.password')
            .where('user.user = :user', { user })
            .getOne();
    }
    async create(signUpDto: AuthDto){
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(signUpDto.password, salt)

        const newUser = this.usersRepository.create({
            ...signUpDto,
            password: hashedPassword
        })
        return await this.usersRepository.save(newUser)
    }
    async findOneById(id: number): Promise<User | null> {
        return await this.usersRepository.findOne({
            where: { _id_user: id }
        });
    }
}