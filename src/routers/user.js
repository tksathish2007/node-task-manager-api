const express = require('express')
const multer = require('multer')
const router = new express.Router()
const User = require('../models/user.js')
const auth = require('../middleware/auth')
const sharp = require('sharp')

router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch(e) {
        res.status(500).send({'error' : e.message || e})
    }

    // User.find({})
    //     .then((users)=>{ res.send(users) })
    //     .catch((error)=>{ res.status(400).send({'error' : error.message}) })
})
router.post('/users/login', async (req, res) => {
    try {
        const user  = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e) {
        res.status(500).send({'error' : e.message || e})
    }
})
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send({'msg' : 'Logout Successfully'})
    } catch(e) {
        res.status(500).send({'error' : e.message || e})
    }
})
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send({'msg' : 'Logout from all devices successfully'})
    } catch(e) {
        res.status(500).send({'error' : e.message || e})
    }
})
router.get('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findById(req.params.id)
        // if(!user) 
        //     return res.status(404).send({error :'User not found'})
            
        res.send(req.user) 
    } catch(e) {
        res.status(500).send({'error' : e.message || e})
    }

    // User.findById(req.params.id)
    //     // .findOne({_id : new Object(req.params.id)})
    //     .then((user)=>{ 
    //         if(!user) return res.status(404).send({error :'User not found'})
    //         res.send(user) 
    //     })
    //     .catch((error)=>{ res.status(400).send({'error' : error.message}) })
})
router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()

        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e) {
        res.status(400).send({'error' : e.message || e})
    }

    // console.table(req.body)
    // res.send('Testing')
    // const user = new User(req.body)
    // user.save()
    //     .then(()=>{ res.send(user) })
    //     .catch((error)=>{ res.status(400).send({'error' : error.message}) })
})
router.patch('/users/me', auth, async (req, res) => {
    const requests = Object.keys(req.body)
    const allowedKeys = ["name", "password", "age", "email"]
    const isValidReq = requests.every((request) => allowedKeys.includes(request))

    if(!isValidReq) 
        return res.status(400).send({error: 'Invalid request'})

    try {
        // const user = await User.findByIdAndUpdate(
        //     req.params.id,
        //     req.body,
        //     {new: true, runValidators: true})

        const user = await User.findById(req.user.id)
        requests.forEach((request) => {
            user[request] = req.body[request]
        })
        await user.save()

        if(!user) 
            return res.status(404).send({error :'User not found'})
            
        res.send(user) 
    } catch(e) {
        res.status(500).send({'error' : e.message || e})
    }
})
router.delete('/users/me', auth, async (req, res) => {
    try {
        // const user = await User.findByIdAndDelete(req.params.id)
        // if(!user) 
        //     return res.status(404).send({error :'User not found'})
                    
        req.user.remove()
        res.send(req.user) 
    } catch(e) {
        res.status(500).send({'error' : e.message || e})
    }
})

const uploadAvatar = multer({
    // dest : 'images/avatars',
    limits : {
        fileSize : 1000000
    },
    fileFilter(req, file, cb) {
        if(! file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('Please upload png / jpg / jpeg file...'))
        }

        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, uploadAvatar.single('avatar'), async (req, res) => {  
    const buffer = await sharp(req.file.buffer)
        .resize({
            'width' : 300,
            'height' : 200
        })
        .png()
        .toBuffer()       
    req.user.avatar = buffer
    await req.user.save()
    // console.log(req.user.avatar)

    res.send({'message' : 'Avatar uploaded successfully'})
}, (err, req, res, next) => {
    res.status(400).send({'error' : err.message})
})
router.delete('/users/me/avatar', auth, async (req, res) => {
    try {             
        
        if(!req.user.avatar) {
            return res.status(400).send({'message' : 'Avatar not found'})
        }
        
        req.user.avatar = undefined
        await req.user.save()

        res.send(req.user) 
    } catch(e) {
        res.status(500).send({'error' : e.message || e})
    }
})
router.get('/users/me/avatar', auth, async (req, res) => {
    try {             
        if(!req.user.avatar) {
            res.set('Content-Type', 'application/html')
            return res.status(404).send('Avatar not found')
        }
        res.set('Content-Type', 'image/jpg')
        res.send(req.user.avatar) 
    } catch(e) {
        res.status(500).send({'error' : e.message || e})
    }
})

module.exports = router