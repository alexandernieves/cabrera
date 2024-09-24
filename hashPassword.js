const bcrypt = require('bcryptjs');

const password = '1234567890';  // Contraseña en texto plano
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);

console.log(hashedPassword);  // Muestra la contraseña hasheada
