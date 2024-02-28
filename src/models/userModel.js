const mysql = require('mysql2/promise');
//const bcrypt = require('bcrypt');
const argon2 = require('argon2');
const dotenv = require('dotenv');
// userModel.js
const jwt = require('jsonwebtoken');




dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para crear un nuevo usuario
const createUser = async (userData) => {
    const { name, email, password, role } = userData;
  
    // Generar un salt (valor aleatorio) para la contraseña
    const saltRounds = 10;
    //const salt = await bcrypt.genSalt(saltRounds);
  
    // Encriptar la contraseña con el salt
    //const hashedPassword = await bcrypt.hash(password, salt);
    const hashedPassword = await argon2.hash(password);
    /*const hashedPassword = hashPassword(password)
    .then((hashedPassword) => {
      console.log('Contraseña hasheada:', hashedPassword);
    });*/
  
    // Asegúrate de que estas variables coincidan con los campos en tu base de datos
    const query = 'INSERT INTO users (NameUser, EmailUser, PasswordUser, RoleUser) VALUES (?, ?, ?, ?)';
    const values = [name, email, hashedPassword, role];
  
    try {
      const [result] = await pool.query(query, values);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  };

const getAllUsers = async () => {
  const query = 'SELECT * FROM users';

  try {
    const [users] = await pool.query(query);
    return users;
  } catch (error) {
    throw error;
  }
};

const getAdmin = async () => {
  const query = "SELECT * FROM users WHERE RoleUser='Admin' AND IsActiveUser=1 LIMIT 1";
  try {
    const [users] = await pool.query(query);
    return users[0].EmailUser;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (userId) => {
  const query = 'SELECT * FROM users WHERE IdUser = ?';
  const values = [userId];

  try {
    const [user] = await pool.query(query, values);
    return user[0];
  } catch (error) {
    throw error;
  }
};

const updateUserById = async (updatedUserData) => {
  const { name, email, password, role, userId } = updatedUserData;
  // Generar un salt (valor aleatorio) para la contraseña
  const saltRounds = 10;
 //const salt = await bcrypt.genSalt(saltRounds);
  // Encriptar la contraseña con el salt
  const hashedPassword = await argon2.hash(password);
  //const hashedPassword = await bcrypt.hash(password, salt);
  const query = 'UPDATE users SET NameUser = ?, EmailUser = ?, PasswordUser = ?, RoleUser = ? WHERE IdUser = ?';
  const values = [name, email, hashedPassword, role, userId];

  try {
    const [result] = await pool.execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

const deleteUserById = async (userId) => {
  const query = 'UPDATE  users SET IsActiveUser =0 WHERE IdUser = ?';
  const values = [userId];

  try {
    const [result] = await pool.execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (email, password) => {
  const query = 'SELECT * FROM users WHERE EmailUser = ? AND IsActiveUser = 1';
  const values = [email];

  try {
    const [users] = await pool.query(query, values);
    const user = users[0];

    if (!user) {
      return null; // Usuario no encontrado
    }

    //const passwordMatch = await bcrypt.compare(password, user.PasswordUser);

    const passwordMatch = await argon2.hash(password);
    
    if (passwordMatch) {      
      // Generar un token con la información del usuario (puedes personalizar la información incluida en el token)
      const token = jwt.sign({ userId: user.IdUser, email: user.EmailUser, role: user.RoleUser }, process.env.JWT_SECRET, { expiresIn: '1h' });
      // Solo incluir los campos deseados en la respuesta
      const responseData = {
        userId: user.IdUser,
        name: user.NameUser,
        role: user.RoleUser,
        token: token
      };
      return { responseData };
    } else {
      return null; // Contraseña incorrecta
    }
  } catch (error) {
    throw error;
  }
};


module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  loginUser,
  getAdmin
};



   