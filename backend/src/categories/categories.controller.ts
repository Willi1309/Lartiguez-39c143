import { Body, Controller, Post, Get, Delete, Param } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { ConflictException, HttpException, HttpStatus } from '@nestjs/common'
import { CreateCategoryDto } from './dto/categories.dto'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { GetUserId } from 'src/decorators/get-user-id.decorators'

@Controller('categories')
export class CategoriesController {
    constructor(private categoriesService: CategoriesService){}

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async createCategory(@Body() createCategoryDto: CreateCategoryDto, @GetUserId() _id_user: number){
        try{
            const { category } = createCategoryDto
            if(!_id_user) throw new HttpException('Token invalido o usuario no especificado', HttpStatus.UNAUTHORIZED)
            return await this.categoriesService.create(_id_user, category)
        }catch(error){
            if(error instanceof ConflictException){
                throw new HttpException('La categoria ya esta registrada', HttpStatus.METHOD_NOT_ALLOWED)
            }
        }
        throw Error
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async getCategories(@GetUserId() _id_user: number){
        if(!_id_user) throw new HttpException('Token invalido o usuario no especificado', HttpStatus.UNAUTHORIZED)
        return await this.categoriesService.getCategories(_id_user)
    }

    @Delete(':categoryName')
    async delete(@Param('categoryName') categoryName:string){
        return await this.categoriesService.deleteCategory(categoryName)
    }
}
