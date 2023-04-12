import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';
import { ValidRoles } from '../interfaces';

@Entity('users')
export class User {
    
    @ApiProperty({
        example:'bc7a57c0-1d93-441b-9e9b-8d25c8286522',
        description: 'User ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example:'test@test.com',
        description: 'User email',
        uniqueItems: true
    })
    @Column('text', {
        unique: true
    })
    email: string;

    @ApiProperty({
        example:"$2a$10$1Kmv5b.UDq6HKjA8kzDU4eha4M2jHgtf..XaelX1vrsxTU9xvAvfu",
        description: 'User password',
        uniqueItems: true
    })
    @Column('text', {
        select: false //No regresa la contraseña
    })
    password: string;

    @ApiProperty({
        example:"Test User 1",
        description: 'User Fullname',
    })
    @Column('text')
    fullName: string;

    @ApiProperty({
        example:"true",
        description: 'User active',
        default: true,
    })
    @Column('bool', {
        default: true
    })
    isActive: boolean;

    @ApiProperty({
        example: [ValidRoles],
        description: "['admin', 'user', 'super-user']",
        default: ['user'],
        isArray: true
    })
    @Column('text', {
        array: true,
        default: ['user']
    })
    roles: string[];

    @ApiProperty({
        type: Product
      })
    @OneToMany(
        () => Product,
        (product) => product.user
    )
    product: Product;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();
    }

}