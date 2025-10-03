const pool = require('../db');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, role FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

// Editar usuario
const editUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    let query = 'UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4';
    let values = [name, email, role, id];

    // Si viene contraseña, la actualizamos con hash
    if (password) {
      const hashed = bcrypt.hashSync(password, 10);
      query = 'UPDATE users SET name = $1, email = $2, role = $3, password = $4 WHERE id = $5';
      values = [name, email, role, hashed, id];
    }

    await pool.query(query, values);
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (err) {
    console.error('Error al editar usuario:', err);
    res.status(500).json({ message: 'Error al editar usuario' });
  }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(500).json({ message: 'Error al eliminar usuario' });
  }
};

module.exports = { getAllUsers, editUser, deleteUser };
