import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('tokens')
export class Token{
    @PrimaryGeneratedColumn()
    id_token: number

    @Column()
    id_user_tokens_fk: number

    @Column()
    token: string
}