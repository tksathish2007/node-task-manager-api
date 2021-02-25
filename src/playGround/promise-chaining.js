require('../db/mongodb.js')
const User = require('../models/user.js')

// User.findByIdAndUpdate('5ff1cac63bd5d104907cf3a8', {'age' : 5})
//     .then((user)=>{
//         console.info(user)
//         return User.countDocuments({'age' : 0})
//     })
//     .then((users)=>{
//         console.info(users)
//     })
//     .catch((e) => console.log(e))
    
// Async await
const updateAgeAndCount = async (id, age, findAge) => {
    const update    = await User.findByIdAndUpdate(id, {age})
    // console.log(update)
    const count     = await User.countDocuments({'age' : findAge})
    // console.log(count)
    return count
}

updateAgeAndCount('5ff1cac63bd5d104907cf3a8', 23, 0)
    .then((res) => console.info(res))
    .catch((error) => console.info(error))