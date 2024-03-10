import {
    Entity,
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
    OrderConfirmationTimestamp: Date;
  
    @Column({ type: 'varchar', length: 512, nullable: true })
    description: string;
  
    @ManyToOne(() => User, (user) => user.Orders)
    @JoinColumn()
    User: User;
  
    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    AmountToBePaid: number;
  
    @Column({ type: 'varchar', length: 256, nullable: true })
    GatewayOrderId: string;
  
    @ManyToOne(() => Payment, (payment) => payment.Order)
    @JoinColumn()
    Payment: Payment;
 
    @CreateDateColumn()
    CreatedAt: Date;
  
    @UpdateDateColumn()
    UpdatedAt: Date;
  
    @DeleteDateColumn()
    DeletedAt: Date;
   
    
  }
  