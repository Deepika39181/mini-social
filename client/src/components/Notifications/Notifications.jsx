import { useEffect,useState } from "react";
import axios from "axios";

function Notifications(){

const [notifications,setNotifications] =
useState([]);

const currentUser =
localStorage.getItem("userid");

useEffect(()=>{

const loadNotifications=async()=>{

try{

const response =
await axios.get(
`http://localhost:5000/notifications/${currentUser}`
);

setNotifications(
response.data
);

}
catch(error){

console.log(error);

}

};

loadNotifications();

},[currentUser]);

return(

<div className="sectionBox">

<h2>
🔔 Notifications
</h2>

{
notifications.length===0
?

<p>No Notifications</p>

:

notifications.map((n)=>(

<div
key={n.id}
className="friend"
>

{n.message}

</div>

))
}

</div>

);

}

export default Notifications;