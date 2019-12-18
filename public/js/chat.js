
const socket = io()

// socket.on('countUpdated', (count) => {
//     console.log('The Count just updated',count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//     console.log("Clicked")

//     socket.emit('increment')
// })


//////////////// ELEMENTS//////////////////
////$ is just a convention to make it easier to know that it is an element/////
const $messageForm = document.querySelector('#form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

const $locationbutton = document.querySelector('#send-location')

const $messages = document.querySelector('#messages')

const autoscroll = () => {
    const $newMessage = $messages.lastElementChild
    
    //Height of the new message//
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessagemargin= parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessagemargin
    
    //Visible Height
    const visibleHeight = $messages.offsetHeight
    
    //Height of messages container
    const containerHeight = $messages.scrollHeight

    ///How far i havev scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight
    
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop=$messages.scrollHeight
    }
}


//Template//
const messageTemplate=document.querySelector('#message-template').innerHTML
socket.on('message',(message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username:message.username,
        message: message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})


const $location = document.querySelector('#messages')

const locationTemplate = document.querySelector('#location-template').innerHTML
socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $location.insertAdjacentHTML('beforeend', html)
    autoscroll()
})
 
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})
///Query Options///
const { username,room }=Qs.parse(location.search,{ignoreQueryPrefix:true})



$messageForm.addEventListener('submit', (e) => {
    ////disable
    /////Prevents the default refereshing of browser///
    e.preventDefault()

    ////Disable the form once it has been submitted////
$messageFormButton.setAttribute('disabled','disabled')

    const message = e.target.elements.message.value
    // console.log(message)
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        ////enable
        if (error) {
            return console.log(error)
        }
        console.log('Message delivered.!')
    })
})

$locationbutton.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $locationbutton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position)
        // const lat = position.coords.latitude;
        // const lng = position.coords.longitude;
        // socket.emit('sendLocation', `Latitude:${lat} Longitude:${lng}`)
       
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude:position.coords.longitude
        }, () => {  
                console.log('Location Shared') 
            $locationbutton.removeAttribute('disabled')    
        })

    })
})

socket.emit('join', { username, room }, ( error )=> {
    if (error) {
        alert(error)
        location.href="/"
    }
})