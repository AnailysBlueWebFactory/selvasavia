const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
const createProject = async (callData) => {
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
  } = callData;

  // Asegúrate de que estas variables coincidan con los campos en tu base de datos
  const query =
    "INSERT INTO projects  (callId, projectContext, issueToResolve, generalObjective, specificObjectives, proposedSolution, beneficiaryPopulation, projectTeamMembers, availableResources, projectInformationSource, projectNotes, projectBenefits) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
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
  ];
  //console.log(query, values);
  try {
    const [result] = await pool.query(query, values);
    return result.insertId;
  } catch (error) {
    throw error;
  }
};


const applicationProyectById = async (req, res) => {
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
    const publicationImage = req.file ? req.file : null;

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
    console.log("applicationProyectById");
    //if (updated) {
    const nameProjectLeader = await userModel.getDataUserProjectLeader(
      callId,
      "challengeLeaderName"
    );
    const emailrojectLeader = await userModel.getDataUserProjectLeader(
      callId,
      "emailAddress"
    );

    let emailSubject = "Tienes un aplicante a una convocatoria";
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
      endpoint: "/projects/applicationProyectById",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createProject,
};
 