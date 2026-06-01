import { useEffect, useState } from "react";
import axios from "axios";
import "./Feed.css";

function Feed() {

const [text, setText] = useState("");

const [posts, setPosts] = useState([]);

const [image, setImage] = useState("");

const [video, setVideo] = useState("");


const currentUser =
localStorage.getItem("userid");



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

// IMAGE UPLOAD

const uploadImage = (e) => {

const file = e.target.files[0];

if(!file) return;

const reader = new FileReader();

reader.onloadend = () => {

setImage(reader.result);

};

reader.readAsDataURL(file);

};




// VIDEO UPLOAD

const uploadVideo = (e) => {

const file = e.target.files[0];

if(!file) return;

const reader = new FileReader();

reader.onloadend = () => {

setVideo(reader.result);

};

reader.readAsDataURL(file);

};




// CREATE POST

const createPost = async () => {

if(!text.trim() && !image && !video) return;

try{

await axios.post(
"http://localhost:5000/createPost",
{
username: currentUser,
postText:text,
image:image,
video:video
}
);

setText("");

setImage("");

setVideo("");

const response = await axios.get(
"http://localhost:5000/posts"
);

setPosts(response.data);

}

catch(error){

console.log(error);

}

};




// DELETE POST

const deletePost = async(id)=>{

try{

await axios.delete(
`http://localhost:5000/delete/${id}`
);

const response = await axios.get(
"http://localhost:5000/posts"
);

setPosts(response.data);

}

catch(error){

console.log(error);

}

};




// LIKE POST

const likePost = async(id)=>{

try{

await axios.put(
`http://localhost:5000/like/${id}`
);

const response = await axios.get(
"http://localhost:5000/posts"
);

setPosts(response.data);

}

catch(error){

console.log(error);

}

};






return(

<div className="sectionBox">

<div className="createPost">

<textarea
value={text}
onChange={(e)=>
setText(e.target.value)
}
placeholder="What's on your mind?"
/>

<div className="sectionBox">

<label>

📷 Upload Photo

</label>

<input
type="file"
accept="image/*"
onChange={uploadImage}
/>



<label>

🎥 Upload Video

</label>

<input
type="file"
accept="video/*"
onChange={uploadVideo}
/>

</div>

<h3>
Welcome {currentUser}
</h3>

<button onClick={createPost}>

Post

</button>

</div>

{

posts.map((post)=>(

<div
key={post.id}
className="post"
>

<h3
className="postUser"
onClick={()=>{
localStorage.setItem(
"viewProfile",
post.username
);

window.location.href="/";
}}
>

{post.username}

</h3>

<p>

{post.postText}

</p>



{

post.image && (

<img
  src={post.image}
  alt=""
  className="postImage"
/>


)

}



{

post.video && (

<video
src={post.video}
controls
width="300"
/>

)

}



<button
onClick={()=>
likePost(post.id)
}
>

❤️ {post.likes}

</button>



<button
onClick={()=>
deletePost(post.id)
}
>

Delete

</button>

</div>

))

}

</div>

);

}

export default Feed;

