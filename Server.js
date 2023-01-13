import express from 'express';
import mongoose from 'mongoose';
const { Schema } = mongoose;
import { userSechma } from './dbModel.js'
import { adminSchema } from './dbModel.js';
import { slotsSchema } from './dbModel.js';
import Corse from 'cors'

const app = express()
const PORT = process.env.PORT || 9000;
const connect_url = "mongodb+srv://Vaccination:Vivek1234@cluster0.pwozf2l.mongodb.net/?retryWrites=true&w=majority";
app.use(express.json())
app.use(Corse())

let date_ob = new Date();
let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let mainDate = date + "-" + month + "-" + year

let doseDate


const AdminList = mongoose.model("AdminList", adminSchema);
const User = mongoose.model('User', userSechma);
const SlotsList = mongoose.model("SlotsList", slotsSchema);

mongoose.set('strictQuery', true)
mongoose.connect(connect_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("DB connected");
    })
    .catch((err) => console.log(`DB connection Err`, err));


app.get("/registerAdmin", (req, res) => {
    let item = new AdminList({
        name: "vivek",
        userName: "Adminvivek",
        password: "12345"
    });
    AdminList.insertMany([item], function (err) {
        if (err) {
            console.log(err)
        } else {
            console.log("admin added");
        }
    });
    res.send("admin added")

});


app.post('/user', (req, res) => {
    const dbData = req.body
    const name = req.body.Name
    const phoneNumber = "" + req.body.phonNumber
    const aadharNumber = "" + req.body.adharNumber
    const pincode = "" + req.body.pinCode
    const password = "" + req.body.Password

    if (name.length <= 2 || phoneNumber.length !== 10 || pincode.length !== 6 || aadharNumber.length !== 12 || password.length <= 4) {
        res.send("sorry invalid inputs")
    }

    User.find({ adharNumber: aadharNumber }, (err, result) => {
        if (err) throw err
        if (result.length == 0) {
            User.insertMany([dbData], function (err) {
                if (err) {
                    console.log(err)
                } else {
                    console.log("User added");
                    res.send("user added successfully")
                }
            });
           
        } else {
            res.send("user already exist, try to login")
        }
    })

})

app.get('/user', (req, res) => {
    User.find((err, data) => {
        if (err) {
            res.send(500).res.send(err)
        }
        res.send(data)
    })
})

app.post('/login/user/:phonNumber/:Password', async (req, res) => {
    const Phone = req.params.phonNumber
    const password = req.params.Password

    User.find({ phonNumber: Phone, Password: password }, (err, data) => {
        if (err) {
            res.send(500).res.send(err)
        }

        if (data.length == 0) {
            res.send("User Not Found ")
        }
        else {
            res.send("Login Successfully")

        }
    })
})

app.get('/login/user/:Number', async (req, res) => {
    const phone = req.params.Number
    console.log(phone)
    const result = await User.findOne({ "phonNumber": phone })
    res.send(result)
    console.log(result)
})

app.put('/login/user/:Number', async (req, res) => {

    const userNum = req.params.Number
    const date1 = mainDate
    const query = { "phonNumber": userNum }
    const useData = await User.findOne({ "phonNumber": userNum })

    const vaccindate = useData.vaccineDates.firstDose
    let date2 = new Date(vaccindate);


    if (useData.Status == "1st dose complited") {

        const result = await User.updateOne(query, { "Status": "All Dose Complitedd", "vaccineDates": { "secondDose": doseDate } })
        res.status(result)

    }
    else {
        const result = await User.updateOne(query, { "Status": "1st dose complited", "vaccineDates": { "firstDose": doseDate } })

        res.status(result)
    }

})

app.get("/availableSlots/date/:day", (req, res) => {
    const day  = req.params.day;
    let year = 2021
    let month = "06"

    const date = new Date(year, month, day, 10, 0)
    let slots = []
    SlotsList.find({ date: month + "/" + day + "/" + year }, (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            for (let i = 0; i < 14; i++) {
                let val = date.toLocaleTimeString();
                date.setMinutes(date.getMinutes() + 30)
                slots.push({
                    "slot": i + 1,
                    "time": val + "-" + date.toLocaleTimeString(),
                    "available": 10
                })
            }
            res.send({
                date: day + "/" + month + "/" + year,
                slots: slots
            })
        } else {

            for (let i = 0; i < 14; i++) {
                let val = date.toLocaleTimeString();
                date.setMinutes(date.getMinutes() + 30)
                let availableSlot = result.find(item => item.slot === i + 1);
                slots.push({
                    "slot": i + 1,
                    "time": val + " - " + date.toLocaleTimeString(),
                    "available": availableSlot ? 10 - availableSlot.users.length : 10
                })
            }
            res.send({
                date: month + "/" + day + "/" + year,
                slots: slots
            })
        }

    })

})

app.get("/bookSlot/:phonNumber/:password/slot/:slotnumber/date/:year-:month-:day", (req, res) => {
    const { year, month, day, phonNumber, password, slotnumber } = req.params;
    if (slotnumber >= 14) {
        
        res.send("invalid slot");
    } else {
        User.find({ phoneNumber: phonNumber, Password: password }, (err, userResult) => {
            if (err) throw err;
            if (userResult.length !== 0) {
                SlotsList.find({ date: month + "/" + day + "/" + year, slot: slotnumber }, (err, slotResult) => {
                    if (err) throw err;
                    if (slotResult.length === 0) {
                        let item = new SlotsList({
                            date:  day + "/" + month + "/" + year,
                            slot: Number(slotnumber),
                            users: [phonNumber]
                        })
                        SlotsList.insertMany([item], (err, result) => {
                            if (err) throw err;
                            console.log("slotbooked");
                            res.send("slotbooked successfully")
                        })
                    } else {
                        if (slotResult[0].users.length > 9) {
                            res.send("selected slote is full")
                        } else {
                            let checkUser = slotResult[0].users.find(item => item === phonNumber);
                            if (checkUser) {
                                res.send("user already in booked this slot")
                            } else {
                                SlotsList.updateOne({ date: month + "/" + day + "/" + year, slot: slotnumber }, { users: [...slotResult[0].users, phonNumber] }, (err, result) => {
                                    if (err) throw err;
                                    doseDate = month + "/" + day + "/" + year
                                    console.log(doseDate);
                                    res.send("slotbooked successfully")
                                })
                            }
                        }

                    }
                })
            } else {
                res.send("user not found")
            }


        })

    }

})


 


app.listen(PORT, console.log("app listen on " + `${PORT}`))

