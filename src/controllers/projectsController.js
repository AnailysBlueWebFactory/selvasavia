// Import models
const projectsModel = require("../models/projectsModel");
const callModel = require("../models/callsModel");
const userModel = require("../models/userModel");
// Import nodemailer
const nodemailer = require("nodemailer");
const path = require("path");
const slugify = require("slugify");

const createProject = async (req, res) => {
  try {
    console.log("createProject");
    const {
      callId,
      contextDescriptionCall,
      specificProblemDescriptionCall,
      challengeFormulaCall,
      requiredResourcesCall,
      invitedParticipantsCall,
      informationSourcesCall,
      observationsCall,
    } = req.body;
    //const callId = await projectsModel.createProject(req.body);
    let emailCall = "anailys.rodriguez@gmail.com";
    // After successfully creating the call record, send an email
    const emailSubject = "Nueva solicitud de convocatoria recibida";
    const emailBody = `¡En hora buena! Acabamos de recibir una solicitud para una convocatoria en SelvaSavia con el ID  ${callId} para ser procesada.`;
    const emailAdmin = await userModel.getAdmin();
    console.log("emailCall: " + emailCall);
    // Replace 'call.emailCall' with the actual email address field from your call record
    //await sendEmail(emailCall, emailSubject, emailBody);
    res.status(201).json({
      status: "success",
      data: {
        callId: callId,
      },
      message: "Haz creado un nuevo proyecto exitosamente",
      code: 200,
      endpoint: "/projects/createProject",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProject,
};
