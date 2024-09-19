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
app.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Validar que el correo no exista ya en la base de datos
    const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Este email ya está registrado' });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario en la base de datos, incluyendo el campo is_active con valor 1
    const [result] = await pool.query('INSERT INTO users (name, email, password, role, is_active) VALUES (?, ?, ?, ?, 1)', [name, email, hashedPassword, role || 'user']);

    // Generar el token JWT para el usuario registrado, incluyendo el campo `name`
    const token = jwt.sign({ id: result.insertId, email: email, name: name, role: role || 'user' }, secretKey, { expiresIn: '1h' });

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

    // Actualizar la columna is_active a 1
    await pool.query('UPDATE users SET is_active = 1 WHERE id = ?', [user.id]);

    // Generar el token JWT con el rol y el nombre del usuario
    const newToken = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, secretKey, { expiresIn: '1h' });

    // Devolver el nuevo token
    res.json({ token: newToken });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

app.post('/logout', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verificar y decodificar el token JWT
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    // Actualizar la columna is_active a 0
    await pool.query('UPDATE users SET is_active = 0 WHERE id = ?', [userId]);

    res.status(200).json({ message: 'Sesión cerrada correctamente' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
    res.status(500).json({ message: 'Error al cerrar sesión' });
  }
});

// Endpoint para contar los usuarios activos
app.get('/users/active/count', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS activeUsers FROM users WHERE is_active = 1');
    const activeUsers = rows[0].activeUsers;

    res.status(200).json({ activeUsers });
  } catch (error) {
    console.error('Error al obtener el número de usuarios activos:', error.message);
    res.status(500).json({ message: 'Error al obtener el número de usuarios activos' });
  }
});

// Endpoint para contar los usuarios inactivos
app.get('/users/inactive/count', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS inactiveUsers FROM users WHERE is_active = 0');
    const inactiveUsers = rows[0].inactiveUsers;

    res.status(200).json({ inactiveUsers });
  } catch (error) {
    console.error('Error al obtener el número de usuarios inactivos:', error.message);
    res.status(500).json({ message: 'Error al obtener el número de usuarios inactivos' });
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

// Ruta para contar los referidos pendientes de un usuario autenticado
app.get('/referrals/count-pending', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    // Verificar y decodificar el token JWT
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    // Consultar cuántos referidos están en estado 'Pending' para el usuario autenticado
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS pendingReferrals FROM referrals WHERE referred_by_user_id = ? AND status = "Pending"',
      [userId]
    );

    const pendingReferrals = rows[0].pendingReferrals;
    res.status(200).json({ pendingReferrals });
  } catch (error) {
    console.error('Error al obtener el número de referidos pendientes:', error.message);
    res.status(500).json({ message: 'Error al obtener los referidos pendientes' });
  }
});



app.get('/users/count', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
    const totalUsers = rows[0].totalUsers;

    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error('Error al obtener el número de usuarios:', error.message);
    res.status(500).json({ message: 'Error al obtener el número de usuarios' });
  }
});


app.get('/referral/count', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS totalReferrals FROM referrals');
    const totalReferrals = rows[0].totalReferrals;

    res.status(200).json({ totalReferrals });
  } catch (error) {
    console.error('Error al obtener el número de referidos:', error.message);
    res.status(500).json({ message: 'Error al obtener el número de referidos' });
  }
});


// Endpoint para obtener usuarios con paginación
app.get('/users', async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Página actual, por defecto 1
  const limit = parseInt(req.query.limit) || 5; // Usuarios por página, por defecto 5
  const offset = (page - 1) * limit; // Calcular el desplazamiento (offset)

  try {
    // Obtener el total de usuarios
    const [totalResult] = await pool.query('SELECT COUNT(*) as total FROM users');
    const total = totalResult[0].total;

    // Obtener los usuarios con el límite y el offset (paginación)
    const [rows] = await pool.query('SELECT id, name, email, role FROM users LIMIT ? OFFSET ?', [limit, offset]);

    // Enviar respuesta con los usuarios y el total
    res.status(200).json({
      users: rows,
      total: total,
      page: page,
      limit: limit,
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
});


// Endpoint para actualizar el rol de un usuario
app.put('/users/:id/role', async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  try {
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
});



// Endpoint para obtener los referidos con paginación
app.get('/get-referrals', async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query; // Parámetros de paginación por defecto: página 1, 5 registros por página

    // Calcular el desplazamiento (offset)
    const offset = (page - 1) * limit;

    // Consultar la base de datos para obtener los referidos con el límite y desplazamiento
    const [referrals] = await pool.query(
      'SELECT id, user_id, first_name, last_name, phone_number, email, vehicle_status, vehicle_brand, vehicle_model, referred_by_user_id, status FROM referrals LIMIT ? OFFSET ?',
      [parseInt(limit), parseInt(offset)]
    );

    // Consultar el número total de referidos
    const [countResult] = await pool.query('SELECT COUNT(*) AS total FROM referrals');
    const total = countResult[0].total;

    // Enviar la respuesta con los datos y la información de paginación
    res.status(200).json({
      referrals,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error('Error al obtener los referidos:', error.message);
    res.status(500).json({ message: 'Error al obtener los referidos' });
  }
});


// Ruta para actualizar el estado de un referido
app.put('/referrals/:id/status', async (req, res) => {
  const { id } = req.params; // Obtener el ID del referido desde los parámetros de la URL
  const { status } = req.body; // Obtener el nuevo estado desde el cuerpo de la solicitud

  try {
    // Verificar si el estado es uno de los valores permitidos
    const validStatuses = ['Pending', 'Booked', 'Closed', 'Lost'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    // Actualizar el estado del referido en la base de datos
    const [result] = await pool.query('UPDATE referrals SET status = ? WHERE id = ?', [status, id]);

    // Verificar si se actualizó algún registro
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Referido no encontrado' });
    }

    // Enviar la respuesta de éxito
    res.status(200).json({ message: 'Estado actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el estado del referido:', error);
    res.status(500).json({ message: 'Error al actualizar el estado del referido' });
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


app.get('/referrals/count-closed', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    const [rows] = await pool.query(
      'SELECT COUNT(*) AS closedReferrals FROM referrals WHERE referred_by_user_id = ? AND status = "Closed"',
      [userId]
    );

    const closedReferrals = rows[0].closedReferrals;
    res.status(200).json({ closedReferrals });
  } catch (error) {
    console.error('Error al obtener el número de referidos Closed:', error.message);
    res.status(500).json({ message: 'Error al obtener los referidos Closed' });
  }
});

app.get('/referrals/count-booked', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    const [rows] = await pool.query(
      'SELECT COUNT(*) AS bookedReferrals FROM referrals WHERE referred_by_user_id = ? AND status = "Booked"',
      [userId]
    );

    const bookedReferrals = rows[0].bookedReferrals;
    res.status(200).json({ bookedReferrals });
  } catch (error) {
    console.error('Error al obtener el número de referidos Booked:', error.message);
    res.status(500).json({ message: 'Error al obtener los referidos Booked' });
  }
});



app.get('/referrals/count-lost', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    const [rows] = await pool.query(
      'SELECT COUNT(*) AS lostReferrals FROM referrals WHERE referred_by_user_id = ? AND status = "Lost"',
      [userId]
    );

    const lostReferrals = rows[0].lostReferrals;
    res.status(200).json({ lostReferrals });
  } catch (error) {
    console.error('Error al obtener el número de referidos Lost:', error.message);
    res.status(500).json({ message: 'Error al obtener los referidos Lost' });
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
