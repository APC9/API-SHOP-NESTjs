import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { Product } from './entities';

@ApiTags('Products') // tags para agrupar swagger
@Controller('products')
//@Auth(ValidRoles.admin, ValidRoles.superUser)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @ApiResponse({status: 201, description: 'Product successfully created', type: Product })
  @ApiResponse({status: 400, description: 'Bad  Request'})
  @ApiResponse({status: 403, description: 'Forbidden. token is not valid'})
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User, // obtengo toda la información del usuario
    ) {
    return this.productsService.create(createProductDto, user);
  }

  @ApiResponse({status: 201, description: 'Product successfully created', type: Product })
  @ApiResponse({status: 400, description: 'Bad  Request'})
  @Get()
  findAll( @Query() paginationDto:PaginationDto ) {
    return this.productsService.findAll(paginationDto);
  }

  @ApiResponse({status: 201, description: 'Product successfully created', type: Product })
  @ApiResponse({status: 400, description: 'Bad  Request'})
  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User, // obtengo toda la información del usuario
    ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }

}
