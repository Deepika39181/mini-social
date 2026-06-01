import { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

function Profile(){

const [name,setName]=useState("");

const [userid,setUserid]=useState("");

const currentUser =
localStorage.getItem("userid");


const viewedUser =
localStorage.getItem("viewProfile")
|| currentUser;

const [phone,setPhone]=useState("");

const [profilePic,setProfilePic]=useState("");

const [posts,setPosts] = useState([]);

const [selectedPost,setSelectedPost] = useState(null);

const [editMode,setEditMode] = useState(false);

const [activeTab, setActiveTab] = useState("all");

// LOAD PROFILE

useEffect(()=>{
const loadData = async()=>{
try{
const response = await axios.get(
`http://localhost:5000/profile/${viewedUser}`
);
if(response.data.length > 0){
const user = response.data[0];
setName(user.name);
setUserid(user.userid);
setPhone(user.phone);
setProfilePic(user.profilePic);
}
}
catch(error){
console.log(error);
}
};
loadData();
},[viewedUser]);


useEffect(()=>{

const loadPosts = async()=>{

try{

const response = await axios.get(
"http://localhost:5000/posts"
);

setPosts(response.data);

}

catch(error){

console.log(error);

}

};

loadPosts();

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

const followUser = async()=>{

console.log("Follow Clicked");

console.log(
"Current User:",
currentUser
);

console.log(
"Viewed User:",
viewedUser
);

try{

const response = await axios.post(
"http://localhost:5000/follow",
{
follower: currentUser,
following: viewedUser
}
);

console.log(
response.data
);

alert(response.data);

}
catch(error){

console.log(error);

}

};

return(

<>

<div className="profileContainer">

<div className="profileHeader">

<img
className="profilePic"
src={
profilePic
? profilePic
: "https://via.placeholder.com/150"
}
alt="profile"
/>

<div className="profileInfo">
{
viewedUser !== currentUser && (

<button
className="backBtn"
onClick={()=>{
localStorage.removeItem("viewProfile");
window.location.reload();
}}
>
←
</button>

)
}
<h2>{name || "User"}</h2>

<p>@{userid}</p>
<div className="profileButtons">

<button
onClick={()=>
setEditMode(!editMode)
}
>
Edit Profile
</button>

{
currentUser !== viewedUser && (

<button
onClick={followUser}
>
Follow
</button>

)
}

</div>


<div className="stats">

<div>
<b>Posts</b>
<br/>
{
posts.filter(
(post)=>post.username===viewedUser
).length
}
</div>

<div>
<b>Followers</b>
<br/>
0
</div>

<div>
<b>Following</b>
<br/>
0
</div>

</div>



</div>

</div>
{editMode && (
<div className="editSection">

<input
type="file"
onChange={uploadImage}
/>

<input
value={name}
placeholder="Name"
onChange={(e)=>setName(e.target.value)}
/>

<input
value={userid}
placeholder="User ID"
onChange={(e)=>setUserid(e.target.value)}
/>

<input
value={phone}
placeholder="Phone"
onChange={(e)=>setPhone(e.target.value)}
/>
<button
onClick={saveProfile}
>
Save Profile
</button>

</div>

)}


<div className="profilePosts">

<div className="postTabs">

<button
onClick={()=>setActiveTab("all")}
>
🔳
</button>

<button
onClick={()=>setActiveTab("image")}
>
🖼️
</button>

<button
onClick={()=>setActiveTab("video")}
>
🎥
</button>

<button
onClick={()=>setActiveTab("text")}
>
📝
</button>

</div>

<div className="postsGrid">
{posts
.filter((post)=>post.username===viewedUser)
.filter((post)=>{
if(activeTab==="image")
return post.image;
if(activeTab==="video")
return post.video;
if(activeTab==="text")
return post.postText && !post.image && !post.video;
return true;
})
.map((post)=>(
<div
key={post.id}
className="gridItem"
>
{post.image && (
<img
src={post.image}
alt=""
onClick={()=>
setSelectedPost(post)
}
/>
)}
{post.video && (
<video
src={post.video}
controls
onClick={()=>
setSelectedPost(post)
}
/>
)}
{post.postText && (
  <p className="postCaption">
    {post.postText}
  </p>
)}
</div>
))}
</div>
</div> 

{selectedPost && (

<div
className="modal"
onClick={()=>
setSelectedPost(null)
}
>

<div
className="modalContent"
onClick={(e)=>
e.stopPropagation()
}
>

<button
className="closeBtn"
onClick={()=>
setSelectedPost(null)
}
>
✕
</button>

{selectedPost.image && (

<img
src={selectedPost.image}
alt=""
className="fullPost"
/>

)}

{selectedPost.video && (

<video
src={selectedPost.video}
controls
className="fullPost"
/>

)}
<p className="modalCaption">
{selectedPost.postText}
</p>

</div>

</div>

)}

</div> {/* profileContainer close */}

</>

);

}

export default Profile;