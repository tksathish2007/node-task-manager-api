require('../db/mongodb.js')
const Task = require('../models/task.js')

// Task.findByIdAndDelete('600fcd9b52794f1c28362b23')
//     .then((task)=>{
//         if(task) console.info(task)
//         else console.info('Task not found')
//         return Task.countDocuments({'completed' : false})
//     })
//     .then((tasks)=>{
//         console.info('In completed tasks - '+tasks)
//         return Task.countDocuments({'completed' : true})
//     })
//     .then((tasks1)=>{
//         console.info('Completed tasks - '+tasks1)
//     })
//     .catch((e) => console.log(e))
    


// Async await
const DeleteTaskAndCount = async (id) => {
    const del   = await Task.findByIdAndDelete(id)
    // console.log(update)
    const InCompleteCount = await Task.countDocuments({'completed' : false})
    const completeCount = await Task.countDocuments({'completed' : true})
    return { 
        InCompleteCount: InCompleteCount, 
        completeCount: completeCount 
    }
}

DeleteTaskAndCount('600fcd9b52794f1c28362b23')
    .then((res) => console.info(res))
    .catch((error) => console.info(error))