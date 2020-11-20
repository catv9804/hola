var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var cors = require('cors');
const creds = require('./config');
const app = express()
app.use(cors())


var transport = {
    host: 'smtp.gmail.com', // Don’t forget to replace with the SMTP host of your provider
    port: 465,
    secure:true,
    auth: {
    user: creds.USER,
    pass: creds.PASS
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Servidor listo para enviar mensaje');
  }
});

router.post('/send', cors(), (req, res, next) => {
  var name = req.body.name
  var email = req.body.email
  var message = req.body.message
  var content = `nombre del contacto: ${name} \nemail : ${email} \nmessage: ${message} `

  var mail = {
    from: name,
    to: 'catv9804@gmail.com',  // Change to email address that you want to receive messages on
    subject: `Nuevo mensaje enviado por nodemailer de ${name}`,
    text: content
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
      res.json({
        status: 'fail'
      })
      console.log("Fallo al enviar")
    } else {
      res.json({
       status: 'success'
      })
      console.log("email enviado")
    }
  })
})


app.use(express.json())
app.use('/', router)
app.listen(8080)