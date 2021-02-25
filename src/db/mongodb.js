const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(
    process.env.MONGODB_URL, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }
);

// const User = mongoose.model('User', {
//     'name' : {
//         type: String,
//         required: true,
//         trim: true
//     },
//     'email' : {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value) {
//             if(!validator.isEmail(value)) {
//                 throw new Error('Email is invalid')
//             }
//         }
//     },
//     'password' : {
//         type: String,
//         required: true,
//         minlength: 7,
//         trim: true,
//         validate(value) {
//             if(!value.toLowerCase().includes('password')) {
//                 throw new Error('Password can\'t contain "password"')
//             }
//         }
//     },
//     'age' : {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if(value<0) {
//                 throw new Error('Age must be a positive number')
//             }
//         }
//     },
// })

// const Task = mongoose.model('Task', {
//     'description' : {
//         type: String,
//         required: true,
//         trim: true
//     },
//     'completed' : {
//         type: Boolean,
//         default: false
//     }
// })

// const addTask = new Task({
//     'description' : 'new Task'
// })

// addTask.save()
//     .then(()=>{
//         console.log(addTask)
//     })
//     .catch((error)=>{
//         console.log(error)
//     })

// const mongodb       = require('mongodb')
// const MongoClient   = mongodb.MongoClient
// const ObjectID      = mongodb.ObjectID

// const { MongoClient, ObjectID } = require('mongodb')

// const connectionUrl     = 'mongodb://127.0.0.1:27017'
// const databaseName      = 'node-task-manager'

// const id = new ObjectID()
// console.log(id, id.getTimestamp())

// MongoClient.connect(connectionUrl, { useNewUrlParser : true ,useUnifiedTopology: true
// }, (error, client) => {
//     if(error) return console.log('Unable to connect DB')
    
//     console.log('Database connected successfully!')
//     // console.info(client)
//     const db = client.db(databaseName)

//     // db.collection('users').findOne(
//     //     { 
//     //         _id : new ObjectID("5ff1cac63bd5d104907cf3a8") 
//     //     }, 
//     //     (error, user) => {
//     //         if(error) {
//     //             return console.log("Unable to get user")
//     //         }

//     //         return console.log(user)
//     //     }
//     // )

//     // db.collection("users").find({ name: "ddddddddd"  }).toArray((error, users) => {
//     //     console.log(users)
//     // })
// })

 
// =================================== //

// db.collection('users').insertOne({
//     name: 'Sathish',
//     age: 23,
// }, (error, result) => {
//     if(error) {
//         return console.log('Unable to insert user')
//     }

//     console.log(result.ops)
// })

// db.collection('users').insertMany([
//     {
//         name: 'Sasi',
//         age: 24,
//     },
//     {
//         name: 'Kumar',
//         age: 24,
//     }
// ], (error, result) => {
//     if(error) {
//         return console.log('Unable to insert users')
//     }

//     console.log(result.ops)
// })

// db.collection('tasks').insertMany([
//     {
//         description: 'First Task',
//         completed: false,
//     },
//     {
//         description: 'Second Task',
//         completed: false,
//     }
// ], (error, result) => {
//     if(error) {
//         return console.log('Unable to insert users')
//     }

//     console.log(result.ops)
// })
