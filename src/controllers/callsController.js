// Import models
const callModel = require('../models/callsModel');
const userModel = require('../models/userModel');
// Import nodemailer
const nodemailer = require('nodemailer');
const path = require('path');
const slugify = require('slugify');

const getAdmin = async (req, res) => {
  try {
    const users = await userModel.getAdmin();
    res.status(200).json({
        "status": "success",
        "users": users,
        "message": "Lista de usuarios exitosamente",
        "code": 200,
        "endpoint": "/users/getAllUsers"
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCall = async (req, res) => {
    try {
     
      console.log("getCallById");
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

  const getAllCalls = async (req, res) => {
    try {
      // Obtener el estado opcional del cuerpo de la solicitud JSON
      const { status } = req.body;
      console.log("getAllCalls");

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
          "message": "Lista de convocatorias obtenida exitosamente",
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
    console.log("getCallById");
    if (call) {
      res.status(200).json({
        "status": "success",
        "call": call,
        "message": "Informacion completa encontrada de la convocatoria con id  "+call.callId+"",
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

  console.log("updateStatusCallById");
   
  try {
    // Verifica si todos los parámetros necesarios están definidos
   if (status === undefined ) {
    return res.status(400).json({
      status: 'error',
      message: 'Debes definir el nuevo status de la convocatiria id: '+id,
      code: 400
    });

    
   }
  if (status === 'Approved' || status === 'Rejected') {
      console.log("status: "+status);
    const nameProjectLeader = await userModel.getDataUserProjectLeader(id,"challengeLeaderName");
    const emailrojectLeader = await userModel.getDataUserProjectLeader(id,"emailAddress");
    const randomPassword = await userModel.generateRandomPassword();
    const userData = {
      name: nameProjectLeader.challengeLeaderName,
      email: emailrojectLeader.emailAddress,
      password: randomPassword,
      role: 'Project Leader'
  };
    const userId = await userModel.createUser(userData);  
    let emailSubject = 'Convocatoria Aprobada';
    let emailBody = `Tu Convocatoria ha sido Aprobada`;
    if (status === 'Rejected' ) {
       emailSubject = 'Convocatoria Rechazada';
       emailBody = `Tu Convocatoria ha sido Rechazada`;
    }
    console.log("status: "+status);
    // Replace 'call.emailCall' with the actual email address field from your call record
    await sendEmail(emailrojectLeader.emailAddress, emailSubject, emailBody);
  }
    const updated = await callModel.updatestatusCallById(req.body);
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
        host: 'smtp.zoho.com', // Replace with your SMTP server host
        port: 465 , // Replace with your SMTP server port
        secure: true, // Set to true if your SMTP server requires a secure connection
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
  
  const getCallsGroupedByStatus = async (req, res) => {
    try {
      // Obtener la lista de convocatorias agrupadas por estado y su cantidad
      const callsGroupedByStatus = await callModel.getCallsGroupedByStatus();

      console.log("getCallsGroupedByStatus");
  
      res.status(200).json({
        status: 'success',
        data: {
          callsGroupedByStatus: callsGroupedByStatus.map(({ statusCall, count }) => ({ statusCall, count })),
          total: callsGroupedByStatus[0].total, // Asumiendo que el total está en la primera posición
        },
        message: 'Lista de convocatorias agrupadas por estado exitosamente',
        code: 200,
        endpoint: '/calls/getCallsGroupedByStatus',
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const insertCallDetails = async (req, res) => {
    try {
      const {
        callId,
        challengeAnalysis,
        identify3Causes,
        project3Effects,
        possibleAlternatives,
        generalObjective,
        describe3SpecificObjectives,
        project3Impacts
      } = req.body;
  
      // Asegúrate de que el callId y al menos uno de los campos estén presentes
      if (!callId || (!challengeAnalysis && identify3Causes && project3Effects &&
        possibleAlternatives && !generalObjective && describe3SpecificObjectives && !project3Impacts)) {
        return res.status(400).json({
          status: 'error',
          message: 'Se requiere el ID de la convocatoria (callId) y al menos uno de los campos del detalle',
          code: 400,
          endpoint: '/calls/insertCallDetails'
        });
      }
  
      // Objeto con los campos a insertar
      const detailsData = {
        challengeAnalysis,
        identify3Causes,
        project3Effects,
        possibleAlternatives,
        generalObjective,
        describe3SpecificObjectives,
        project3Impacts
      };
  
      // Llama al modelo para realizar la inserción en la base de datos
      const result = await callModel.insertCallDetails(callId, detailsData);
  
      res.status(201).json({
        status: 'success',
        message: 'Detalles de la convocatoria insertados exitosamente. Formulario3',
        code: 201,
        endpoint: '/calls/insertCallDetails'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  // Función para actualizar la publicación de una convocatoria
const updatePublicationById = async (req, res) => {
  //console.log("req.body: "+req.body);
  try {
    const { callId, publicationTitle, publicationDetail, category } = req.body;
    const publicationImage = req.file ? req.file : null;

console.log("updatePublicationById");

// Verifica si todos los parámetros necesarios están definidos
if (!callId || !publicationTitle || !publicationDetail || !publicationImage || !category) {
  return res.status(400).json({
    status: 'error',
    message: 'Se requieren los campos callId, publicationTitle, publicationDetail y publicationImage',
    code: 400
  });
}
      // Utilizar slugify para generar un nombre de archivo amigable
   //const nombreArchivoAmigable = slugify(publicationImage.filename, { replacement: '_', lower: true });
     // Utilizar slugify para generar un nombre de archivo amigable
     const nombreArchivo = publicationImage.filename.replace(/\s+/g, '_');

    // Construir ruta absoluta usando path.join
    const rutaAbsoluta = path.join('../uploads', nombreArchivo);

    const imagePath='uploads/'+nombreArchivo;
    const updated = await callModel.updatePublicationById({
      callId,
      publicationTitle,
      publicationDetail,
      category,
      imagePath
    });

    if (updated) {
      const nameProjectLeader = await userModel.getDataUserProjectLeader(callId,"challengeLeaderName");
      const emailrojectLeader = await userModel.getDataUserProjectLeader(callId,"emailAddress");
      
      let emailSubject = 'Convocatoria Publicada';
      let emailBody = `Tu Convocatoria ha sido Publicada`;
      // Replace 'call.emailCall' with the actual email address field from your call record
      await sendEmail(emailrojectLeader.emailAddress, emailSubject, emailBody);
    

      res.status(200).json({
        status: 'success',
        message: 'La publicación de la convocatoria ha sido creada exitosamente.',
        code: 200,
        endpoint: '/calls/updatePublicationById'
      });
    } else {
      res.status(404).json({ message: 'Convocatoria no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

 // Función para actualizar la publicación de una convocatoria
 const applicationCallById = async (req, res) => {
  //console.log("req.body: "+req.body);
  try {
    const { callId, fullName, emailApplicant, cellPhone, organization, becauseInterest,determineSupport,relevantInformation,availabilityProject } = req.body;
const publicationImage = req.file ? req.file : null;

// Verifica si todos los parámetros necesarios están definidos
if (!callId || !fullName || !emailApplicant  || !cellPhone || !organization || !becauseInterest|| !determineSupport || !relevantInformation || !availabilityProject){
  return res.status(400).json({
    status: 'error',
    message: 'Se requieren los campos callId, fullName, organization, becauseInterest, determineSupport, relevantInformation y availabilityProject',
    code: 400
  });
  
}
console.log("applicationCallById");
    //if (updated) {
      const nameProjectLeader = await userModel.getDataUserProjectLeader(callId,"challengeLeaderName");
      const emailrojectLeader = await userModel.getDataUserProjectLeader(callId,"emailAddress");
      
      let emailSubject = 'Tienes un aplicante a una convocatoria';
      let emailBody = `Tienes un nievo aplicanste! Cada vez estar más cerca de iniciar tu proyecto en Selvasavia
      estos son los siguientes datos del aplicante:
      Nombre completo: `+fullName+`      
      Organización: `+organization+`
      Celular: `+cellPhone+`
      correo electrónico: `+emailApplicant+`
      Descripcon interes del proyecto: `+becauseInterest+`
      Consideracion de apoyo: `+determineSupport+`
      Información relevante: `+relevantInformation+`
      Disponibilidad: `+availabilityProject+`
      `;
      // Replace 'call.emailCall' with the actual email address field from your call record
      await sendEmail(emailrojectLeader.emailAddress, emailSubject, emailBody);
    

      res.status(200).json({
        status: 'success',
        message: 'Aplicación creada exitosamente.',
        code: 200,
        endpoint: '/calls/applicationCallById'
      });
   /* } else {
      res.status(404).json({ message: 'Convocatoria no encontrada' });
    }*/
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/*const getAllCallSite = async (req, res) => {
  try {
      // Obtener el parámetro de paginación y el límite de la solicitud
      const { page = 1, limit = 10, category  } = req.query;

      // Convertir a números enteros
      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);

      // Calcular el desplazamiento
      const offset = (pageNumber - 1) * limitNumber;

      // Obtener las convocatorias abiertas
      const openCalls = await callModel.getAllCallSite('open', limitNumber, offset);

      // Obtener las convocatorias cerradas
      const closedCalls = await callModel.getAllCallSite('closed', limitNumber, offset);

      // Combinar las convocatorias abiertas y cerradas
      const allCalls = [...openCalls, ...closedCalls];

      // Enviar una respuesta con las convocatorias combinadas
      res.status(200).json({
          status: 'success',
          calls: allCalls,
          message: 'Lista de convocatorias obtenida exitosamente',
          code: 200,
          endpoint: '/calls/getAllCallSite'
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};
*/

const getAllCallSite = async (req, res) => {
  try {
      // Obtener los parámetros de paginación, estado y categoría de la solicitud
      const { page, limit, status, category } = req.body;
      console.log("getAllCallSite");
      //console.log("page: " + page);
      //console.log("limit: " + limit);

      let pageNumber = 0;
      let limitNumber = 0;
      let offset = 0;
      // Verificar si page y limit son números
      if (!isNaN(page) && !isNaN(limit)) {
        // Convertir a números enteros
         pageNumber = parseInt(page);
         limitNumber = parseInt(limit);

        // Calcular el desplazamiento
        offset = (pageNumber - 1) * limitNumber;
        //console.log("limitNumber: " + limitNumber);
      } else {
        console.error("Error: page o limit no son números válidos.");
      }
      let calls;
      let query = '';
      if (status && category) {
        query = "SELECT callId, category, publicationTitle, publicationDetail, publicationImage, DATE_FORMAT(CreationDate, '%d/%m/%Y') AS creationDate,   statusCall FROM calls WHERE statusCall = '"+status+"' AND category = '"+category+"'";      
          
      } else if (status) {
        query = "SELECT callId, category, publicationTitle, publicationDetail, publicationImage, DATE_FORMAT(CreationDate, '%d/%m/%Y') AS creationDate,  statusCall FROM calls WHERE statusCall = '"+status+"'";      

      } else if (category) {
        query = "SELECT callId, category, publicationTitle, publicationDetail, publicationImage, DATE_FORMAT(CreationDate, '%d/%m/%Y') AS creationDate,  statusCall FROM calls WHERE category = '"+category+"'";      

      } else {
        query = "SELECT callId, category, publicationTitle, publicationDetail, publicationImage, DATE_FORMAT(CreationDate, '%d/%m/%Y') AS creationDate,  statusCall FROM calls ";      

      }

      if (limitNumber ) {
        query += " LIMIT  "+limitNumber;     
          
      }

      calls = await callModel.getAllCallSite(query);

      // Enviar una respuesta con las convocatorias obtenidas
      res.status(200).json({
          status: 'success',
          calls: calls,
          message: 'Lista de convocatorias obtenida exitosamente',
          code: 200,
          endpoint: '/calls/getAllCallSite'
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};


module.exports = {
  createCall,
  getAllCalls,
  getCallById,
  updateStatusCallById,
  sendEmail,
  getCallsGroupedByStatus,
  insertCallDetails,
  updatePublicationById,
  applicationCallById,
  getAllCallSite
};
