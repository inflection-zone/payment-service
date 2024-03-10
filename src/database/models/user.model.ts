import {
    Entity,
    PrimaryColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany,
   
  } from 'typeorm';
   import { Order } from './order.model';
   import { IsEmail } from 'class-validator';
  
  @Entity({ name: 'users' })
  export class User {
    @PrimaryColumn()
    id: string;
  
    @Column({ type: 'varchar', length: 256, nullable: false })
    FirstName: string;
  
    @Column({ type: 'varchar', length: 256, nullable: false })
    LastName: string;
  
    @Column({ type: 'varchar', length: 256, nullable: true })
    Address: string;
  
    @Column({ type: 'varchar', length: 256, nullable: true })
    @IsEmail()
    Email: string;
  
    @Column({ type: 'varchar', length: 16, nullable: true })
    Phone: string;
  
    @OneToMany(() => Order, (order) => order.User)
    
    Orders: Order[];
  
    @CreateDateColumn()
    CreatedAt: Date;
  
    @UpdateDateColumn()
    UpdatedAt: Date;
  
    @DeleteDateColumn()
    DeletedAt: Date;
  }
  