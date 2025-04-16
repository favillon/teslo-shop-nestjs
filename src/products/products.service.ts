import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository : Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository : Repository<ProductImage>,

    private readonly dataSource: DataSource,
  ){}

  async create(createProductDto: CreateProductDto) {
    //  Patron repository
    try {
      // Registro en Memoria
      const { images, ...productDetails } = createProductDto;
      const product =  this.productRepository.create({
        ...productDetails,
        images: images!.map(image => this.productImageRepository.create({url: image}) ),
      });
      await this.productRepository.save(product);
      return {...product, images};

    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const prodcuts =  await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      },
    })

    return prodcuts.map( ({images, ...rest}) => ({
      ...rest,
      images: images!.map(image => image.url)
    }));
  }

  async findOne(term: string) {

    let product:Product | null | undefined;

    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({id: term});
    } else {
      // createQueryBuilder('p'); // Alias de la tabla products p
      const queyrBuilder= this.productRepository.createQueryBuilder('p');
      product = await queyrBuilder.where('LOWER(title) = LOWER(:title) or LOWER(slug) = :slug', {
         title: term ,
         slug: term ,
        })
        .leftJoinAndSelect('p.images', 'prodImages')
        .getOne();
    }

    if (!product)
      throw new NotFoundException(`Product with ${ term } not found`);

    return product;
  }

  async findOnePlain(term: string) {
    const { images, ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images!.map(image => image.url)
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({ id, ...toUpdate});

    if (!product)
      throw new NotFoundException(`Product with ${ id } not found`);

    // Query Runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map(image => this.productImageRepository.create({ url: image }));
      }
      await queryRunner.manager.save(product);

      //await this.productRepository.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
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

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
        return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBException(error);
    }
  }
}
