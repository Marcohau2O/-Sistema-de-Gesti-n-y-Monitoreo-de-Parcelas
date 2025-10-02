/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const bcrypt = require('bcryptjs')
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = async (pgm) => {
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await pgm.db.query (
        `INSERT INTO users (name, email, password, role)
        VALUES ($1, $2, $3, $4)`,
        ['Admin', 'admin@sgmp.com', hashedPassword, 'admin']
    )
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = async (pgm) => {
    await pgm.db.query(`DELETE FROM users WHERE email = $1`, ['admin@example.com'])
};
