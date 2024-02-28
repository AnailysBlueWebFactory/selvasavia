const userModel = require('../models/userModel');

const createUser = async (req, res) => {
    try {
     

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
    const user = await userModel.getUserById(userId);
    if (user) {
      res.status(200).json({
        "status": "success",
        "data": {
          "user": user,
          "userId": userId
        },
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
    console.log("result");
    console.log(result);

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

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById, 
  loginUser
};
