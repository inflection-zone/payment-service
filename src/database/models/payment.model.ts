// payment.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';
 import { Order } from './order.model';
  
  @Entity({ name: 'payments' })
  export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 256, nullable: false })
    paymentGatewayType: string;
  
    @Column({ type: 'varchar', length: 256, nullable: false })
    paymentType: string;
  
    @Column({ type: 'varchar', length: 256, nullable: false })
    transactionId: string;
  
    @ManyToOne(() => Order, (order) => order.payment)
    order: Order;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    amount: number;
  
    // @Column({ type: 'varchar', nullable: false })
    // amount: string;
    @Column({ type: 'varchar', length: 256, nullable: false })
    paymentStatus: string;
 
  
    @CreateDateColumn()
    paymentTimestamp: Date;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
    static payment: any;
  }
  