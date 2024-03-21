const userModel = require('../models/userModel');

const createUser = async (req, res) => {
    try {
     
      console.log("createUser");

      const { name, email, password, role } = req.body;

      // Validar el formato del correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      status: 'error',
      message: 'El formato del correo electrónico no es válido',
      code: 400
    });
  }

  // Validar que el valor de role sea "Admin" o "Project Leader"
  if (role !== 'Admin' && role !== 'Project Leader') {
    return res.status(400).json({
      status: 'error',
      message: 'El valor de "role" debe ser "Admin" o "Project Leader"',
      code: 400
    });
  }
  const userId = await userModel.createUser(req.body);
      res.status(201).json({
        "status": "success",
        "data": {
          "userId": userId
        },
        "message": "El usuario ha sido creado exitosa",
        "code": 200,
        "endpoint": "/users/createUser"
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    console.log("getAllUsers");

    res.status(200).json({
        "status": "success",
        "users": users,
        "message": "Lista de usuarios exitosamente",
        "code": 200,
        "endpoint": "/users/getAllUsers"
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await userModel.getUser
    ById(userId);
    console.log("getUserById");

    if (user) {
      res.status(200).json({
        "status": "success",
        "data": user,
        "message": "Informacion completa encontrada del userId "+userId+"",
        "code": 200,
        "endpoint": "/users/getUserById"
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserById = async (req, res) => {
  const { name, email, password, role, userId} = req.body;   
  try {
    console.log("updateUserById");

    // Verifica si todos los parámetros necesarios están definidos
   if (userId === undefined || name === undefined || email === undefined || password === undefined || role === undefined) {
    return res.status(400).json({
      status: 'error',
      message: 'Todos los parámetros deben estar definidos',
      code: 400
    });
  }

    const updated = await userModel.updateUserById(req.body);
    if (updated) {
      res.status(200).json({
        "status": "success",
        "data": {
          "userId": userId,
          "name":   name,
          "email":  email,
          "role":   role
        },
        "message": "El usuario con ID "+userId+", ha sido actualizado exitosamente.",
        "code": 200,
        "endpoint": "/users/updateUserById"
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUserById = async (req, res) => {
    const { userId } = req.body;
  try {
    console.log("deleteUserById");

    const deleted = await userModel.deleteUserById(userId);
    if (deleted) {
      res.status(200).json({
        "status": "success",
        "data": {
          "userId": userId
        },
        "message": "El usuario con ID "+userId+", ha sido Eliminado exitosamente.",
        "code": 200,
        "endpoint": "/users/deleteUserById"
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("loginUser");

    // Validar el formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'El formato del correo electrónico no es válido',
        code: 400,
      });
    }
    
    const result = await userModel.loginUser(email, password);
    /*console.log("result");
    console.log(result);*/

    if (result) {
      res.status(200).json({
        status: 'success',
        data: result.responseData,        
        message: 'Inicio de sesión exitoso',
        code: 200,
        endpoint: '/users/loginUser',
      });
    } else {
      res.status(401).json({
        status: 'error',
        message: 'Credenciales incorrectas',
        code: 401,
        endpoint: '/users/loginUser',
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateAndSendNewPassword  = async (req, res) => {
  const { userId, userEmail } = req.body;

  try {
    console.log("generateAndSendNewPassword");

    const newPassword = await userModel.generateNewPassword(userId);

    if (newPassword) {
      // Envía el nuevo password por correo electrónico al usuario
      sendEmail(userEmail,"Nuevo Password", newPassword);

      res.status(200).json({
        status: 'success',
        message: 'Nueva contraseña generada y enviada al usuario exitosamente.',
        code: 200,
        endpoint: '/users/generateAndSendNewPassword',
      });
    } else {
      res.status(404).json({ message: 'Usuario no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to send an email
const sendEmail = async (to, subject, body) => {
  try {
    // Create a nodemailer transporter for SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com', // Replace with your SMTP server host
      port: 465 , // Replace with your SMTP server port
      secure: true, // Set to true if your SMTP server requires a secure connection
      auth: {
        user: 'info@selvasavia.life', // Replace with your email address
        pass: 'SelvaSav1a2024@', // Replace with your email password or an app-specific password
      },
    });

    const mailOptions = {
      from: 'info@selvasavia.life', // Replace with your email address
      to: to,
      subject: subject,
      text: body,
    };

    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.message);
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
  generateAndSendNewPassword ,
  sendEmail 
};
