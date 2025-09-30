/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
    pgm.createTable('usertokens', {
    id: 'id',
    user_id: { type: 'integer', notNull: true, references: 'users(id)', onDelete: 'cascade' },
    token: { type: 'text', notNull: true, unique: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
    pgm.dropTable('usertokens');
};
