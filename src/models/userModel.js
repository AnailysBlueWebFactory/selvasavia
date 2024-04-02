const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
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
    const salt = await bcrypt.genSalt(saltRounds);
    // Encriptar la contraseña con el salt
    const hashedPassword = await bcrypt.hash(password, salt);
    //const hashedPassword = await argon2.hash(password);
    /*const hashedPassword = hashPassword(password)
    .then((hashedPassword) => {
      console.log('Contraseña hasheada:', hashedPassword);
    });*/
  
    // Asegúrate de que estas variables coincidan con los campos en tu base de datos
    const query = 'INSERT INTO users (nameUser, emailUser, passwordUser, roleUser) VALUES (?, ?, ?, ?)';
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
  const query = "SELECT * FROM users WHERE roleUser='Admin' AND IsActiveUser=1 LIMIT 1";
  try {
    const [users] = await pool.query(query);
    return users[0].emailUser;
  } catch (error) {
    throw error;
  }
};

const getEmailUserProjectLeader = async (id) => {
  const query = "SELECT u.emailUser FROM users u JOIN calls c ON u.emailUser = c.emailAddress WHERE c.callId = "+id;
  try {
    const [users] = await pool.query(query);
    return users[0];
  } catch (error) {
    throw error;
  }
};

const getDataUserProjectLeader = async (id,campo) => {
  const query = "SELECT "+campo+"  FROM calls  WHERE callId = "+id;

//  console.log(query);
  try {
    const [users] = await pool.query(query);
    return users[0];
  } catch (error) {
    throw error;
  }
};

const isEmailAlreadyTaken = async (email) => {
  const query = "SELECT count(*) AS exist FROM users WHERE emailUser=?";
  const values= [email];

//  console.log(query+" "+values);
  try {
    const [users] = await pool.query(query,values);
    return users[0].exist;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (userId) => {
  const query = 'SELECT idUser, nameUser, emailUser, roleUser, isActiveUser FROM users WHERE idUser = ?';
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
  const salt = await bcrypt.genSalt(saltRounds);
  // Encriptar la contraseña con el salt
  //const hashedPassword = await argon2.hash(password);
  const hashedPassword = await bcrypt.hash(password, salt);
  const query = 'UPDATE users SET nameUser = ?, emailUser = ?, passwordUser = ?, roleUser = ? WHERE idUser = ?';
  const values = [name, email, hashedPassword, role, userId];

  try {
    const [result] = await pool.execute(query, values);

    
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

const deleteUserById = async (userId) => {
  const query = 'UPDATE  users SET IsActiveUser =0 WHERE idUser = ?';
  const values = [userId];

  try {
    const [result] = await pool.execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (email, password) => {
  const query = 'SELECT * FROM users WHERE emailUser = ? AND IsActiveUser = 1';
  const values = [email];

  try {
    const [users] = await pool.query(query, values);
    const user = users[0];

    if (!user) {
      return null; // Usuario no encontrado
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordUser);

    //const passwordMatch = await argon2.hash(password);
    console.log("passwordMatch");
    console.log(passwordMatch);
    
    if (passwordMatch) {      
      // Generar un token con la información del usuario (puedes personalizar la información incluida en el token)
      const token = jwt.sign({ userId: user.idUser, email: user.emailUser, role: user.roleUser }, process.env.JWT_SECRET, { expiresIn: '1d' });
      // Solo incluir los campos deseados en la respuesta
      const responseData = {
        userId: user.idUser,
        name: user.nameUser,
        role: user.roleUser,
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

//Recuperar Password



const generateNewPassword = async (userId) => {
  const newPassword = generateRandomPassword(); // Implementa tu lógica para generar una nueva contraseña
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const query = 'UPDATE users SET passwordUser = ? WHERE idUser = ?';
  const values = [hashedPassword, userId];

  try {
    const [result] = await pool.execute(query, values);
    return result.affectedRows > 0 ? newPassword : null;
  } catch (error) {
    throw error;
  }
};



const generateRandomPassword = () => {
  const length = 7;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  let password = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
  }

  return password;
};


module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  loginUser,
  getAdmin,
  getEmailUserProjectLeader,
  getDataUserProjectLeader,
  generateNewPassword,
  generateRandomPassword,
  isEmailAlreadyTaken
};



   