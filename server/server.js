require("dotenv").config({ path: "./.env" });


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
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
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
console.log("MYSQL ERROR:",err);
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
"UPDATE users SET name=?, phone=?, profilePic=? WHERE userid=?",
[
name,
phone,
profilePic,
userid
],
(err)=>{
if(err){
res.send(err);
}
else{
res.send("Profile Updated");
}
}
);
});


// SIGNUP

app.post(
"/signup",
(req,res)=>{
const {name,userid,phone,password} = req.body;
db.query(
"SELECT * FROM users WHERE userid=?",
[userid],
(err,result)=>{
if(err){
return res.send(err);
}
if(result.length > 0){
return res.send(
"User ID Already Exists"
);
}
db.query(
"INSERT INTO users(name,userid,phone,password) VALUES(?,?,?,?)",
[name,userid,phone,password],
(err)=>{
if(err){
res.send(err);
}
else{
res.send(
"Account Created"
);
}
}
);
}
);
});

// LOGIN

app.post("/login",(req,res)=>{
const {
userid,
password
} = req.body;
db.query(
"SELECT * FROM users WHERE userid=? AND password=?",
[
userid,
password
],
(err,result)=>{
if(err){
res.send(err);
}
else{
if(result.length>0){
res.send(result[0]);
}
else{
res.send("Invalid");
}
}
}
);
});

// GET PROFILE

app.get(
"/profile/:userid",
(req,res)=>{
const userid =
req.params.userid;
db.query(
"SELECT * FROM users WHERE userid=?",
[userid],
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


app.get(
"/allUsers/:userid",
(req,res)=>{
const userid = req.params.userid;
db.query(
`SELECT userid,name
FROM users
WHERE userid != ?
AND userid NOT IN
(
SELECT user2
FROM friends
WHERE user1 = ?
)`,
[userid, userid],
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
  db.query(
"INSERT INTO notifications(userid,message) VALUES(?,?)",
[
receiver,
`${sender} sent you a message`
]
);
res.send(
"Message Sent"
);
}
}
);
});


app.get(
"/notifications/:userid",
(req,res)=>{
const userid =
req.params.userid;
db.query(
"SELECT * FROM notifications WHERE userid=? ORDER BY createdAt DESC",
[userid],
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

// GET MESSAGES

app.get(
"/messages/:sender/:receiver",
(req,res)=>{
const sender =
req.params.sender;
const receiver =
req.params.receiver;
db.query(
`SELECT * FROM messages
WHERE
(sender=? AND receiver=?)
OR
(sender=? AND receiver=?)
ORDER BY createdAt ASC`,
[
sender,
receiver,
receiver,
sender
],
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
db.query(
"INSERT INTO notifications(userid,message) VALUES(?,?)",
[
user2,
`${user1} added you as a friend`
]
);
res.send(
"Friend Added"
);
}
}
);
});


app.post(
"/follow",
(req,res)=>{
const {
follower,
following
} = req.body;
db.query(
"SELECT * FROM follows WHERE follower=? AND following=?",
[follower,following],
(err,result)=>{
if(result.length>0){
return res.send(
"Already Following"
);
}
db.query(
"INSERT INTO follows(follower,following) VALUES(?,?)",
[follower,following],
(err)=>{
if(err){
res.send(err);
}
else{
res.send(
"Followed"
);
}
}
);
}
);
});


// GET FRIENDS

app.get(
"/friends/:userid",
(req,res)=>{

const userid =
req.params.userid;

db.query(

"SELECT * FROM friends WHERE user1=?",
[userid],
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
