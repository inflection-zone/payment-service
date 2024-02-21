// order.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    PrimaryColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn,
    UpdateDateColumn,
    DeleteDateColumn,
  } from 'typeorm';


  import { User } from './user.model';
import { Payment } from './payment.model';
  
  @Entity({ name: 'orders' })
  export class Order {
   
    @PrimaryColumn()
    id: string;
  
    @Column({ type: 'timestamp', nullable: false })
    orderConfirmationTimestamp: Date;
  
    @Column({ type: 'varchar', length: 512, nullable: true })
    description: string;
  
    @ManyToOne(() => User, (user) => user.orders)
    @JoinColumn({ name: 'userId' })
    user: User;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    amountToBePaid: number;
  

    @Column({ type: 'varchar', length: 256, nullable: true })
    gatewayOrderId: string;
  
    @ManyToOne(() => Payment, (payment) => payment.order)
    @JoinColumn({ name: 'paymentId' })
    payment: Payment;
    // @Column({ type: 'varchar', length: 256, nullable: true })
    // paymentId: string;
    
  
    // @Column({ type: 'varchar', length: 256, nullable: false })  // Add paymentType property
    // paymentType: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
   
    
  }
  