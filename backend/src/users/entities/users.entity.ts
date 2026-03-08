import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User{
    @PrimaryGeneratedColumn()
    _id_user: number

    @Column({unique: true})
    user: string

    @Column({select: false})
    password: string
}