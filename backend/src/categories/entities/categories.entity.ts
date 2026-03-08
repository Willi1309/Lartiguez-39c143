import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('categories')
export class Category{
    @PrimaryGeneratedColumn()
    id_category: number

    @Column()
    id_user_category_fk: number

    @Column()
    category: string
}