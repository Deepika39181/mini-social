import React, { useState } from "react";
import axios from "axios";

function Profile({ user, setUser }) {

const [show,setShow] = useState(false);

const saveProfile = async () => {

try{

await axios.post(
"http://localhost:5000/saveProfile",
{
name:user.name,
userid:user.userid,
number:user.number,
profilePic:user.profilePic
}
);

alert("Profile Saved");

}
catch(err){
console.log(err);
}

};

const handleImage = (e)=>{

const file = e.target.files[0];

if(file){

setUser({
...user,
profilePic:URL.createObjectURL(file)
});

}

};

return (

<div className="profile">

<button
className="menu-btn"
onClick={()=>setShow(!show)}
>
☰
</button>

{
show && (

<div>

<img
src={user.profilePic}
alt=""
width="100"
/>

<input
type="text"
placeholder="Name"
value={user.name}
onChange={(e)=>
setUser({
...user,
name:e.target.value
})
}
/>

<input
type="text"
placeholder="User ID"
value={user.userid}
onChange={(e)=>
setUser({
...user,
userid:e.target.value
})
}
/>

<input
type="text"
placeholder="Phone"
value={user.number}
onChange={(e)=>
setUser({
...user,
number:e.target.value
})
}
/>

<input
type="file"
onChange={handleImage}
/>

<button onClick={saveProfile}>
Save Profile
</button>

</div>

)

}

</div>

);

}

export default Profile;