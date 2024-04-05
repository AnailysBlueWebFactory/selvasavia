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
    //let emailSubject = "";
    let emailBody=`
         <div style="background-color: #f9f9f9">
            <table style="max-width: 600px; width: 100%; margin: auto; background-color: white">
               <tr>
                  <td>
                     <img
                        src="https://api.selvasavia.life/uploads/emailmarketing/header.webp"
                        alt="selva savia"
                        width="100%"
                        style="border-top-right-radius: 40px; border-top-left-radius: 40px"
                     />
                  </td>
               </tr>
               <tbody style="padding-inline: 40px">
                  <tr>
                     <td style="text-align: center">
                        <img src="https://api.selvasavia.life/uploads/emailmarketing/logo.png" alt="selva savia" width="200" style="margin-top: 20px" />
                     </td>
                  </tr>            
                  <tr >
                  <td style="text-align: center; padding-top: 20px ">
                  <p style="font-size: 18px"><strong> Tienes un nuevo aplicante!</strong></p>
                        <p style="line-height: 1.4;  padding: 20px 40px">Estos son los siguientes datos de contacto: <p/> 
                     </td>
                  </tr>
                  <tr>
                     <td style="padding: 20px 40px">                       

                        <p>${fullName}</p>
                        <p>${typeActor}</p>
                        <p>${organization}</p>
                        <p>${cellPhone}</p>
                        <p>${emailApplicant}</p>
                        <p>${becauseInterest}</p>
                        <p>${determineSupport}</p>
                        <p>${relevantInformation}</p>
                        <p>${availabilityProject}</p>
                     </td>
                  </tr>  
                  <tr>
                     <td style="text-align: center; padding-top: 50px">
                        <strong style="font-size: 18px">¡Gracias por formar parte de Selva Savia!</strong>
                     </td>
                  </tr>
               </tbody>
               <tr>
                  <td style="padding-top: 50px; text-align: center">
                     <span
                        style="
                           border-bottom-right-radius: 40px;
                           border-bottom-left-radius: 40px;
                           background-image: url('https://api.selvasavia.life/uploads/emailmarketing/header.webp');
                           background-size: cover;
                           background-position: left;
                           display: block;
                           font-size: 12px;
                           padding: 30px;
                           color: white;
                        "
                     >
                        <a
                           style="color: white; text-decoration: none"
                           href="mailto:info@selvasavia.life"
                           target="_blank"
                           rel="noopener noreferrer"
                           >info@selvasavia.life</a
                        >
                        |
                        <a
                           style="color: white; text-decoration: none"
                           href="https://www.selvasavia.life/"
                           target="_blank"
                           rel="noopener noreferrer"
                           >www.selvasavia.life</a
                        >
                        <br />
                        <a
                           style="color: white; text-decoration: none"
                           href="https://blueprintransformation.com/"
                           target="_blank"
                           rel="noopener noreferrer"
                           >blueprintransformation.com</a
                        >
                        | <span>Derechos Reservados Blue Print Transformation S.A.S. 2024 ®</span>
                     </span>
                  </td>
               </tr>
            </table>
         </div>
   `;


   // console.log(emailBody);
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
      html: body,
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
