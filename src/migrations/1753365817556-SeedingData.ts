import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedingData1753365817556 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Companies
    await queryRunner.query(`
      INSERT INTO company (id, name, location) VALUES
      ('c1b1aa02-bd93-4cb1-9403-706e5baf44bb', 'North Logistics Ltd', 'Toronto'),
      ('7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5', 'Orion Freight Inc', 'Amsterdam');
    `);

    // Users
    await queryRunner.query(`
      INSERT INTO "user" (id, name, username, password, role, company_id) VALUES
      ('8e6ff4f7-90da-45db-92f1-f5176ea342ba', 'Alice Johnson', 'alice.j@northlogistics.com', 'hashed_pw', 'owner', 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb'),
      ('259d8b99-d80b-4665-b02f-36138d71a88e', 'Bob Evans', 'bob.e@northlogistics.com', 'hashed_pw', 'operator', 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb'),
      ('a2f98dfb-2aa0-4e6f-9050-119f5e3d75c3', 'Carla Green', 'carla.g@northlogistics.com', 'hashed_pw', 'viewer', 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb'),
      ('597ecf6c-7eeb-4dc0-95bb-7758169d0b70', 'David Lee', 'david.l@orionfreight.com', 'hashed_pw', 'owner', '7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5'),
      ('e0e8d3cb-0f9f-48b7-93bc-3ef486445e34', 'Ella Perez', 'ella.p@orionfreight.com', 'hashed_pw', 'operator', '7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5'),
      ('16de589c-590f-4b91-bc5b-0f6370dbbfa1', 'Frank Wu', 'frank.w@orionfreight.com', 'hashed_pw', 'viewer', '7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5');
    `);

    // Warehouses
    await queryRunner.query(`
      INSERT INTO warehouse (id, name, support_type, company_id) VALUES
      ('2c3bb2e9-9859-4b2f-a720-c1273d78ea1b', 'Toronto Solid Depot', 'solid', 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb'),
      ('4a23b9de-94a2-4cf6-b9f3-5d1a6b81c86c', 'Toronto Liquid Hub', 'liquid', 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb'),
      ('0bb08e6c-98f2-4e2d-b16b-11cf7e7ccdbf', 'Amsterdam Solid Depot', 'solid', '7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5'),
      ('c0bb4ff5-1fa4-46c1-9949-78e6b85ae60c', 'Amsterdam Liquid Hub', 'liquid', '7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5');
    `);

    await queryRunner.query(`
  INSERT INTO partner (id, name, partner_type, company_id) VALUES
  ('fed8f0c2-9a37-4c9d-b1e3-5603e9b44a6d', 'Atlas Importers', 'customer', 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb'),
  ('09e9c35d-5b6f-4a56-bb80-b929b8603c0a', 'CargoFlow Ltd', 'customer', 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb'),
  ('8c9d7c60-e81d-4c68-bbd5-b7cc6b716dcc', 'Marlin Distribution', 'customer', 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb'),
  ('d1ef23e3-7e4f-4123-b881-087763eef264', 'GlobalChem Suppliers', 'supplier', 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb'),
  ('f6726d83-4a5e-4c4e-9be0-1e5e68edb872', 'CargoWorld BV', 'customer', '7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5'),
  ('9c799c98-8615-4e76-9a83-3ac21c9f1f99', 'TradeCore GmbH', 'customer', '7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5'),
  ('b0c4fd42-cfe2-4453-b9f6-62fa1e450e8b', 'Everest Exporters', 'customer', '7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5'),
  ('c2fd11f4-14e0-4e2a-8864-bd7c9ae1e053', 'SinoChem Ltd', 'supplier', '7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5');
`);

    // Products
    await queryRunner.query(`
  INSERT INTO product (id, name, type, code, price, company_id) VALUES
  ('6a5ef676-b875-42e5-ae6f-3b30222541ce', 'Steel Rod', 'solid', 'PRD-N1', 45.00, 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb'),
  ('7f7280c5-3061-4b7e-89a2-6b3b2797edc0', 'Concrete Block', 'solid', 'PRD-N2', 33.50, 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb'),
  ('fd73f34f-f84e-41e6-b4ff-e20f7b4286d4', 'Iron Pipe', 'solid', 'PRD-N3', 52.00, 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb'),
  ('a6f32195-2e0c-4374-bbd6-759e77ae59de', 'Hydraulic Fluid', 'liquid', 'PRD-N4', 27.99, 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb'),
  ('34bc94a4-2ef9-4d33-8ae3-b32b19d50287', 'Lubricant Oil', 'liquid', 'PRD-N5', 22.75, 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb'),
  ('6b9c9c20-6e84-4973-a3f5-2e1a29f3d9a7', 'Coolant Mix', 'liquid', 'PRD-N6', 19.90, 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb'),
  ('a33ab429-bbdb-4d86-a7c4-707ed88a6a10', 'Steel Rod EU', 'solid', 'PRD-E1', 47.00, '7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5'),
  ('84b9c6c5-57b0-49a3-9e55-1a71e4c52723', 'Concrete Block EU', 'solid', 'PRD-E2', 36.00, '7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5'),
  ('97dced6d-193a-4a2d-8121-d0bfb7e61c59', 'Iron Pipe EU', 'solid', 'PRD-E3', 50.00, '7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5'),
  ('3b20b017-8e00-4ab0-a00c-e6ea8d0b3d94', 'Hydraulic Fluid EU', 'liquid', 'PRD-E4', 29.00, '7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5'),
  ('efbdf4cf-7d46-4a3c-b15a-f048e0a62469', 'Lubricant Oil EU', 'liquid', 'PRD-E5', 24.50, '7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5'),
  ('cdd71e2c-f011-4905-9a68-e907de2e30a4', 'Coolant Mix EU', 'liquid', 'PRD-E6', 20.00, '7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5');
`);
    await queryRunner.query(`
  INSERT INTO "order" (id, type, date, company_id, user_id, warehouse_id, partner_id) VALUES
  ('46354e1c-4e7b-4f6e-9f64-f413c304b79e', 'delivery', CURRENT_DATE, 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb', '8e6ff4f7-90da-45db-92f1-f5176ea342ba', '2c3bb2e9-9859-4b2f-a720-c1273d78ea1b', 'fed8f0c2-9a37-4c9d-b1e3-5603e9b44a6d'),
  ('750d3b5a-e843-48a3-81fd-885bba4d331b', 'delivery', CURRENT_DATE, 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb', '259d8b99-d80b-4665-b02f-36138d71a88e', '2c3bb2e9-9859-4b2f-a720-c1273d78ea1b', '09e9c35d-5b6f-4a56-bb80-b929b8603c0a'),
  ('3d88953f-9e9b-4a9a-bfbf-fd6a88cf9b6c', 'delivery', CURRENT_DATE, 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb', 'a2f98dfb-2aa0-4e6f-9050-119f5e3d75c3', '4a23b9de-94a2-4cf6-b9f3-5d1a6b81c86c', '8c9d7c60-e81d-4c68-bbd5-b7cc6b716dcc'),
  ('eae59cb9-7a93-4d60-9476-df19192b67a2', 'shipment', CURRENT_DATE, 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb', '8e6ff4f7-90da-45db-92f1-f5176ea342ba', '2c3bb2e9-9859-4b2f-a720-c1273d78ea1b', 'd1ef23e3-7e4f-4123-b881-087763eef264'),
  ('cfe76b8d-61be-4e1b-9d20-683af8c92f60', 'shipment', CURRENT_DATE, 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb', '259d8b99-d80b-4665-b02f-36138d71a88e', '4a23b9de-94a2-4cf6-b9f3-5d1a6b81c86c', 'fed8f0c2-9a37-4c9d-b1e3-5603e9b44a6d'),
  ('49e5fc0f-6575-4c59-a6b5-fd37e8aa370a', 'shipment', CURRENT_DATE, 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb', 'a2f98dfb-2aa0-4e6f-9050-119f5e3d75c3', '2c3bb2e9-9859-4b2f-a720-c1273d78ea1b', '09e9c35d-5b6f-4a56-bb80-b929b8603c0a'),
  ('f2841cf9-6d5d-43ea-8ce2-77f74d579c90', 'shipment', CURRENT_DATE, 'c1b1aa02-bd93-4cb1-9403-706e5baf44bb', '8e6ff4f7-90da-45db-92f1-f5176ea342ba', '4a23b9de-94a2-4cf6-b9f3-5d1a6b81c86c', '8c9d7c60-e81d-4c68-bbd5-b7cc6b716dcc');
`);

    await queryRunner.query(`
  INSERT INTO order_items (id, quantity, order_id, product_id) VALUES
  ('b97d2cf4-8d27-4190-a6fd-04335ea221b9', 5.00, '46354e1c-4e7b-4f6e-9f64-f413c304b79e', '6a5ef676-b875-42e5-ae6f-3b30222541ce'),
  ('d8d9cdb4-2231-4208-98eb-8a867d87c59e', 3.00, '750d3b5a-e843-48a3-81fd-885bba4d331b', '7f7280c5-3061-4b7e-89a2-6b3b2797edc0'),
  ('3f147e6a-fb3e-4f7c-a287-0c1e40a8bb16', 4.00, '3d88953f-9e9b-4a9a-bfbf-fd6a88cf9b6c', 'fd73f34f-f84e-41e6-b4ff-e20f7b4286d4'),
  ('a2dddc64-75f0-4b45-a1e8-9e4532f2a478', 2.00, 'eae59cb9-7a93-4d60-9476-df19192b67a2', 'a6f32195-2e0c-4374-bbd6-759e77ae59de'),
  ('fef99aa2-5865-4e2b-b594-1ef1f8ac4f7a', 6.00, 'cfe76b8d-61be-4e1b-9d20-683af8c92f60', '34bc94a4-2ef9-4d33-8ae3-b32b19d50287'),
  ('682317b5-7246-4709-8a18-37e5a69b2326', 2.50, '49e5fc0f-6575-4c59-a6b5-fd37e8aa370a', '6b9c9c20-6e84-4973-a3f5-2e1a29f3d9a7');
`);

    await queryRunner.query(`
  INSERT INTO invoice (id, date, invoice_number, user_id, order_id) VALUES
  ('835580fe-f91b-4db4-8e7d-67ef688e93ee', CURRENT_DATE, 'INV-001', '8e6ff4f7-90da-45db-92f1-f5176ea342ba', '46354e1c-4e7b-4f6e-9f64-f413c304b79e'),
  ('d792be99-2f39-4c38-a302-72e39a0c11b8', CURRENT_DATE, 'INV-002', '259d8b99-d80b-4665-b02f-36138d71a88e', '750d3b5a-e843-48a3-81fd-885bba4d331b'),
  ('4e173bb8-0d4b-4190-9fe7-c2384c64b21b', CURRENT_DATE, 'INV-003', 'a2f98dfb-2aa0-4e6f-9050-119f5e3d75c3', '3d88953f-9e9b-4a9a-bfbf-fd6a88cf9b6c'),
  ('0f8f35f3-6c60-4399-9b85-f3cb09f4a7be', CURRENT_DATE, 'INV-004', '8e6ff4f7-90da-45db-92f1-f5176ea342ba', 'eae59cb9-7a93-4d60-9476-df19192b67a2'),
  ('68ebce26-c527-4e79-8139-4d7d6c0d837c', CURRENT_DATE, 'INV-005', '259d8b99-d80b-4665-b02f-36138d71a88e', 'cfe76b8d-61be-4e1b-9d20-683af8c92f60'),
  ('b1eebbc7-95b5-4eb0-a798-2f490d7b2375', CURRENT_DATE, 'INV-006', 'a2f98dfb-2aa0-4e6f-9050-119f5e3d75c3', '49e5fc0f-6575-4c59-a6b5-fd37e8aa370a'),
  ('fbdc3a1e-0eb3-4e60-8c7e-7b2ec248b6fd', CURRENT_DATE, 'INV-007', '8e6ff4f7-90da-45db-92f1-f5176ea342ba', 'f2841cf9-6d5d-43ea-8ce2-77f74d579c90');
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
  DELETE FROM invoice WHERE id IN (
    '835580fe-f91b-4db4-8e7d-67ef688e93ee',
    'd792be99-2f39-4c38-a302-72e39a0c11b8',
    '4e173bb8-0d4b-4190-9fe7-c2384c64b21b',
    '0f8f35f3-6c60-4399-9b85-f3cb09f4a7be',
    '68ebce26-c527-4e79-8139-4d7d6c0d837c',
    'b1eebbc7-95b5-4eb0-a798-2f490d7b2375',
    'fbdc3a1e-0eb3-4e60-8c7e-7b2ec248b6fd'
  );
`);

    await queryRunner.query(`
  DELETE FROM order_items WHERE id IN (
    'b97d2cf4-8d27-4190-a6fd-04335ea221b9',
    'd8d9cdb4-2231-4208-98eb-8a867d87c59e',
    '3f147e6a-fb3e-4f7c-a287-0c1e40a8bb16',
    'a2dddc64-75f0-4b45-a1e8-9e4532f2a478',
    'fef99aa2-5865-4e2b-b594-1ef1f8ac4f7a',
    '682317b5-7246-4709-8a18-37e5a69b2326'
  );
`);

    await queryRunner.query(`
  DELETE FROM "order" WHERE id IN (
    '46354e1c-4e7b-4f6e-9f64-f413c304b79e',
    '750d3b5a-e843-48a3-81fd-885bba4d331b',
    '3d88953f-9e9b-4a9a-bfbf-fd6a88cf9b6c',
    'eae59cb9-7a93-4d60-9476-df19192b67a2',
    'cfe76b8d-61be-4e1b-9d20-683af8c92f60',
    '49e5fc0f-6575-4c59-a6b5-fd37e8aa370a',
    'f2841cf9-6d5d-43ea-8ce2-77f74d579c90'
  );
`);

    // Products
    await queryRunner.query(`
    DELETE FROM product WHERE id IN (
      '6a5ef676-b875-42e5-ae6f-3b30222541ce',
      '7f7280c5-3061-4b7e-89a2-6b3b2797edc0',
      'fd73f34f-f84e-41e6-b4ff-e20f7b4286d4',
      'a6f32195-2e0c-4374-bbd6-759e77ae59de',
      '34bc94a4-2ef9-4d33-8ae3-b32b19d50287',
      '6b9c9c20-6e84-4973-a3f5-2e1a29f3d9a7',
      'a33ab429-bbdb-4d86-a7c4-707ed88a6a10',
      '84b9c6c5-57b0-49a3-9e55-1a71e4c52723',
      '97dced6d-193a-4a2d-8121-d0bfb7e61c59',
      '3b20b017-8e00-4ab0-a00c-e6ea8d0b3d94',
      'efbdf4cf-7d46-4a3c-b15a-f048e0a62469',
      'cdd71e2c-f011-4905-9a68-e907de2e30a4'
    );
  `);

    // Partners
    await queryRunner.query(`
    DELETE FROM partner WHERE id IN (
      'fed8f0c2-9a37-4c9d-b1e3-5603e9b44a6d',
      '09e9c35d-5b6f-4a56-bb80-b929b8603c0a',
      '8c9d7c60-e81d-4c68-bbd5-b7cc6b716dcc',
      'd1ef23e3-7e4f-4123-b881-087763eef264',
      'f6726d83-4a5e-4c4e-9be0-1e5e68edb872',
      '9c799c98-8615-4e76-9a83-3ac21c9f1f99',
      'b0c4fd42-cfe2-4453-b9f6-62fa1e450e8b',
      'c2fd11f4-14e0-4e2a-8864-bd7c9ae1e053'
    );
  `);

    // Warehouses
    await queryRunner.query(`
    DELETE FROM warehouse WHERE id IN (
      '2c3bb2e9-9859-4b2f-a720-c1273d78ea1b',
      '4a23b9de-94a2-4cf6-b9f3-5d1a6b81c86c',
      '0bb08e6c-98f2-4e2d-b16b-11cf7e7ccdbf',
      'c0bb4ff5-1fa4-46c1-9949-78e6b85ae60c'
    );
  `);

    // Users
    await queryRunner.query(`
    DELETE FROM "user" WHERE id IN (
      '8e6ff4f7-90da-45db-92f1-f5176ea342ba',
      '259d8b99-d80b-4665-b02f-36138d71a88e',
      'a2f98dfb-2aa0-4e6f-9050-119f5e3d75c3',
      '597ecf6c-7eeb-4dc0-95bb-7758169d0b70',
      'e0e8d3cb-0f9f-48b7-93bc-3ef486445e34',
      '16de589c-590f-4b91-bc5b-0f6370dbbfa1'
    );
  `);

    // Companies
    await queryRunner.query(`
    DELETE FROM company WHERE id IN (
      'c1b1aa02-bd93-4cb1-9403-706e5baf44bb',
      '7a9be4c8-e18d-4e0c-bdc3-13c1e5c9b0f5'
    );
  `);
  }
}
