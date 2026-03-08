import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Category } from './entities/categories.entity';
import { ConflictException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { Note } from 'src/notes/entities/notes.entity';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>,
        @InjectRepository(Note) private notesRepository: Repository<Note> // <--- Inyecta esto
    ){}

    async findOne(categoryName: string): Promise<Category | null> {
        return await this.categoryRepository.findOne({ 
            where: { 
                category: categoryName
            } 
        });
    }

    async create(_id_user: number, categoryName: string) {
        const categoryExists = await this.categoryRepository.findOne({
            where: {
                category: categoryName,
                id_user_category_fk: _id_user
            }
        })

        if (categoryExists) {
            throw new ConflictException('The category is already registered for this user');
        }

        const newCategory = this.categoryRepository.create({
            id_user_category_fk: _id_user,
            category: categoryName
        })
        
        return await this.categoryRepository.save(newCategory);
    }

    async getCategories(_id_user: number){
        return await this.categoryRepository.find({
            select: {
                category: true
            },
            where: {
                id_user_category_fk: _id_user
            }
        })
    }

    async deleteCategory(categoryName: string) {
        const notesWithCategory = await this.notesRepository.count({
            where: { category: categoryName }
        });

        if (notesWithCategory > 0) {
            throw new ConflictException(`You cannot delete this category because it is being used in ${notesWithCategory} notes.`);
        }

        const categoryDeleted = await this.categoryRepository.delete({ category: categoryName });
        
        if (categoryDeleted.affected === 0) {
            throw new NotFoundException(`Category not found`);
        }

        return { message: 'Category deleted succesfully' };
    }   
}
