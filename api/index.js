require('dotenv').config()

const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
//Controlles

const userRoutes = require('./routes/userRoutes');

const app = express()
const pool = require('./db');
const port = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',') || []
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Usuarios con JWT',
      version: '1.0.0',
      description: 'API de SGMP',
    },
    servers: [
      {
        url: "http://localhost:4000",
        url: "http://localhost:3169"
      },
    ],
  },
  apis: ['./index.js', './routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json())
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Origen no permitido por CORS'))
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))


app.use('/api', userRoutes);


const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ message: 'Token requerido' })
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Token inválido' })
  }
}

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: user
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: mypassword
 *     responses:
 *       200:
 *         description: Login exitoso, retorna JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Usuario no encontrado o contraseña incorrecta
 *       500:
 *         description: Error interno del servidor
 */
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' })
    }

    const valid = bcrypt.compareSync(password, user.password)
    if (!valid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' })
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '2h' })

    await pool.query(
      'INSERT INTO usertokens (user_id, token) VALUES ($1, $2)',
      [user.id, token]
    );

    res.json({ token })
  } catch (err) {
    console.error('🔥 Error en /api/login:', err)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})


/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: mypassword
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       500:
 *         description: Error al registrar usuario
 */
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body
  const hashed = bcrypt.hashSync(password, 10)

  // rol fijo a "user"
  const role = 'user'

  try {
    await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
      [name, email, hashed, role]
    )
    res.status(201).json({ message: 'Usuario creado correctamente' })
  } catch (err) {
    console.error('Error al registrar usuario:', err)
    res.status(500).json({ message: 'Error al registrar usuario' })
  }
})


/**
 * @swagger
 * /api/logout:
 *   post:
 *     summary: Logout de usuario
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *       401:
 *         description: Token no válido
 */
app.post('/api/logout', auth, async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    await pool.query('DELETE FROM usertokens WHERE token = $1', [token]);
    res.json({ message: 'Sesión cerrada correctamente' });
  } catch (err) {
    console.error('Error en logout:', err);
    res.status(500).json({ message: 'Error al cerrar sesión' });
  }
})





// 🚀 Iniciar servidor
app.listen(port, () => {
  console.log(`API corriendo en http://localhost:${port}`)
})
