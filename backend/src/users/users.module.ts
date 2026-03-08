import { Module } from '@nestjs/common'
import { UserController } from './users.controller'
import { UsersService } from './users.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/users.entity'

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    controllers: [UserController],
    providers: [UsersService],
    exports: [UsersService]
})

export class UsersModule {}
