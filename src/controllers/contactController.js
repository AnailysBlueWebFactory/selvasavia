// Importa nodemailer
const nodemailer = require("nodemailer");

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

// Controlador para manejar el endpoint /contactanos
const contact = async (req, res) => {
    const { name, phone, email, message } = req.body;  
    // Verificar si todos los campos requeridos están presentes
    if (!name || !phone || !email || !message) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
  
    try {
        //const emailBody="nombre: "+name+"telefono: "+phone+" "+message;
        const  emailBody=`
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
           <tr>
              <td style="font-size: 18px; padding: 20px 40px; ">
                 <p style="text-align: center">
                    Hemos recibido información de contacto...
                </p> 
                <br />
                <p>${name} </p>
                <p>${phone} </p>
                <p style="line-height: 1.4;">${message} </p>                 
              </td>
           </tr>
           <tr>
              <td style="text-align: center; padding-top: 20px">
                 <p style="font-size: 18px">
                    Apreciamos tu esfuerzo y tu contribución <br />
                    a nuestra comunidad.
                 </p>
              </td>
           </tr>
        </tbody style="padding-inline: 40px">
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
     
      // Llama a la función sendEmail para enviar el correo electrónico
      await sendEmail(email, "Hemos recibido información de contacto",emailBody);
  
      // Responde con un mensaje de éxito si el correo electrónico se envió correctamente
      //res.status(200).json({ mensaje: 'Mensaje recibido correctamente' });
      res.status(201).json({
        status: "success",
        message: "Mensaje recibido correctamente",
        code: 200,
        endpoint: "/contact/contact",
      });
    } catch (error) {
      // Maneja cualquier error que ocurra durante el envío del correo electrónico
      console.error("Error sending email:", error.message);
      res.status(500).json({ error: 'Ocurrió un error al enviar el correo electrónico' });
    }
  };

module.exports = {
    contact
};
