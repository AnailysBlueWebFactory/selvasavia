// Import models
const projetsModel = require('../models/projetsModel');
const callModel = require('../models/callsModel');
const userModel = require('../models/userModel');
// Import nodemailer
const nodemailer = require('nodemailer');
const path = require('path');
const slugify = require('slugify');

const createProject = async (req, res) => {
    try {
     
      console.log("createProject");
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
  const callId = await projetsModel.createProject(req.body);

  // After successfully creating the call record, send an email
  const emailSubject = 'Nueva solicitud de convocatoria recibida';
  const emailBody = `¡En hora buena! Acabamos de recibir una solicitud para una convocatoria en SelvaSavia con el ID  ${callId} para ser procesada.`;
  const emailAdmin = await userModel.getAdmin();
  console.log("emailAdmin: "+emailAdmin);
  console.log("emailCall: "+emailCall);
  // Replace 'call.emailCall' with the actual email address field from your call record
 await sendEmail(emailCall, emailSubject, emailBody);
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


  module.exports = {
    createProject
  };