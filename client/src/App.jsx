import { useState } from "react";

import "./App.css";

import Profile from "./components/Profile/Profile";

import Feed from "./components/Feed/Feed";

import FriendList from "./components/FriendList/FriendList";

import Chat from "./components/Chat/Chat";

function App(){

const [section,setSection]=useState("profile");

return(

<div className="app">

<div className="navbar">

<h2 className="logo">

Mini Social

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

</div>

</div>



</div>

);

}

export default App;