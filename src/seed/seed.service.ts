import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService :ProductsService
  ) {}

  async runSeed() {
    // validate if enviroment is development
    if (process.env.NODE_ENV !== 'development') {
      throw new NotFoundException('URL not found in production');
    }
    this.insertNewProducts();
    return 'Run Seed';
  }

  private async insertNewProducts() {
    // Delete all products
    await this.productsService.deleteAllProducts();

    // Insert new products
    const seedProducts = initialData.products;
    const insertPromises: Promise<any>[] = [];

    seedProducts.forEach( product => {
      insertPromises.push(this.productsService.create(product!));
    });
    // Wait for all insertions to complete
    await Promise.all(insertPromises);

    return true;
  }
}
