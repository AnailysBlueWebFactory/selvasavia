const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

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
    const query = "INSERT INTO calls  (ChallengeName, ChallengeLeaderName, InstitutionOrganization, ActorType, EmailAddress, PhoneNumber, ContextDescription, SpecificProblemDescription, ChallengeFormula, RequiredResources, InvitedParticipants, InformationSources, Observations, statusCall) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'New')";
    const values = [ challengeCallName, challengeLeaderCallName, institutionOrganizationCall, actorTypeCall, emailCall, phoneNumberCall, contextDescriptionCall, specificProblemDescriptionCall, challengeFormulaCall, requiredResourcesCall, invitedParticipantsCall, informationSourcesCall, observationsCall ];
  
    try {
      const [result] = await pool.query(query, values);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  };

  const getAllCalls = async () => {
    const query = 'SELECT * FROM calls';
  
    try {
      const [calls] = await pool.query(query);
       // Imprimir el contenido de calls
    //console.log("Contenido de calls:", calls);
      return  calls;
    } catch (error) {
      throw error;
    }
  };

  const getCallsByStatus  = async (status) => {
    const query = "SELECT * FROM calls WHERE  statusCall = '"+status+"'";
  
    try {
      const [calls] = await pool.query(query);
      return calls;
    } catch (error) {
      throw error;
    }
  };

  const getCallById = async (callId) => {
    const query = 'SELECT * FROM calls WHERE CallId = ?';
    const values = [callId];
  
    try {
      const [call] = await pool.query(query, values);
      return call[0];
    } catch (error) {
      throw error;
    }
  };


  const updatestatusCallById = async (data) => {
    try {
      console.log("Has aprobado la solicitud");
      const { status, id } = data;
      const query = "UPDATE calls SET statusCall = ? WHERE CallId = ?";
     
      const [result] = await pool.execute(query, [status, id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  };


// Función para obtener la lista de convocatorias agrupadas por estado y su cantidad
const getCallsGroupedByStatus = async () => {
  const query = `
  SELECT
  s.statusCall,
  COALESCE(COUNT(c.statusCall), 0) as count,
  SUM(COUNT(c.statusCall)) OVER () as total
FROM (
  SELECT 'New' as statusCall, 1 as OrderBy
  UNION SELECT 'Approved', 2
  UNION SELECT 'Rejected', 3
  UNION SELECT 'Publishing', 4
  UNION SELECT 'Open', 5
  UNION SELECT 'Closed', 6
) s
LEFT JOIN calls c ON s.statusCall = c.statusCall
GROUP BY s.statusCall
ORDER BY s.OrderBy;
  `;

  try {
    const [callsGrouped] = await pool.query(query);
    return callsGrouped;
  } catch (error) {
    throw error;
  }
};

//Insertar detalle de la convocatoria Form 3
const insertCallDetails = async (callId, detailsData) => {
  try {
    // Construye la consulta SQL
    const query = `
      UPDATE calls
      SET
        ChallengeAnalysis = ?,
        Identify3Causes = ?,
        Project3Effects = ?,
        PossibleAlternatives = ?,
        GeneralObjective = ?,
        Describe3SpecificObjectives = ?,
        Project3Impacts = ?
      WHERE
        CallId = ?
    `;

    // Valores para la consulta
    const values = [
      detailsData.challengeAnalysis,
      detailsData.identify3Causes,
      detailsData.project3Effects,
      detailsData.possibleAlternatives,
      detailsData.generalObjective,
      detailsData.describe3SpecificObjectives,
      detailsData.project3Impacts,
      callId
    ];

    // Ejecuta la consulta
    const [result] = await pool.query(query, values);

    return result;
  } catch (error) {
    throw error;
  }
};


// Función para actualizar la publicación de una convocatoria
const updatePublicationById = async (data) => {
  try {
    const { callId, publicationTitle, publicationDetail, imagePath } = data;

    // Si publicationImage está presente, guarda la imagen en el directorio del proyecto
    /*if (publicationImage) {
      const imageFileName = `publication_${callId}${path.extname(publicationImage.originalname)}`;
      const imagePath = path.join(__dirname, 'publications', imageFileName);

      await publicationImage.mv(imagePath);
    }*/

    const query = `
      UPDATE calls 
      SET PublicationTitle = ?, PublicationDetail = ?, PublicationImage = ?, StatusCall='Open'
      WHERE CallId = ?;
    `;

    const values = [publicationTitle, publicationDetail, imagePath, callId];

    const [result] = await pool.execute(query, values);
    return result.affectedRows > 0;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createCall,
  getAllCalls,
  getCallsByStatus,
  updatestatusCallById,
  getCallById,
  getCallsGroupedByStatus,
  insertCallDetails,
  //createPublication
  updatePublicationById,
};



   