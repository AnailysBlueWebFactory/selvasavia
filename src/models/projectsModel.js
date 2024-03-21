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
    challengeCallName,
    challengeLeaderCallName,
    institutionOrganizationCall,
    actorTypeCall,
    emailCall,
    phoneNumberCall,
    contextDescriptionCall,
    specificProblemDescriptionCall,
    challengeFormulaCall,
    requiredResourcesCall,
    invitedParticipantsCall,
    informationSourcesCall,
    observationsCall,
  } = callData;

  // Asegúrate de que estas variables coincidan con los campos en tu base de datos
  const query =
    "INSERT INTO calls  (ChallengeName, ChallengeLeaderName, InstitutionOrganization, ActorType, EmailAddress, PhoneNumber, ContextDescription, SpecificProblemDescription, ChallengeFormula, RequiredResources, InvitedParticipants, InformationSources, Observations, statusCall) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')";
  const values = [
    challengeCallName,
    challengeLeaderCallName,
    institutionOrganizationCall,
    actorTypeCall,
    emailCall,
    phoneNumberCall,
    contextDescriptionCall,
    specificProblemDescriptionCall,
    challengeFormulaCall,
    requiredResourcesCall,
    invitedParticipantsCall,
    informationSourcesCall,
    observationsCall,
  ];

  try {
    const [result] = await pool.query(query, values);
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createProject,
};
