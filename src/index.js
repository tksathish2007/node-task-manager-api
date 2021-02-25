const express = require('express')
require('./db/mongodb.js')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')

const app = express()   
const port = process.env.PORT

app.use(express.json())
app.use(userRouter) // User Routes
app.use(taskRouter) // Task Routes

app.listen(port, ()=> {
    console.info('Server is up on port '+port)
})