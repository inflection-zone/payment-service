
import {
    Entity,
    PrimaryGeneratedColumn,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
   
  } from 'typeorm';

import { Order } from './order.model';
import { Payment } from './payment.model';
import { IsEmail } from 'class-validator';
  
  @Entity({ name: 'users' })
  export class User {
    @PrimaryColumn()
    id: string;
  
    @Column({ type: 'varchar', length: 256, nullable: false })
    firstName: string;
  
    @Column({ type: 'varchar', length: 256, nullable: false })
    lastName: string;
  
    @Column({ type: 'varchar', length: 256, nullable: true })
    address: string;
  
    @Column({ type: 'varchar', length: 256, nullable: true })
    @IsEmail()
    email: string;
  
    @Column({ type: 'varchar', length: 16, nullable: true })
    phone: string;
  
    @OneToMany(() => Order, (order) => order.user)
    
    orders: Order[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
  }
  