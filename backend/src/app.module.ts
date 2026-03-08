import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { NotesModule } from './notes/notes.module'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { Token } from './auth/entities/tokens.entities'
import { User } from './users/entities/users.entity'
import { CategoriesModule } from './categories/categories.module'
import { Category } from './categories/entities/categories.entity'
import { Note } from './notes/entities/notes.entity'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [Note, Category, Token, User],
            synchronize: process.env.SINCRONIZE !== 'production' ? true : false,
            ssl: {
                rejectUnauthorized: false,
            },
            extra: {
                ssl: {
                    rejectUnauthorized: false,
                },
            }
        }),
        NotesModule,
        AuthModule,
        UsersModule,
        CategoriesModule,
    ],
})

export class AppModule {}