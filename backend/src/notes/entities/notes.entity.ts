import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('notes')
export class Note{
    @PrimaryGeneratedColumn()
    id_note: number

    @Column()
    id_user_note_fk: number

    @Column()
    title: string

    @Column()
    body: string

    @Column()
    category: string

    @Column({ default: false })
    archived: boolean;
}