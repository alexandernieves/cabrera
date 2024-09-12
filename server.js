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
const secretKey = process.env.JWT_SECRET || '827d89c49894a0817ba2a74963ae486db9b5329b557eaa123e78731e718754ddc0fdd2034f1f45eef948aaff1b548631c9809d23668d56105c74181bd301411d';

// Ruta para registrar usuarios nuevos
// Ruta para registrar usuarios nuevos y almacenar el token en la tabla 'users'
app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;  // Añadir name aquí

  try {
    // Validar que el correo no exista ya en la base de datos
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Este email ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos, incluyendo el campo 'name'
    const [result] = await pool.query('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, hashedPassword, role || 'user']);

    // Generar el token JWT para el usuario registrado
    const token = jwt.sign({ id: result.insertId, email: email, role: role || 'user' }, secretKey, { expiresIn: '1h' });

    // Almacenar el token en la tabla 'users' en la columna 'token'
    await pool.query('UPDATE users SET token = ? WHERE id = ?', [token, result.insertId]);

    // Devolver el mensaje de éxito junto con el token
    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token: token
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
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

    // Imprimir el token almacenado en la base de datos
    console.log('Token almacenado en la base de datos:', user.token);

    // Generar el token JWT con el rol del usuario
    const newToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, secretKey, { expiresIn: '1h' });

    // Devolver el nuevo token
    res.json({ token: newToken });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});


// Ruta para obtener los referidos de un usuario autenticado
app.get('/user/referrals', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verificar y decodificar el token JWT
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    // Consultar los referidos del usuario autenticado
    const [rows] = await pool.query(
      'SELECT first_name, last_name, phone_number, email, vehicle_status, vehicle_brand, vehicle_model, status FROM referrals WHERE referred_by_user_id = ?', 
      [userId]
    );

    if (rows.length === 0) {
      return res.status(200).json({ message: 'No referrals found', referrals: [] });
    }

    res.status(200).json({ referrals: rows });
  } catch (error) {
    console.error('Error al obtener los referidos:', error.message);
    res.status(500).json({ message: 'Error al obtener los referidos' });
  }
});


app.post('/referrals', async (req, res) => {
  const { first_name, last_name, phone_number, email, vehicle_status, vehicle_brand, vehicle_model, referred_by_user_id, status } = req.body;

  try {
    const [result] = await pool.query(
      'INSERT INTO referrals (user_id, first_name, last_name, phone_number, email, vehicle_status, vehicle_brand, vehicle_model, referred_by_user_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [referred_by_user_id, first_name, last_name, phone_number, email, vehicle_status, vehicle_brand, vehicle_model, referred_by_user_id, status]
    );

    res.status(201).json({ message: 'Referral saved successfully', referralId: result.insertId });
  } catch (error) {
    console.error('Error saving referral:', error.message);
    res.status(500).json({ message: `Failed to save referral: ${error.message}` });
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

// Ruta para contar los referidos de un usuario autenticado
app.get('/referrals/count', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verificar y decodificar el token JWT
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    // Consultar cuántos referidos tiene el usuario autenticado
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS total_referrals FROM referrals WHERE referred_by_user_id = ?', 
      [userId]
    );

    const totalReferrals = rows[0].total_referrals;
    res.status(200).json({ totalReferrals });
  } catch (error) {
    console.error('Error al obtener el número de referidos:', error.message);
    res.status(500).json({ message: 'Error al obtener el número de referidos' });
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
