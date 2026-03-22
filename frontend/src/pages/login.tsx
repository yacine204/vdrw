import { useState } from "react";
import axios from "axios";
import user_urls
 from "../api/user";
import { useNavigate } from "react-router-dom";
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Architects+Daughter&display=swap');

  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #a3b18a
  }

  .login-outer {
    position: relative;
    display: inline-block;
    padding-top: 18px;        /* was 14px */
  }

  .tape {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%) rotate(-1.5deg);
    width: 80px;              /* was 64px */
    height: 28px;             /* was 24px */
    background: rgba(255, 240, 180, 0.8);
    border: 1px solid rgba(200, 180, 120, 0.5);
    border-radius: 2px;
    z-index: 10;
    box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  }

  .login-wrap {
    width: 420px;             /* was 290px */
    background: #fdf6e3;
    border-radius: 2px 14px 4px 10px;
    font-family: 'Architects Daughter', cursive;
    position: relative;
    z-index: 1;
    transform: rotate(-0.8deg) skewX(-0.3deg);
    box-shadow:
      2px 2px 0 #e8d9b5,
      4px 4px 0 #ddd0a8,
      6px 6px 0 #d0c090,
      8px 8px 18px rgba(0,0,0,0.15);
    border: 1.5px solid #d4c49a;
    overflow: hidden;
  }

  .login-wrap::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(
      transparent,
      transparent 27px,
      #e8dfc8 27px,
      #e8dfc8 28.5px
    );
    pointer-events: none;
    z-index: 0;
    opacity: 0.6;
  }

  .login-header {
    padding: 14px 20px 12px;  /* was 10px 14px 8px */
    border-bottom: 2px solid #d4c49a;
    background: #f7edcc;
    position: relative;
    z-index: 2;
    transform: skewY(0.4deg);
  }

  .login-title {
    font-family: 'Caveat', cursive;
    font-size: 30px;          /* was 22px */
    font-weight: 700;
    color: #4a3520;
    transform: rotate(-1deg);
    display: inline-block;
  }

  .login-body {
    padding: 28px 26px 26px;  /* was 20px 18px 18px */
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;                /* was 14px */
  }

  .field-label {
    font-family: 'Caveat', cursive;
    font-size: 17px;          /* was 13px */
    color: #a08858;
    margin-bottom: 6px;
    display: block;
    transform: rotate(-0.4deg);
  }

  .field-input {
    width: 100%;
    background: #fffde7;
    border: 1.5px solid #d4c49a;
    border-radius: 4px 8px 6px 4px;
    padding: 10px 14px;       /* was 7px 10px */
    font-family: 'Architects Daughter', cursive;
    font-size: 16px;          /* was 13px */
    color: #3a2a10;
    outline: none;
    box-sizing: border-box;
    transform: rotate(0.2deg);
    box-shadow: inset 1px 1px 3px rgba(0,0,0,0.06);
    transition: border-color 0.15s;
  }

  .field-input::placeholder { color: #c4a870; }
  .field-input:focus { border-color: #a08858; }

  .login-btn {
    background: #4a3520;
    color: #fdf6e3;
    border: none;
    border-radius: 4px 8px 4px 6px;
    font-family: 'Caveat', cursive;
    font-size: 24px;          /* was 18px */
    font-weight: 700;
    padding: 10px 0;          /* was 8px */
    cursor: pointer;
    transform: rotate(-0.6deg);
    box-shadow: 2px 2px 0 #2a1a08;
    transition: opacity 0.15s, transform 0.15s;
    margin-top: 4px;
  }

  .login-btn:hover {
    opacity: 0.85;
    transform: rotate(0deg) scale(1.03);
  }
`

function Login() {
  const navigate = useNavigate()
  const [user, setUser] = useState({ email: "", password: "" })

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  async function handleLogin() {
    try {
      const response = await axios.post(user_urls.login, {
        email: user.email,
        password: user.password
      })
      localStorage.setItem("token", response.data.access)
      localStorage.setItem("user", JSON.stringify(response.data.user))
      navigate('/menu')
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="login-page">  
      <div className="login-outer">
        <div className="tape" />
        <div className="login-wrap">
          <div className="login-header">
            <span className="login-title">login</span>
          </div>
          <div className="login-body">
            <div>
              <label className="field-label">email</label>
              <input
                className="field-input"
                type="email"
                name="email"
                value={user.email}
                onChange={handleOnChange}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="field-label">password</label>
              <input
                className="field-input"
                type="password"
                name="password"
                value={user.password}
                onChange={handleOnChange}
                placeholder="••••••••"
              />
            </div>
            <button className="login-btn" onClick={handleLogin}>LOGIN ↑</button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default Login