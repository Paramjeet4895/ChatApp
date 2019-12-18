const users = []


const addUser = ({id,username,room}) => {
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()
    
    ///Validate the data//
    if (!username || !room) {
        return {
            error:'Username and Room are required'
        }
    }


    ///Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    ///Validate username//
    if (existingUser) {
        return {
            error:'Username is in use !'
        }
    }

    //Store user
    const user = { id, username, room }
    users.push(user)
    return{user}
}


const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    
    if (index !== -1) {
        return users.splice(index,1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
} 

const getUsersInRoom = (room) => {
    return users.filter((user)=>user.room === room)
}



module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}





// ///TRIM///
// addUser({
//     id: 1,
//     username: "            Param",
//     room:"1"
// })

// addUser({
//     id: 2,
//     username: "            Kamal",
//     room: "1"
// })
// addUser({
//     id: 3,
//     username: "            Doggu",
//     room: "2"
// })
// addUser({
//     id: 4,
//     username: "            Dogjlkjlgu",
//     room: "1"
// })
// addUser({
//     id: 5,
//     username: "            Dogjlkjlgu",
//     room: "2"
// })

// console.log(users)
// const user = getUser(5)
// console.log("uustrt",user)


// const userList = getUsersInRoom('2')
// console.log(userList)
// /*******************/

// // ////////REQUIRED//////////
// // const res = addUser({
// //     id: 1,
// //     username: "   ",
// //     room: "1" 
// // })

// // console.log(res)
// // /***********************/


// // ////////SAME NAME//////////
// // const res1 = addUser({
// //     id: 1,
// //     username: " PAram  ",
// //     room: "1"
// // })

// // console.log(res1)
// // /***********************/


// // const removedUser = removeUser(1)
// // console.log(removedUser)
// // console.log(users)



