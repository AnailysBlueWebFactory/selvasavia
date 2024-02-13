const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Función para crear un nuevo usuario
const createCall = async (callData) => {
    const { challengeCallName, challengeLeaderCallName, institutionOrganizationCall, actorTypeCall, emailCall, phoneNumberCall, contextDescriptionCall, specificProblemDescriptionCall, challengeFormulaCall, requiredResourcesCall, invitedParticipantsCall, informationSourcesCall, observationsCall  } = callData;
  
    // Asegúrate de que estas variables coincidan con los campos en tu base de datos
    const query = "INSERT INTO calls  (ChallengeName, ChallengeLeaderName, InstitutionOrganization, ActorType, EmailAddress, PhoneNumber, ContextDescription, SpecificProblemDescription, ChallengeFormula, RequiredResources, InvitedParticipants, InformationSources, Observations, StatusCall) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')";
    const values = [ challengeCallName, challengeLeaderCallName, institutionOrganizationCall, actorTypeCall, emailCall, phoneNumberCall, contextDescriptionCall, specificProblemDescriptionCall, challengeFormulaCall, requiredResourcesCall, invitedParticipantsCall, informationSourcesCall, observationsCall ];
  
    try {
      const [result] = await pool.query(query, values);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  };

  const getAllCalls = async () => {
    const query = 'SELECT * FROM Calls';
  
    try {
      const [calls] = await pool.query(query);
      return calls;
    } catch (error) {
      throw error;
    }
  };

  const getCallsByStatus  = async (status) => {
    const query = "SELECT * FROM Calls WHERE  StatusCall = '"+status+"'";
  
    try {
      const [calls] = await pool.query(query);
      return calls;
    } catch (error) {
      throw error;
    }
  };

  const getCallById = async (callId) => {
    const query = 'SELECT * FROM Calls WHERE CallId = ?';
    const values = [callId];
  
    try {
      const [call] = await pool.query(query, values);
      return call[0];
    } catch (error) {
      throw error;
    }
  };


  const updateStatusCallById = async (data) => {
    try {
      const { status, id } = data;
      const query = "UPDATE calls SET StatusCall = ? WHERE CallId = ?";
     
      const [result] = await pool.execute(query, [status, id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  };



module.exports = {
  createCall,
  getAllCalls,
  getCallsByStatus,
  updateStatusCallById,
  getCallById
};



   