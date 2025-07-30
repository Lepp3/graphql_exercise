import { registerEnumType } from '@nestjs/graphql';
import { SupportType as SupportTypeEnum } from 'src/entities/warehouse/warehouse.entity';
import { OrderType as OrderTypeEnum } from 'src/entities/order/order.entity';
import { UserRole as UserRoleEnum } from 'src/entities/user/user.entity';
import { PartnerType as PartnerTypeEnum } from 'src/entities/partner/partner.entity';

registerEnumType(SupportTypeEnum, {
  name: 'ProductSupportType',
  description: 'The type of products a warehouse supports',
});

registerEnumType(OrderTypeEnum, {
  name: 'OrderCategory',
  description: 'the type of order',
});

registerEnumType(UserRoleEnum, {
  name: 'UserRole',
  description: 'The role of the user',
});

registerEnumType(PartnerTypeEnum, {
  name: 'BusinessPartnerType',
  description: 'The type of business partner',
});
