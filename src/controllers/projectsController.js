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
      projectContext,
      issueToResolve,
      generalObjective,
      specificObjectives,
      proposedSolution,
      beneficiaryPopulation,
      projectTeamMembers,
      availableResources,
      projectInformationSource,
      projectNotes,
      projectBenefits
    } = req.body;
    const projectId = await projectsModel.createProject(req.body);
    //let emailCall = "anailys.rodriguez@gmail.com";
    // After successfully creating the call record, send an email
   // const emailSubject = "Nueva solicitud de convocatoria recibida";
    //const emailBody = `¡En hora buena! Acabamos de recibir una solicitud para una convocatoria en SelvaSavia con el ID  ${callId} para ser procesada.`;
   // const emailAdmin = await userModel.getAdmin();
    //console.log("emailCall: " + emailCall);
    // Replace 'call.emailCall' with the actual email address field from your call record
    //await sendEmail(emailCall, emailSubject, emailBody);
    res.status(201).json({
      status: "success",
      data: {
        projectId: projectId,
      },
      message: "Haz creado un nuevo proyecto exitosamente",
      code: 200,
      endpoint: "/projects/createProject",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const applicationProjectById = async (req, res) => {
  //console.log("req.body: "+req.body);
  try {
    const {
      callId,
      fullName,
      emailApplicant,
      cellPhone,
      typeActor,
      organization,
      becauseInterest,
      determineSupport,
      relevantInformation,
      availabilityProject,
    } = req.body;
    //const publicationImage = req.file ? req.file : null;

    // Verifica si todos los parámetros necesarios están definidos
    if (
      !callId ||
      !fullName ||
      !emailApplicant ||
      !cellPhone ||
      !typeActor ||
      !organization ||
      !becauseInterest ||
      !determineSupport ||
      !relevantInformation ||
      !availabilityProject
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Se requieren los campos callId, fullName, typeActor,organization, becauseInterest, determineSupport, relevantInformation y availabilityProject",
        code: 400,
      });
    }
    console.log("applicationProjectById");
    //if (updated) {
    const nameProjectLeader = await userModel.getDataUserProjectLeader(
      callId,
      "challengeLeaderName"
    );
    const emailrojectLeader = await userModel.getDataUserProjectLeader(
      callId,
      "emailAddress"
    );

    let emailSubject = "Tienes un aplicante para tu proyecto";
    let emailBody =
      `Tienes un nievo aplicanste! Cada vez estar más cerca de iniciar tu proyecto en Selvasavia
      estos son los siguientes datos del aplicante:
      Nombre completo: ` +
      fullName +
      `      
      Tipo de Actor: ` +
      typeActor +
      `
      Organización: ` +
      organization +
      `
      Celular: ` +
      cellPhone +
      `
      correo electrónico: ` +
      emailApplicant +
      `
      Descripcon interes del proyecto: ` +
      becauseInterest +
      `
      Consideracion de apoyo: ` +
      determineSupport +
      `
      Información relevante: ` +
      relevantInformation +
      `
      Disponibilidad: ` +
      availabilityProject +
      `
      `;

    console.log(emailBody);
    // Replace 'call.emailCall' with the actual email address field from your call record
    await sendEmail(emailrojectLeader.emailAddress, emailSubject, emailBody);

    res.status(200).json({
      status: "success",
      message: "Aplicación creada exitosamente.",
      code: 200,
      endpoint: "/projects/applicationProjectById",
    });
    /* } else {
      res.status(404).json({ message: 'Convocatoria no encontrada' });
    }*/
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Function to send an email
const sendEmail = async (to, subject, body) => {
  try {
    // Create a nodemailer transporter for SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com", // Replace with your SMTP server host
      port: 465, // Replace with your SMTP server port
      secure: true, // Set to true if your SMTP server requires a secure connection
      auth: {
        user: "info@selvasavia.life", // Replace with your email address
        pass: "SelvaSav1a2024@", // Replace with your email password or an app-specific password
      },
    });

    const mailOptions = {
      from: "info@selvasavia.life", // Replace with your email address
      to: to,
      subject: subject,
      text: body,
    };

    await transporter.sendMail(mailOptions);

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw error;
  }
};


module.exports = {
  createProject,
  applicationProjectById,
  sendEmail
};
