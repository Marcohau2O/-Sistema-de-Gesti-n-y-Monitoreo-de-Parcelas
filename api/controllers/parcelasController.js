const pool = require('../db')

const getParcelas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM parcelas ORDER BY id ASC');
        res.json(result.rows);      
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

const getParcelaById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM parcelas WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Parcela no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createParcela = async (req, res) => {
  try {
    const { nombre, cultivo, responsable, latitud, longitud, estado } = req.body;
    const result = await pool.query(
      `INSERT INTO parcelas (nombre, cultivo, responsable, latitud, longitud, estado)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, cultivo, responsable, latitud, longitud, estado || 'activa']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateParcela = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cultivo, responsable, latitud, longitud, estado } = req.body;

    const result = await pool.query(
      `UPDATE parcelas 
       SET nombre=$1, cultivo=$2, responsable=$3, latitud=$4, longitud=$5, estado=$6
       WHERE id=$7 RETURNING *`,
      [nombre, cultivo, responsable, latitud, longitud, estado, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ message: 'Parcela no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteParcela = async (req, res) => {
  try {
    const { id } = req.params;

    const parcela = await pool.query('SELECT * FROM parcelas WHERE id = $1', [id]);
    if (parcela.rowCount === 0) return res.status(404).json({ message: 'Parcela no encontrada' });

    const p = parcela.rows[0];

    await pool.query(
      `INSERT INTO parcelas_eliminadas (id_parcela, nombre, cultivo, responsable, latitud, longitud, motivo_eliminacion)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [p.id, p.nombre, p.cultivo, p.responsable, p.latitud, p.longitud, 'Eliminación manual desde API']
    );

    await pool.query('DELETE FROM parcelas WHERE id = $1', [id]);

    res.json({ message: 'Parcela eliminada correctamente y registrada en historial' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getParcelasEliminadas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM parcelas_eliminadas ORDER BY eliminado_en DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getParcelas, getParcelaById, createParcela, updateParcela, deleteParcela, getParcelasEliminadas };