const express = require('express');
const {
  getParcelas,
  getParcelaById,
  createParcela,
  updateParcela,
  deleteParcela,
  getParcelasEliminadas,
} = require('../controllers/parcelasController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Parcelas
 *   description: Gestión de parcelas (CRUD + historial de eliminadas)
 */

/**
 * @swagger
 * /api/parcela/parcelas:
 *   get:
 *     summary: Obtener todas las parcelas activas
 *     tags: [Parcelas]
 */
router.get('/parcelas', getParcelas);

/**
 * @swagger
 * /api/parcela/parcelas/{id}:
 *   get:
 *     summary: Obtener una parcela por ID
 *     tags: [Parcelas]
 */
router.get('/parcelasById/:id', getParcelaById);

/**
 * @swagger
 * /api/parcela/createParcelas:
 *   post:
 *     summary: Crear una nueva parcela
 *     tags: [Parcelas]
 */
router.post('/createParcelas', createParcela);

/**
 * @swagger
 * /api/parcela/parcUpdate/{id}:
 *   put:
 *     summary: Actualizar una parcela existente
 *     tags: [Parcelas]
 */
router.put('/parcUpdate/:id', updateParcela);

/**
 * @swagger
 * /api/parcela/parcDelete/{id}:
 *   delete:
 *     summary: Eliminar una parcela (se guarda en historial)
 *     tags: [Parcelas]
 */
router.delete('/parcDelete/:id', deleteParcela);

/**
 * @swagger
 * /api/parcela/parcelas/eliminadas:
 *   get:
 *     summary: Obtener listado de parcelas eliminadas
 *     tags: [Parcelas]
 */
router.get('/parcelas/eliminadas', getParcelasEliminadas);

module.exports = router;
