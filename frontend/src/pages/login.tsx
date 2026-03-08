import { useState } from "react";
import axios from "axios";
import user_urls
 from "../api/user";
function Login() {
  const [user, setUser] = useState({
    email: "",
    password: ""
  });


  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleLogin(){
    try{ 
        const response = await axios.post(user_urls.login, {
            email: user?.email,
            password: user?.password
        })
        localStorage.setItem("token", response.data.access)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        console.log(response.data)

    }catch(err){
        console.log(err)
        throw err
    }
  }

  return (
    <div>
        <input value={user.email} name="email" onChange={handleOnChange}></input>
        <input value={user.password} name="password" onChange={handleOnChange}></input>
        <button onClick={handleLogin}>LOGIN</button>
    </div>
  );
}

export default Login;
