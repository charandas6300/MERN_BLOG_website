import { useContext, useState } from "react"
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

export default function Loginpage(){

    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [redirect,setRedirect] = useState('');
    const {setUserInfo} = useContext(UserContext);

    async function login(e){
        e.preventDefault();
        const response = await fetch('http://localhost:4000/login',{
            method:'POST',
            body:JSON.stringify({username,password}),
            headers:{'content-Type':'application/json'},
            credentials:'include',
        });
        if(response.ok){
            response.json().then(userInfo =>{
                setUserInfo(userInfo);
                setRedirect(true);
            })
        }
        else{
            alert("wrong credentials");
        }
    }
    if (redirect){
        return <Navigate to={'/'}/>
    }
    return( 
        <form className="login" onSubmit={login}>
        <h2>Login page</h2>
        <input type="text" placeholder="Username" 
        value={username}
         onChange={e => setUsername(e.target.value)}/><br/>
        <input type="password" placeholder="Password" 
        value={password} 
        onChange={(e=>setPassword(e.target.value))}/><br/>
        <button type="submit">Login</button>
        </form>
    )
}