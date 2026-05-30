import { useEffect,useState } from "react";
import axios from "axios";
import "./FriendList.css";

function FriendList(){

const [friend,setFriend]=useState("");

const [friends,setFriends]=useState([]);



// LOAD

useEffect(()=>{

const loadData=async()=>{

try{

const response=

await axios.get(
"http://localhost:5000/friends"
);

setFriends(
response.data
);

}

catch(error){

console.log(error);

}

};

loadData();

},[]);




// ADD FRIEND

const addFriend=async()=>{

if(!friend.trim()) return;

try{

await axios.post(

"http://localhost:5000/addFriend",

{

user1:"User",

user2:friend

}

);

setFriend("");



const response=

await axios.get(
"http://localhost:5000/friends"
);

setFriends(
response.data
);

}

catch(error){

console.log(error);

}

};




// REMOVE FRIEND

const removeFriend=async(id)=>{

try{

await axios.delete(

`http://localhost:5000/removeFriend/${id}`

);



const response=

await axios.get(
"http://localhost:5000/friends"
);

setFriends(
response.data
);

}

catch(error){

console.log(error);

}

};




return(

<div className="sectionBox">

<h2>

Friends

</h2>



<input

value={friend}

placeholder="Add Friend"

onChange={(e)=>

setFriend(
e.target.value
)

}

/>



<button
onClick={addFriend}
>

Add

</button>



{

friends.map((f)=>(

<div
key={f.id}
className="friend"
>

<span>

{f.user2}

</span>



<button
onClick={()=>

removeFriend(
f.id
)

}
>

Remove

</button>

</div>

))

}

</div>

);

}

export default FriendList;