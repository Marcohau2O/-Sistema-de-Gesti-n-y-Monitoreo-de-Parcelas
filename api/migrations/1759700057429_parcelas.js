/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
    pgm.createTable('parcelas', {
    id: 'id',
    nombre: { type: 'varchar(100)', notNull: true },
    cultivo: { type: 'varchar(100)' },
    responsable: { type: 'varchar(100)' },

    // Campos de ubicación geográfica
    latitud: { type: 'decimal(10, 7)', notNull: true },
    longitud: { type: 'decimal(10, 7)', notNull: true },

    estado: { type: 'varchar(50)', default: 'activa' }, // activa, inactiva, mantenimiento
    created_at: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') }
  });

  // Tabla para registrar las parcelas eliminadas
  pgm.createTable('parcelas_eliminadas', {
    id: 'id',
    id_parcela: {
      type: 'integer',
      references: '"parcelas"',
      onDelete: 'SET NULL'
    },
    nombre: { type: 'varchar(100)' },
    cultivo: { type: 'varchar(100)' },
    responsable: { type: 'varchar(100)' },

    // Mantener coordenadas de la parcela eliminada
    latitud: { type: 'decimal(10, 7)' },
    longitud: { type: 'decimal(10, 7)' },

    motivo_eliminacion: { type: 'text' },
    eliminado_en: { type: 'timestamp', default: pgm.func('CURRENT_TIMESTAMP') }
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
    pgm.dropTable('parcelas_eliminadas');
    pgm.dropTable('parcelas');
};
