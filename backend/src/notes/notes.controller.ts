import { Controller, Post, Body, Get, Param, Delete, Put } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NoteDto } from './dto/notes.dto';
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { GetUserId } from 'src/decorators/get-user-id.decorators'

@Controller('notes')
export class NotesController {
    constructor(private readonly notesService: NotesService){}

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createNote(@Body() createNoteDto: NoteDto, @GetUserId() _id_user: number){
        const { title, body, category } = createNoteDto;
        return await this.notesService.create(_id_user, title, body, category)
    }   
    
    @Get()
    @UseGuards(JwtAuthGuard)
    async getNotes(@GetUserId() _id_user: number){
        return await this.notesService.getNotes(_id_user)
    }

    @Delete(':id_note')
    async delete(@Param('id_note') id_note:number){
        return await this.notesService.deleteNote(id_note)
    }

    @Post('update-archive/:id_note')
    @UseGuards(JwtAuthGuard)
    async updateNote(@Param('id_note') id_note: number, @Body('archived') archived: boolean) {
        return await this.notesService.updateNote(id_note, archived);
    }

    @Put(':id_note')
    @UseGuards(JwtAuthGuard)
    async editNote(@Param('id_note') id_note: number, @Body() updateNoteDto: NoteDto) {
        const { title, body, category } = updateNoteDto;
        return await this.notesService.editNote(id_note, title, body, category);
    }
}
