let express = require('express');
const app = express();

let room = [];
let customer = [];
let roomDetails = [];
let customerDetails = [];

app.get('/',(req, res) => {
    res.send('Welcome to Yash Lodge...');
})

app.get('/rooms', (req, res) => {
    res.status(200).json(room);
})

app.get('/roomDetails', (req, res) => {
    res.status(200).json(roomDetails);
})

app.get('/customers', (req, res) => {
    res.status(200).json(customer);
})

app.get('/customerDetails', (req, res) => {
    res.status(200).json(customerDetails);
})

app.post('/detailSetting', (req, res) => {

    for(let i = 0; i < room.length; i++){
        let bookedStatus = 'no';
        let customersName = [];
        let loginDates = [];
        let checkinTime = [];
        let checkOutTime = [];
        for(let j =0; j < customer.length; j++){
            if(room[i].roomId == customer[j].bookedRoomId){
               bookedStatus = 'yes';
               customersName.push(customer[j].customerName);
               loginDates.push(customer[j].loginDate);
               checkinTime.push(customer[j].checkinTime);
               checkOutTime.push(customer[j].checkOutTime); 
            }
        }
        roomDetails.push({
            roomName: room[i].roomName,
            bookedStatus: bookedStatus,
            customersName: customersName,
            loginDates: loginDates,
            checkinTime: checkinTime,
            checkOutTime: checkOutTime

        })
    }


    for(let i = 0; i < customer.length; i++){
        let roomName = '';
        let customerName = '';
        let loginDate = '';
        let checkinTime = '';
        let checkOutTime = '';
        for(let j =0; j < room.length; j++){
            if(customer[i].bookedRoomId == room[j].roomId){
                roomName = room[j].roomName;
                customerName=customer[i].customerName;
                loginDate=customer[i].loginDate;
                checkinTime=customer[i].checkinTime;
                checkOutTime=customer[i].checkOutTime; 
                break;
            }
        }
        customerDetails.push({
            customerName: customerName,
            roomName: roomName,           
            loginDate: loginDate,
            checkinTime: checkinTime,
            checkOutTime: checkOutTime

        })
    }
    res.status(200).json({
        message: 'Done'
    });
})

app.post("/create-room", (req, res) => {
    totalSeats = Math.floor(Math.random() * (6 - 3 + 1)) + 3;
    availableSeats = Math.floor(Math.random() * (parseInt(totalSeats) + parseInt(1)));
    occupiedSeats = totalSeats - availableSeats;

    if(parseInt(totalSeats) < parseInt(5)){
        seatPrice = parseInt(700);
    }
    else{
        seatPrice = parseInt(500);
    }

    room.push({
        roomId: `${room.length + 1}`,
        roomName: `room-${room.length+1}`,
        totalSeats: totalSeats,
        availableSeats: availableSeats,
        occupiedSeats: occupiedSeats,
        seatPrice: seatPrice
    })

    res.status(200).json({
        message: 'Room created.'
    })
})

app.put('/add-customer', (req, res) => {

    let day = new Date();
    let today = day.getDate();
    if(today < 10){
        today = '0' + today;
    }

    let month = day.getMonth();
    if(month < 10){
        month = '0' + month;
    }
    let year = day.getFullYear();

    let minutes = day.getMinutes();
    let hour = day.getHours();

    let loginDate = today + '-' + month + '-' + year;
    let checkinTime = hour + ':' + minutes;
    let checkOutTimeHour = parseInt(hour) + parseInt(1);
    let checkOutTime = checkOutTimeHour + ':' + minutes;

    let assignedRoomNumberChecker = Math.floor(Math.random() * parseInt(room.length)) + 1;   
    let assignedRoom = assignedRoomNumberChecker - 1;
    if(room[assignedRoom].availableSeats == 0){
        
        let isSeatAvailable = 'yes';
        for(let i = 0; i < room.length; i++){
            if(room[i].availableSeats > 0){
                customer.push({
                    customerId: `${customer.length + 1}`,
                    customerName: `Customer-${customer.length + 1}`,
                    bookedRoomId: parseInt(i)+parseInt(1),
                    loginDate: loginDate,
                    checkinTime: checkinTime,
                    checkOutTime: checkOutTime,
                    roomRental: room[i].seatPrice
                })

                room[i].availableSeats = room[i].availableSeats - 1;
                room[i].occupiedSeats = room[i].occupiedSeats + 1;
                isSeatAvailable = 'yes';
                res.status(200).json({
                    message: 'Sorry... No seat is available in the room... We need to assign you a room manually...',
                    messageTwo: 'Congrats. Your seat is booked.'
                })
                break;
            }
            isSeatAvailable = 'no';
        }
        if(isSeatAvailable === 'no'){
            res.status(200).json({
                message: 'Sorry... Right now all seats of all rooms are booked...'
            })
        }
    }
    else if(room[assignedRoom].availableSeats != 0){
        customer.push({
            customerId: `${customer.length + 1}`,
            customerName: `Customer-${customer.length + 1}`,
            bookedRoomId: room[assignedRoom].roomId,
            loginDate: loginDate,
            checkinTime: checkinTime,
            checkOutTime: checkOutTime,
            roomRental: room[assignedRoom].seatPrice
        })

        room[assignedRoom].availableSeats = room[assignedRoom].availableSeats - 1;
        room[assignedRoom].occupiedSeats = room[assignedRoom].occupiedSeats + 1;

        res.status(200).json({
            message: 'Congrats. Your seat is booked.'
        });

    }
})

let port = 3000;
app.listen(port,()=>{
    console.log(`Server started at port ${port}`)
})