import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { initialData } from './data/seed-data';
import { ProductsService } from 'src/products/products.service';
import { User } from '../auth/entities/users.entity';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService :ProductsService,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async runSeed() {
    // validate if enviroment is development
    if (process.env.NODE_ENV !== 'development') {
      throw new NotFoundException('URL not found in production');
    }
    await this.deleteTable();
    const user = await this.insertUsers();
    this.insertNewProducts(user);
    return 'Run Seed';
  }
  private async deleteTable() {
    await this.productsService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];

    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user));
    });

    const dbUsers = await this.userRepository.save(users);
    return dbUsers;
   }
  private async insertNewProducts(user: User[]) {
    // Delete all products
    await this.productsService.deleteAllProducts();

    // Insert new products
    const seedProducts = initialData.products;
    const insertPromises: Promise<any>[] = [];

    seedProducts.forEach( product => {
      let tempUser = user[Math.floor(Math.random() * user.length)];
      insertPromises.push(this.productsService.create(product!, tempUser));
    });
    // Wait for all insertions to complete
    await Promise.all(insertPromises);

    return true;
  }
}
