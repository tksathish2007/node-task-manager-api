const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userSchema = mongoose.Schema({
    'name' : {
        type: String,
        required: true,
        trim: true
    },
    'email' : {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    'password' : {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes('password')) {
                throw new Error('Password can\'t contain "password"')
            }
        }
    },
    'age' : {
        type: Number,
        default: 0,
        validate(value) {
            if(value<0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    'tokens' : [{
        token: {
            type: String,
            required: true
        }
    }],
    'avatar' : {
        type : Buffer
    }
},
{
    timestamps : true
}
)

userSchema.virtual('tasks', {
    'ref' : 'Task',
    'localField' : '_id',
    'foreignField' : 'owner'
})

userSchema.methods.generateAuthToken = async function() {
    const user  = this
    const token = jwt.sign(
        { _id:user._id.toString() }, 
        process.env.JWT_SECRET
    )
    // console.log('token', token)

    user.tokens = user.tokens.concat({ token })
    await user.save()

    return token
}

userSchema.methods.toJSON = function() {
    const user  = this
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    
    return userObject 
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email})
    if(!user) throw new Error('Unable to login')

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) throw new Error('Unable to login')   

    return user
}

userSchema.pre('save', async function (next){
    const user = this
    // console.log('Before saving a user')
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre("remove", async function (next){
    const user = this
    await Task.deleteMany({ owner: user._id })
    return user
})

const User = mongoose.model('User', userSchema)

module.exports = User