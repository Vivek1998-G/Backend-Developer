import mongoose from "mongoose";
import { Schema } from "mongoose";
export const userSechma= Schema({

Name:{
    type:String,
    required:true
},
phonNumber:
{
    type:Number,
    required:true
},
Age:{
    type:Number,
    required:true
},
adharNumber:{
    type:Number,
    required:true
},
pinCode:{
    type:Number,
    required:true
},
Password:{
    type:String,
    required:true
},
Status:{
    type:String,
},
vaccineDates:{
    firstDose:String,
    secondDose:String
},

})

export const adminSchema = new Schema({
    name: String,
    userName: String,
    password: String
});

export const slotsSchema = new Schema({
    date: String,
    slot: Number,
    users: [String]
});