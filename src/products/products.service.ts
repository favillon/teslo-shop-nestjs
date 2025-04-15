import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');
  

  constructor(
    @InjectRepository(Product)
    private readonly productRepository : Repository<Product>,
  ){}

  async create(createProductDto: CreateProductDto) {
    //  Patron repository
    try {
      // Registro en Memoria
      const product =  this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.productRepository.find({
      take: limit,
      skip: offset,
    })
  }

  async findOne(term: string) {     
    
    let product:Product | null | undefined;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({id: term});
    } else {
      const queyrBuilder= this.productRepository.createQueryBuilder();
      product = await queyrBuilder.where('LOWER(title) = LOWER(:title) or LOWER(slug) = :slug', {
         title: term ,
         slug: term ,
        }).getOne();
    }
    
    if (!product) 
      throw new NotFoundException(`Product with ${ term } not found`);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      // Registro en Memoria
      const product = await this.productRepository.preload({
        id,
        ...updateProductDto,
      });
      
      if (!product) 
        throw new NotFoundException(`Product with ${ id } not found`);

      await this.productRepository.save(product);
      
      return product;

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: string) {
    const product =  await this.findOne(id);
    await this.productRepository.remove(product);
  }

  private handleDBException(error: any) {
    if (error.code === '23505')
      throw new BadRequestException(error.detail);
    
    this.logger.error(error.message);
    throw new InternalServerErrorException('Unexpecte error, check logs for more info in product');
  }
}
