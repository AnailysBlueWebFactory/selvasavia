// Import models
const callModel = require('../models/callsModel');
const userModel = require('../models/userModel');
// Import nodemailer
const nodemailer = require('nodemailer');
const path = require('path');
const slugify = require('slugify');

const getAdmin = async (req, res) => {
  try {
    const users = await userModel.getAdmin();
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

const createCall = async (req, res) => {
    try {
     

      const { challengeCallName, challengeLeaderCallName, institutionOrganizationCall, actorTypeCall, emailCall, phoneNumberCall, contextDescriptionCall, specificProblemDescriptionCall, challengeFormulaCall, requiredResourcesCall, invitedParticipantsCall, informationSourcesCall, observationsCall } = req.body;

      // Validar el formato del correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailCall)) {
    return res.status(400).json({
      status: 'error',
      message: 'El formato del correo electrónico no es válido',
      code: 400,
      "endpoint": "/users/createCall"
    });
  }

  // Validar actorTypeCall
  const VALID_ACTOR_TYPES = ['Student', 'Teacher', 'Entrepreneur', 'Community'];
  if (!VALID_ACTOR_TYPES.includes(actorTypeCall)) {
    return res.status(400).json({
      status: 'error',
      message: 'El valor de actorTypeCall no es válido',
      code: 400,
      "endpoint": "/users/createCall"
    });
  }
  const callId = await callModel.createCall(req.body);

  // After successfully creating the call record, send an email
  const emailSubject = 'Nueva solicitud de convocatoria recibida';
  const emailBody = `¡En hora buena! Acabamos de recibir una solicitud para una convocatoria en SelvaSavia con el ID  ${callId} para ser procesada.`;
  const emailAdmin = await userModel.getAdmin();
  console.log("emailAdmin: "+emailAdmin);
  // Replace 'call.emailCall' with the actual email address field from your call record
 await sendEmail(emailAdmin, emailSubject, emailBody);
      res.status(201).json({
        "status": "success",
        "data": {
          "callId": callId
        },
        "message": "La solicitud a convocatoria ha sido creada exitosamente",
        "code": 200,
        "endpoint": "/calls/createCall"
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const getAllCalls = async (req, res) => {
    try {
      // Obtener el estado opcional del cuerpo de la solicitud JSON
      const { status } = req.body;

      // Obtener todas las convocatorias
      let calls;
      if (status) {
        // Si se proporciona el estado, filtrar por estado
        calls = await callModel.getCallsByStatus(status);
      } else {
        // Si no se proporciona el estado, obtener todas las convocatorias
        calls = await callModel.getAllCalls();
      }
      
      res.status(200).json({
          "status": "success",
          "calls": calls,
          "message": "Lista de convocatorias obtenida exitosamente",
          "code": 200,
          "endpoint": "/calls/getAllCalls"
        });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


  const getCallById = async (req, res) => {
  const { callId } = req.body;
  try {
    const call = await callModel.getCallById(callId);
    if (call) {
      res.status(200).json({
        "status": "success",
        "call": call,
        "message": "Informacion completa encontrada de la convocatoria con id  "+call.callId+"",
        "code": 200,
        "endpoint": "/calls/getCallById"
      });
    } else {
      res.status(404).json({ message: 'Call not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateStatusCallById = async (req, res) => {
  const { status, id } = req.body;
   
  try {
    // Verifica si todos los parámetros necesarios están definidos
   if (status === undefined ) {
    return res.status(400).json({
      status: 'error',
      message: 'Debes definir el nuevo status de la convocatiria id: '+id,
      code: 400
    });
  }

    const updated = await callModel.updateStatusCallById(req.body);
    if (updated) {
      res.status(200).json({
        "status": "success",
        "data": {
          "updated": updated,
          "status": status
        },
        "message": "El usuario con ID "+id+", ha sido actualizado exitosamente.",
        "code": 200,
        "endpoint": "/calls/updateCallById"
      });
    } else {
      res.status(404).json({ message: 'Call not found' });
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
  const getCallsGroupedByStatus = async (req, res) => {
    try {
      // Obtener la lista de convocatorias agrupadas por estado y su cantidad
      const callsGroupedByStatus = await callModel.getCallsGroupedByStatus();
  
      res.status(200).json({
        status: 'success',
        data: {
          callsGroupedByStatus: callsGroupedByStatus.map(({ statusCall, count }) => ({ statusCall, count })),
          total: callsGroupedByStatus[0].total, // Asumiendo que el total está en la primera posición
        },
        message: 'Lista de convocatorias agrupadas por estado exitosamente',
        code: 200,
        endpoint: '/calls/getCallsGroupedByStatus',
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const insertCallDetails = async (req, res) => {
    try {
      const {
        callId,
        callhallengeAnalysis,
        iIdentify3Causes,
        project3Effects,
        possibleAlternatives,
        generalObjective,
        describe3SpecificObjectives,
        project3Impacts
      } = req.body;
  
      // Asegúrate de que el callId y al menos uno de los campos estén presentes
      if (!callId || (!callhallengeAnalysis && iIdentify3Causes && project3Effects &&
        possibleAlternatives && !generalObjective && describe3SpecificObjectives && !project3Impacts)) {
        return res.status(400).json({
          status: 'error',
          message: 'Se requiere el ID de la convocatoria (callId) y al menos uno de los campos del detalle',
          code: 400,
          endpoint: '/calls/insertCallDetails'
        });
      }
  
      // Objeto con los campos a insertar
      const detailsData = {
        callhallengeAnalysis,
        iIdentify3Causes,
        project3Effects,
        possibleAlternatives,
        generalObjective,
        describe3SpecificObjectives,
        project3Impacts
      };
  
      // Llama al modelo para realizar la inserción en la base de datos
      const result = await callModel.insertCallDetails(callId, detailsData);
  
      res.status(201).json({
        status: 'success',
        message: 'Detalles de la convocatoria insertados exitosamente. Formulario3',
        code: 201,
        endpoint: '/calls/insertCallDetails'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Función para actualizar la publicación de una convocatoria
const updatePublicationById = async (req, res) => {
  try {
    const { callId, publicationTitle, publicationDetail } = req.body;
const publicationImage = req.file ? req.file : null;

// Verifica si todos los parámetros necesarios están definidos
if (!callId || !publicationTitle || !publicationDetail || !publicationImage) {
  return res.status(400).json({
    status: 'error',
    message: 'Se requieren los campos callId, PublicationTitle, PublicationDetail y PublicationImage',
    code: 400
  });
}
      // Utilizar slugify para generar un nombre de archivo amigable
   //const nombreArchivoAmigable = slugify(publicationImage.filename, { replacement: '_', lower: true });
     // Utilizar slugify para generar un nombre de archivo amigable
     const nombreArchivo = publicationImage.filename.replace(/\s+/g, '_');

    // Construir ruta absoluta usando path.join
    const rutaAbsoluta = path.join('../uploads', nombreArchivo);

    const imagePath='uploads/'+nombreArchivo;
    const updated = await callModel.updatePublicationById({
      callId,
      publicationTitle,
      publicationDetail,
      imagePath
    });

    if (updated) {
      res.status(200).json({
        status: 'success',
        message: 'La publicación de la convocatoria ha sido creada exitosamente.',
        code: 200,
        endpoint: '/calls/updatePublicationById'
      });
    } else {
      res.status(404).json({ message: 'Convocatoria no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCall,
  getAllCalls,
  getCallById,
  updateStatusCallById,
  sendEmail,
  getCallsGroupedByStatus,
  insertCallDetails,
  updatePublicationById
};
