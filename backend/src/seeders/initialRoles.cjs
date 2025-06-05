
module.exports = {
  up: async (queryInterface) => {
    // First, ensure ENUM type exists for User.role
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_User_role') THEN
          CREATE TYPE "enum_User_role" AS ENUM ('shop_owner', 'customer', 'admin');
        END IF;
      END$$;
    `);

    // Insert shops (since users reference shops)
    await queryInterface.bulkInsert('Shops', [{
      name: 'Default Shop',
      type: 'Retail',
      address: '123 Main St',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    // Insert admin user
    await queryInterface.bulkInsert('Admins', [{
      username: 'superadmin',
      email: 'admin@wez.com',
      password: '$2a$10$exampleHashedPassword', // Use bcrypt hash in real implementation
      role: 'super_admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Shops', null, {});
    await queryInterface.bulkDelete('Admins', null, {});
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_User_role"');
  }
};