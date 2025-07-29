import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { CompanyModule } from './entities/company/company.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './entities/user/user.module';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/authGuard';
import { WarehouseModule } from './entities/warehouse/warehouse.module';
import { PartnerModule } from './entities/partner/partner.module';
import { ProductModule } from './entities/product/product.module';
import { OrderModule } from './entities/order/order.module';
import { OrderItemsModule } from './entities/orderItems/orderItems.module';
import { InvoiceModule } from './entities/invoice/invoice.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: 'src/schema.gql',
          playground: true,
        }),
      ],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const db = config.get<{
          host: string;
          port: number;
          username: string;
          password: string;
          name: string;
        }>('database');

        return {
          type: 'postgres',
          host: db?.host,
          port: db?.port,
          username: db?.username,
          password: db?.password,
          database: db?.name,
          autoLoadEntities: true,
          synchronize: false,
          retryAttempts: 4,
          logging: true,
        };
      },
    }),
    CompanyModule,
    AuthModule,
    UserModule,
    WarehouseModule,
    PartnerModule,
    ProductModule,
    OrderModule,
    OrderItemsModule,
    InvoiceModule,
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard, JwtAuthGuard],
})
export class AppModule {}
