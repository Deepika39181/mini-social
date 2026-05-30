const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json({
limit:"50mb"
}));

app.use(express.urlencoded({
extended:true,
limit:"50mb"
}));



// MYSQL

const db = mysql.createConnection({

host:"localhost",

user:"root",

password:"1963",

database:"minisocial"

});

db.connect((err)=>{

if(err){

console.log(err);

}

else{

console.log(
"MySQL Connected"
);

}

});



// GET POSTS

app.get(
"/posts",
(req,res)=>{

db.query(

"SELECT * FROM posts ORDER BY id DESC",

(err,result)=>{

if(err){

res.send(err);

}

else{

res.send(result);

}

}

);

});




// CREATE POST

app.post(
"/createPost",
(req,res)=>{

const {

username,
postText,
image,
video

}=req.body;

db.query(

"INSERT INTO posts(username,postText,image,video) VALUES(?,?,?,?)",

[

username,
postText,
image,
video

],

(err)=>{

if(err){

console.log(err);

res.send(err);

}

else{

res.send(
"Post Added"
);

}

}

);

});








// DELETE POST

app.delete(
"/delete/:id",
(req,res)=>{

const id=
req.params.id;

db.query(

"DELETE FROM posts WHERE id=?",

[id],

(err)=>{

if(err){

res.send(err);

}

else{

res.send(
"Deleted"
);

}

}

);

});




// LIKE POST

app.put(
"/like/:id",
(req,res)=>{

const id=
req.params.id;

db.query(

"UPDATE posts SET likes=likes+1 WHERE id=?",

[id],

(err)=>{

if(err){

res.send(err);

}

else{

res.send(
"Liked"
);

}

}

);

});




// SAVE PROFILE

app.post(
"/saveProfile",
(req,res)=>{

const {

name,
userid,
phone,
profilePic

}=req.body;

db.query(

"SELECT * FROM users LIMIT 1",

(err,result)=>{

if(err){

res.send(err);

return;

}



// UPDATE

if(result.length>0){

db.query(

"UPDATE users SET name=?, userid=?, phone=?, profilePic=? WHERE id=?",

[

name,
userid,
phone,
profilePic,
result[0].id

],

(err2)=>{

if(err2){

res.send(err2);

}

else{

res.send(
"Profile Updated"
);

}

}

);

}



// INSERT

else{

db.query(

"INSERT INTO users(name,userid,phone,profilePic) VALUES(?,?,?,?)",

[

name,
userid,
phone,
profilePic

],

(err3)=>{

if(err3){

res.send(err3);

}

else{

res.send(
"Profile Saved"
);

}

}

);

}

}

);

});




// GET PROFILE

app.get(
"/profile",
(req,res)=>{

db.query(

"SELECT * FROM users LIMIT 1",

(err,result)=>{

if(err){

res.send(err);

}

else{

res.send(
result
);

}

}

);

});




// SEND MESSAGE

app.post(
"/sendMessage",
(req,res)=>{

const {

sender,
receiver,
message,
image,
video

}=req.body;

db.query(

"INSERT INTO messages(sender,receiver,message,image,video) VALUES(?,?,?,?,?)",

[

sender,
receiver,
message,
image,
video

],

(err,result)=>{

if(err){

console.log(err);

res.send(err);

}

else{

res.send(
"Message Sent"
);

}

}

);

});



// GET MESSAGES

app.get(
"/messages/:friend",
(req,res)=>{

const friend=
req.params.friend;

db.query(

"SELECT * FROM messages WHERE sender='User' AND receiver=? ORDER BY createdAt ASC",

[friend],

(err,result)=>{

if(err){

res.send(err);

}

else{

res.send(
result
);

}

}

);

});



// DELETE MESSAGE

app.delete(
"/deleteMessage/:id",
(req,res)=>{

const id=
req.params.id;

db.query(

"DELETE FROM messages WHERE id=?",

[id],

(err)=>{

if(err){

res.send(err);

}

else{

res.send(
"Message Deleted"
);

}

}

);

});




// ADD FRIEND

app.post(
"/addFriend",
(req,res)=>{

const {

user1,
user2

}=req.body;

db.query(

"INSERT INTO friends(user1,user2) VALUES(?,?)",

[

user1,
user2

],

(err)=>{

if(err){

res.send(err);

}

else{

res.send(
"Friend Added"
);

}

}

);

});




// GET FRIENDS

app.get(
"/friends",
(req,res)=>{

db.query(

"SELECT * FROM friends",

(err,result)=>{

if(err){

res.send(err);

}

else{

res.send(
result
);

}

}

);

});




// REMOVE FRIEND

app.delete(
"/removeFriend/:id",
(req,res)=>{

const id=
req.params.id;

db.query(

"DELETE FROM friends WHERE id=?",

[id],

(err)=>{

if(err){

res.send(err);

}

else{

res.send(
"Friend Removed"
);

}

}

);

});





app.listen(
5000,
()=>{

console.log(
"Server Running"
);

});