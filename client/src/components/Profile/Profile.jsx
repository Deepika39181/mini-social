import { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

function Profile(){

const [name,setName]=useState("");

const [userid,setUserid]=useState("");

const [phone,setPhone]=useState("");

const [profilePic,setProfilePic]=useState("");



// LOAD PROFILE

useEffect(()=>{

const loadData=async()=>{

try{

const response=

await axios.get(
"http://localhost:5000/profile"
);

if(
response.data.length>0
){

const user=
response.data[0];

setName(
user.name
);

setUserid(
user.userid
);

setPhone(
user.phone
);

setProfilePic(
user.profilePic
);

}

}

catch(error){

console.log(error);

}

};

loadData();

},[]);




// SAVE PROFILE


const saveProfile=async()=>{

if(!profilePic){

alert(
"Select Image First"
);

return;

}

try{

console.log(
profilePic.length
);

await axios.post(

"http://localhost:5000/saveProfile",

{

name,
userid,
phone,
profilePic

}

);

alert(
"Profile Saved"
);

}

catch(error){

console.log(error);

}

};




// IMAGE UPLOAD


// IMAGE UPLOAD

const uploadImage=(e)=>{

const file=e.target.files[0];

if(!file) return;

const reader=new FileReader();

reader.onloadend=()=>{

console.log(
reader.result.length
);

setProfilePic(
reader.result
);

};

reader.readAsDataURL(
file
);

};



return(

<div className="sectionBox">

<img

src={
profilePic
? profilePic
: "https://via.placeholder.com/100"
}

alt="profile"

/>



<input
type="file"
onChange={uploadImage}
/>



<input

value={name}

placeholder="Name"

onChange={(e)=>

setName(
e.target.value
)

}

/>



<input

value={userid}

placeholder="User ID"

onChange={(e)=>

setUserid(
e.target.value
)

}

/>



<input

value={phone}

placeholder="Phone"

onChange={(e)=>

setPhone(
e.target.value
)

}

/>



<button
onClick={saveProfile}
>

Save Profile

</button>

</div>

);

}

export default Profile;