// Import models
const callModel = require('../models/callsModel');
// Import nodemailer
const nodemailer = require('nodemailer');

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
  const emailSubject = 'Convocation Created Successfully';
  const emailBody = `Your convocation with ID ${callId} has been created successfully.`;

  // Replace 'call.emailCall' with the actual email address field from your call record
  //await sendEmail(emailCall, emailSubject, emailBody);
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
          "message": "Lista de usuarios exitosamente",
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
        "message": "Informacion completa encontrada de la convocatoria con id  "+call.CallId+"",
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
        host: 'your-smtp-host', // Replace with your SMTP server host
        port: 587, // Replace with your SMTP server port
        secure: false, // Set to true if your SMTP server requires a secure connection
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
  createCall,
  getAllCalls,
  getCallById,
  updateStatusCallById,
  sendEmail
};
