import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Order } from './order.model';
  
  @Entity({ name: 'payments' })
  export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 256, nullable: false })
    PaymentGatewayType: string;
  
    @Column({ type: 'varchar', length: 256, nullable: false })
    PaymentType: string;
  
    @Column({ type: 'varchar', length: 256, nullable: false })
    TransactionId: string;
  
    @ManyToOne(() => Order, (order) => order.Payment)
    Order: Order;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    Amount: number;
 
    @Column({ type: 'varchar', length: 256, nullable: false })
    PaymentStatus: string;
 
    @CreateDateColumn()
    PaymentTimestamp: Date;
  
    @CreateDateColumn()
    CreatedAt: Date;
  
    @UpdateDateColumn()
    UpdatedAt: Date;

  }
  