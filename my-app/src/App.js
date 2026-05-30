import React, { useState } from "react";
import "./App.css";
import Profile from "./components/Profile";
import Feed from "./components/Feed";

function App() {
  const [user, setUser] = useState({
    name: "Your Name",
    userid: "userid",
    number: "+91 0000000000",
    profilePic: "https://via.placeholder.com/100"
  });

  const [posts, setPosts] = useState([]);

  return (
    <div>
      <header>Mini Social Media</header>

      <div className="main">
        <Profile user={user} setUser={setUser} />

        <Feed
          user={user}
          posts={posts}
          setPosts={setPosts}
        />
      </div>
    </div>
  );
}

export default App;