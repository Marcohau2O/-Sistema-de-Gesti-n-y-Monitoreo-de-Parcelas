const express = require('express');
const router = express.Router();
const { getAllUsers, editUser, deleteUser } = require('../controllers/userController');
// const auth = require('./middleware/auth')

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Editar usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 */
router.patch('/usersEdit/:id', editUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 */
router.delete('/userDelete/:id', deleteUser);

module.exports = router;
