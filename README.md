# Getting Started with Assignment

# Database models
1. UserSchema :- in this model we have save all data of Register user (Mandatory fields: Name, PhoneNumber, Age, Pincode, Aadhar No and also status of Vaccination).

2. AdminSchema :- in this model we have save all data of Admin (UserName & Password).

3. slotsSchema :- in this model we have save all Slots details (Slot number , Slot date ,User that book particular slot).

# API schema

## 1. http://localhost:9000/registerAdmin      // Post Request

-- This API is design for register admin for our app where we manually insert data like userName and Password.

## 2. http://localhost:9000/user       // Post Request

-- This API is design for create User(Register for vaccination drive) using fields like name, PhoneNumber, Age, Pincode, Aadhar Number and also check all mendatory fields insert by User.

## 3. http://localhost:9000/user      // Get Request

--  This API is design for to Get all data of user from database.

## 4. http://localhost:9000/login/user/:phonNumber/:Password    //Post Request

--  This API is design for Login purpose where we pass data of user(Number , Password) in params and check with database where user is valid or not if user is valid then it send back response(data of login user) to user and message like "login successfull" else it send "User not found".

## 5.  http://localhost:9000/login/user/:Number       //Get Request

--  This API is design for fetch data of elected user by using phone number passes through params.

## 6.  http://localhost:9000/login/user/:Number          //Put Request

--  This API is design for Update the Vaccination status by using phone number passes through params. if user is non vaccinated then it update it to 1st dose complited after successfull vaccination.
& if user vaccinated with 1st dose then it update it to all dose complited  after successfull vaccination.

##  http://localhost:9000/availableSlots/date/:year-:month-:day      //Get Request

--  This API is design for to show all avilable slots to user of selected day(date). there is 14 slots in sing day wich of 30 minuts of single slot and there is 10 vaccins in one slot.
--  Here we pass all required data in params like date.

##  http://localhost:9000/bookSlot/:phonNumber/:password/slot/:slotnumber/date/:year-:month-:day     // Get Request
 
--  This API is design for booking slots of selected date. if slots is full then no one can book slot
     Here we pass all data in params and find user from databse using phone number and password then selected slot and date is registerrd for selected user.

 ## All Api's are test using Postamn ##
 
  ## Server
  Server can Start by using " node Server.js " command  or "nodemon Server.js"

 # Mongo db Atlass Credentials

  Username : gawandevivek819@gmail.com
  Password : Vivek@1234

  















