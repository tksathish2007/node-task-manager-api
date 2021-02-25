const sgMail = require('@sendgrid/mail')

const sendgridApiKey = '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' // Is not working

sgMail.setApiKey(sendgridApiKey)

sgMail.send({
    'to'    : 'tksathishtest@gmail.com',
    'from'  : 'tksathishtest@gmail.com',
    subject : 'Send Grip Test Mail',
    text    : 'Send Grip Test Mail'
})