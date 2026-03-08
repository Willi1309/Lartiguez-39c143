import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/notes.entity';

@Injectable()
export class NotesService {
    constructor(@InjectRepository(Note) private notesRepository: Repository<Note>){}
    
    async create(_id_user: number, title: string, body: string, category: string){
        const newNote = this.notesRepository.create({
            id_user_note_fk: _id_user,
            title: title,
            body: body,
            category: category
        })
        return await this.notesRepository.save(newNote)
    }
    
    async getNotes(_id_user:number){
        return await this.notesRepository.find({
            where: {
                id_user_note_fk: _id_user
            }
        })
    }

    async deleteNote(id_note: number){
        const noteDeleted = await this.notesRepository.delete(id_note)
        if(noteDeleted.affected === 0){
            throw new NotFoundException(`Note not found`)
        }
        return {
            message: 'Note successfully deleted'
        }
    }

    async updateNote(id_note: number, archived: boolean) {
        return await this.notesRepository.update(id_note, { archived });
    }

    async editNote(id_note: number, title: string, body: string, category: string) {
        const result = await this.notesRepository.update(id_note, { 
            title: title, 
            body: body, 
            category: category 
        });

        if (result.affected === 0) {
            throw new NotFoundException(`Note with ID ${id_note} not found`);
        }
        return { message: 'Note updated' };
    }
}
