import { useState } from "react";

import "./App.css";

import Notifications from "./components/Notifications/Notifications";

import Profile from "./components/Profile/Profile";

import Feed from "./components/Feed/Feed";

import FriendList from "./components/FriendList/FriendList";

import Chat from "./components/Chat/Chat";

import Login from "./components/Auth/Login";

import Signup from "./components/Auth/Signup";

function App(){

const [section,setSection]=useState("profile");

const [isLoggedIn,setIsLoggedIn] = useState(
localStorage.getItem("userid") ? true : false
);

const [showSignup,setShowSignup] = useState(false);

if(!isLoggedIn){

return showSignup
? <Signup
setShowSignup={setShowSignup}
setIsLoggedIn={setIsLoggedIn}
/>
: <Login
setShowSignup={setShowSignup}
setIsLoggedIn={setIsLoggedIn}
/>;

}

return(


<div className="app">

<div className="navbar">

<h2 className="logo">

Mini Social
<p className="currentUser">
👤 {localStorage.getItem("userid")}
</p>

</h2>



<button
onClick={()=>
setSection("profile")
}
>
👤 Profile
</button>



<button
onClick={()=>
setSection("posts")
}
>
📝 Posts
</button>



<button
onClick={()=>
setSection("friends")
}
>
👥 Friends
</button>



<button
onClick={()=>
setSection("chat")
}
>
💬 Messages
</button>
<button
onClick={()=>
setSection("notifications")
}
>
🔔 Notifications
</button>
<button
onClick={()=>{
localStorage.clear();
window.location.reload();
}}
>
🚪 Logout
</button>

</div>




<div className="content">

<div className="layout">

{
section==="profile" && <Profile />
}

{
section==="posts" && <Feed />
}

{
section==="friends" && <FriendList />
}

{
section==="chat" && <Chat />
}
{
section==="notifications" &&
<Notifications />
}

</div>

</div>



</div>

);

}

export default App;