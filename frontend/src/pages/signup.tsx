import { useState } from "react"
import user_urls from "../api/user";
import axios from "axios";

function Signup(){
    const [user, setUser] = useState({
        pseudo: "",
        email: "",
        password: ""
    })

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { name, value } = e.target;
        setUser(prev => ({
        ...prev,
        [name]: value
        }));
    }

    async function handleSignup(){
        try{
            const response = await axios.post(user_urls.signup, user)
            console.log(response.data)
            localStorage.setItem("token", response.data.token)
            localStorage.setItem("user", response.data.user)
        }catch(err){
            console.log(err)
            throw err
        }
    }
    return(
        <div>
            <input placeholder="pseudo" name="pseudo" onChange={handleOnChange}></input>
            <input placeholder="email" name="email" onChange={handleOnChange}></input>
            <input placeholder="password" name="password" onChange={handleOnChange} type="password"></input>
            <button onClick={handleSignup}>SIGN UP</button>
        </div>
    )
}

export default Signup