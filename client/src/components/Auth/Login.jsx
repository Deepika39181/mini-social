import { useState } from "react";
import axios from "axios";
import "./Login.css";

function Login({setShowSignup,setIsLoggedIn}){

const [userid,setUserid] = useState("");
const [password,setPassword] = useState("");

const login = async()=>{

try{

const response = await axios.post(
"http://localhost:5000/login",
{
userid,
password
}
);

if(response.data === "Invalid"){

alert("Invalid User ID or Password");

}
else{

localStorage.setItem(
"userid",
response.data.userid
);

localStorage.setItem(
"name",
response.data.name
);

setIsLoggedIn(true);

}

}

catch(error){

console.log(error);

}

};

return(

<div className="authContainer">

<h1>Mini Social</h1>

<input
type="text"
placeholder="User ID"
value={userid}
onChange={(e)=>setUserid(e.target.value)}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={login}>
Login
</button>

<p
onClick={()=>
setShowSignup(true)
}
>
Create Account
</p>

</div>

);

}

export default Login;