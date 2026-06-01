import { useState } from "react";
import axios from "axios";
import "./Signup.css";

function Signup({setShowSignup}){

const [name,setName] = useState("");
const [userid,setUserid] = useState("");
const [phone,setPhone] = useState("");
const [password,setPassword] = useState("");

const signup = async()=>{

try{

const response = await axios.post(
"http://localhost:5000/signup",
{
name,
userid,
phone,
password
}
);

alert(response.data);

setShowSignup(false);

}

catch(error){

console.log(error);

}

};

return(

<div className="authContainer">

<h1>Create Account</h1>

<input
type="text"
placeholder="Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
type="text"
placeholder="User ID"
value={userid}
onChange={(e)=>setUserid(e.target.value)}
/>

<input
type="text"
placeholder="Phone"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={signup}>
Signup
</button>

<p
onClick={()=>
setShowSignup(false)
}
>
Back To Login
</p>

</div>

);

}

export default Signup;