const express = require('express')
const router = new express.Router()
const Task = require('../models/task.js')
const auth = require('../middleware/auth')

// GET /tasks?
// completed=true/false | limit | skip
router.get('/tasks', auth, async (req, res) => {
    let match = {}
    let options = {}

    if(req.query.completed) {
        match.completed = req.query.completed==='true'
    } 

    if(req.query.limit) {
        options.limit = parseInt(req.query.limit)
    } 
    if(req.query.skip) {
        options.skip = parseInt(req.query.skip)
    }
    
    if(req.query.sortBy) {
        options.sort = {}
        const parts = req.query.sortBy.split(':')
        options.sort[parts[0]] = parts[1]==='desc' ? -1 : 1
    }

    console.log(match)
    console.log(options)

    try {
        // const tasks = await Task.find({'owner': req.user._id})
        await req.user.populate({
            path : 'tasks',
            match,
            options
        }).execPopulate()
        res.send(req.user.tasks)
    } catch(e) {
        res.status(500).send({'error' : e.message || e})
    }
})
router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({'_id' :req.params.id, 'owner': req.user._id})
        if(!task) 
            return res.status(404).send({error :'Task not found'})
            
        res.send(task) 
    } catch(e) {
        res.status(500).send({'error' : e.message || e})
    }
})
router.post('/tasks', auth, async (req, res) => {
    try {
        // const task = new Task(req.body)
        const task = new Task({
            ...req.body,
            owner: req.user._id
        })
        await task.save()
        res.send(task) 
    } catch(e) {
        res.status(400).send({'error' : e.message || e})
    }
})
router.patch('/tasks/:id', auth, async (req, res) => {
    const requests = Object.keys(req.body)
    const allowedKeys = ["description", "completed"]
    const isValidReq = requests.every((request) => allowedKeys.includes(request))

    if(!isValidReq) 
        return res.status(400).send({error: 'Invalid request'})


    try {
        // const task = await Task.findByIdAndUpdate(
        //     req.params.id,
        //     req.body,
        //     {new: true, runValidators: true})
        const task = await Task.findById(req.params.id)
        requests.forEach((request) => {
            task[request] = req.body[request]
        })
        task.owner = req.user._id
        await task.save()
        if(!task) 
            return res.status(404).send({error :'Task not found'})
            
        res.send(task) 
    } catch(e) {
        res.status(500).send({'error' : e.message || e})
    }
})
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({'_id' :req.params.id, 'owner': req.user._id})
        if(!task) 
            return res.status(404).send({error :'Task not found'})
            
        res.send(task) 
    } catch(e) {
        res.status(500).send({'error' : e.message || e})
    }
})

module.exports = router