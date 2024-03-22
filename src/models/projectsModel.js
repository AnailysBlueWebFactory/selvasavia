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

module.exports = {
  createProject,
};
