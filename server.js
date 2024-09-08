require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

app.use(express.json());

// Configuración de conexión a MySQL
const pool = mysql.createPool({
    host: 'localhost',    // Cambia a 'localhost' si '127.0.0.1' no funciona
    user: 'root',
    password: '',
    database: 'user_management',
    port: 3308,
  });
  
  
  
  pool.getConnection()
  .then(connection => {
    console.log('Conexión exitosa a la base de datos');
    connection.release();  // Liberar la conexión de vuelta al pool
  })
  .catch(err => {
    console.error('Error de conexión a la base de datos:', err);
  });

  
// Clave secreta para firmar los tokens JWT
const secretKey = process.env.JWT_SECRET;

// Ruta para registrar usuarios nuevos
app.post('/signup', async (req, res) => {
  const { email, password, role } = req.body;

  // Validar que el correo no exista ya en la base de datos
  const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

  if (existingUser.length > 0) {
    return res.status(400).json({ message: 'Este email ya está registrado' });
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insertar el nuevo usuario en la base de datos
  await pool.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, hashedPassword, role || 'user']);

  res.status(201).json({ message: 'Usuario registrado exitosamente' });
});

// Ruta de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Consultar el usuario desde la base de datos
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Verificar la contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    // Generar el token JWT con el rol del usuario
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, secretKey, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// Ruta protegida general (accesible para todos los usuarios autenticados)
app.get('/protected', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    res.json({ message: 'Ruta protegida accedida', user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
});

// Ruta protegida solo para administradores
app.get('/admin', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    // Verificar si el rol del usuario es 'admin'
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado: se requiere rol de administrador' });
    }

    res.json({ message: 'Acceso concedido a administrador' });
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
