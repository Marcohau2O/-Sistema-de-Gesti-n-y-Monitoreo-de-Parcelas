/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
  pgm.createTable('users', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true, unique: true},
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true },
    role: { type: 'varchar(255)', notNull: true},
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });

  const hashedPassword = '$2b$10$7kU1uEoac1fhTz6H1ZZmOONnJuxMQgS6aJxZHeqH15X7OSMPOj8hS'; // hash de "admin123"

  pgm.sql(`
    INSERT INTO users (name, email, password, role)
    VALUES ('Admin', 'admin@example.com', '${hashedPassword}', 'admin')
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
  pgm.dropTable('users');
};
