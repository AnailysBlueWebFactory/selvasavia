const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');


  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Acceso no autorizado - Token no proporcionado', code: 401 });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(403).json({ status: 'error', message: 'Acceso no autorizado - Token inválido', code: 403 });
    }

    // Puedes agregar la información del usuario decodificada al objeto `req` para su uso posterior
    req.user = user;

    // Continuar con el siguiente middleware o la ruta
    next();
  });
};

module.exports = authenticateToken;
