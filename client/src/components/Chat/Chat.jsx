import { useEffect, useState } from "react";
import axios from "axios";
import "./Chat.css";

function Chat(){

const [message,setMessage]=useState("");

const [messages,setMessages]=useState([]);

const [receiver,setReceiver]=useState("");

const [friends,setFriends]=useState([]);

const [search,setSearch]=useState("");

const [chatImage,setChatImage]=useState("");

const [chatVideo, setChatVideo] = useState("");

const currentUser =
localStorage.getItem("userid");

/* IMAGE UPLOAD */

const uploadChatImage=(e)=>{
const file=e.target.files[0];
if(!file) return;
const reader=new FileReader();
reader.onloadend=()=>{
setChatImage(reader.result);
};
reader.readAsDataURL(file);
};
const uploadChatVideo = (e)=>{
const file = e.target.files[0];
if(!file) return;
const reader = new FileReader();
reader.onloadend = ()=>{
setChatVideo(
reader.result
);
};
reader.readAsDataURL(file);
};

/* LOAD FRIENDS */

useEffect(()=>{
const loadFriends=async()=>{
try{
const response=
await axios.get(
`http://localhost:5000/friends/${currentUser}`
);
setFriends(response.data);
}
catch(error){
console.log(error);
}
};
loadFriends();
},[currentUser]);



/* LOAD MESSAGES */

useEffect(()=>{
if(!receiver) return;
const loadMessages=async()=>{
const response=
await axios.get(
`http://localhost:5000/messages/${currentUser}/${receiver}`
);
setMessages(response.data);
};
loadMessages();
const interval =
setInterval(loadMessages,2000);
return ()=>clearInterval(interval);
},[receiver,currentUser]);


/* SEND MESSAGE */

const sendMessage=async()=>{
    console.log({
  sender: currentUser,
  receiver: receiver
});
if(
!message.trim() &&
!chatImage &&
!chatVideo
) return;
if(!receiver) return;
try{
await axios.post(
"http://localhost:5000/sendMessage",
{
sender: currentUser,
receiver: receiver.trim(),
message: message,
image: chatImage,
video: chatVideo
}
);
setMessage("");
setChatImage("");
setChatVideo("");
const response=
await axios.get(
`http://localhost:5000/messages/${currentUser}/${receiver}`
);
setMessages(response.data);
}
catch(error){
console.log(error);
}
};



return(

<div className="chat">
<h2>
Messages
</h2>
<div className="searchBox">
<input
type="text"
placeholder="Search Friend"
value={search}
onChange={(e)=>
setSearch(e.target.value)
}
/>

{
search && (
<button
className="clearBtn"
onClick={() => setSearch("")}
>
✕
</button>
)
}
</div>
<div className="chatLayout">
{/* FRIEND LIST */}

<div className={`friendSidebar ${receiver ? "hideMobile" : ""}`}>
{
friends
.filter(
(f)=>f.user2
)
.filter((f)=>
f.user2
.toLowerCase()
.includes(
search.toLowerCase()
)
)
.map((f)=>(
<div

key={f.id}

className="friendCard"

onClick={()=>

setReceiver(f.user2)
}
>
<img
src="https://via.placeholder.com/50"
alt="friend"
/>

<span>
{f.user2}
</span>
</div>
))
}
</div>

{/* CHAT AREA */}

<div className={`chatArea ${receiver ? "showMobile" : ""}`}>

<div className="chatHeader">

<button
className="backBtn"
onClick={() => setReceiver("")}
>
←
</button>
<div className="chatProfile">
<img
src="https://via.placeholder.com/40"
alt=""
/>
<h3 className="chatUser">
{receiver}
</h3>
</div>
</div>
<div className="chatBox">
{
messages.map((msg)=>(
<div
key={msg.id}
className="message"
>
<b>
{msg.sender}
</b>
<p>
{msg.message}
</p>
{
msg.image && (
<a
href={msg.image}
download={`image-${msg.id}.jpg`}
target="_blank"
rel="noreferrer"
>
<img
src={msg.image}
alt=""
className="chatImage"
/>
</a>
)
}
{
msg.video &&
<video
src={msg.video}
controls
className="chatVideo"
/>
}
</div>
))
}
</div>

<div className="sendArea">
<label className="iconBtn">
📷
<input
type="file"
accept="image/*"
onChange={uploadChatImage}
hidden
/>
</label>
<label className="iconBtn">
🎥
<input
type="file"
accept="video/*"
onChange={uploadChatVideo}
hidden
/>
</label>
<input
type="text"
value={message}
placeholder="Type message..."
onChange={(e)=>
setMessage(e.target.value)
}
/>
<button
className="sendBtn"
onClick={sendMessage}
>
➤
</button>
</div>
</div>
</div>
</div>
);
}
export default Chat;