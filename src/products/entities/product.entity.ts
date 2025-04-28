import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/users.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Product {

    @ApiProperty({
        example: 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6',
        description: 'Unique identifier for the product',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Product Title',
        description: 'Title of the product'
    })
    @Column('text',{
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: '15.25',
        description: 'Precio del producto',
    })
    @Column('float',{
        default: 0.0,
    })
    price: number;

    @ApiProperty({
        example: 'lorem ipsum dolor sit amet, consectetur adipiscing elit',
        description: 'description of the product',
        required: false,
    })
    @Column({
        type: 'text',
        nullable: true,
    })
    description: string;

    @ApiProperty({
        example: 'product_title',
        description: 'slug of the product',
        uniqueItems: true,
    })
    @Column({
        type: 'text',
        unique: true,
        nullable: false,
    })
    slug: string;

    @ApiProperty({
        example: 100,
        description: 'stock of the product',
        default: 0,
    })
    @Column({
        type: 'int',
        default: 0,
    })
    stock: number;

    @ApiProperty({
        example: ['M', 'L', 'XL'],
        description: 'Sizes of the product',
    })
    @Column('text', {
        array: true,
    })
    sizes: string[];

    @ApiProperty({
        example: 'gender',
        description: 'Gender of the product',
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: 'WOMEN',
        description: 'Gender of the product',
    })
    @Column('text', {
        array: true,
        default: [],
    })
    tags: string[];

    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true, eager: true,}
    )
    images?:ProductImage[];

    @ManyToOne(
        () => User,
        (user)  => user.product,
        { eager:true}
    )
    user: User

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug.toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        if (!this.slug) {
            this.slug = this.title;
        }

        this.slug = this.slug.toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '');
    }
}
