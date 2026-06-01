import { useEffect,useState } from "react";
import axios from "axios";
import "./FriendList.css";

function FriendList(){

const [friend,setFriend]=useState("");

const [allUsers,setAllUsers] = useState([]);

const [friends,setFriends]=useState([]);

const currentUser =
localStorage.getItem("userid");

// LOAD

useEffect(()=>{

const loadData=async()=>{

try{

const response =

await axios.get(
`http://localhost:5000/friends/${currentUser}`
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

},[currentUser]);



useEffect(()=>{

const loadUsers = async()=>{

try{

const response =
await axios.get(
`http://localhost:5000/allUsers/${currentUser}`
);

setAllUsers(
response.data
);

}
catch(error){

console.log(error);

}

};

loadUsers();

},[currentUser]);


// ADD FRIEND

const addFriend=async()=>{

if(!friend.trim()) return;

try{

await axios.post(
"http://localhost:5000/addFriend",
{
user1:currentUser,
user2:friend
}
);

setFriend("");



const response=

await axios.get(
`http://localhost:5000/friends/${currentUser}`
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
`http://localhost:5000/friends/${currentUser}`
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

<h3>People You May Know</h3>

{
allUsers.map((user)=>(

<div
key={user.userid}
className="friend"
>

<span>
{user.name} (@{user.userid})
</span>

<button
onClick={async()=>{

await axios.post(
"http://localhost:5000/addFriend",
{
user1: currentUser,
user2: user.userid
}
);

const response =
await axios.get(
`http://localhost:5000/friends/${currentUser}`
);

setFriends(response.data);

}}
>

Add Friend

</button>

</div>

))
}

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