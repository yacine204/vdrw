import { useState } from "react"
import user_urls from "../api/user"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&family=Architects+Daughter&display=swap');

  .signup-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #a3b18a;
  }

  .signup-outer {
    position: relative;
    display: inline-block;
    padding-top: 18px;
  }

  .tape {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%) rotate(-1.5deg);
    width: 80px;
    height: 28px;
    background: rgba(255, 240, 180, 0.8);
    border: 1px solid rgba(200, 180, 120, 0.5);
    border-radius: 2px;
    z-index: 10;
    box-shadow: 0 1px 4px rgba(0,0,0,0.12);
  }

  .signup-wrap {
    width: 420px;
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

  .signup-wrap::after {
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

  .signup-header {
    padding: 14px 20px 12px;
    border-bottom: 2px solid #d4c49a;
    background: #f7edcc;
    position: relative;
    z-index: 2;
    transform: skewY(0.4deg);
  }

  .signup-title {
    font-family: 'Caveat', cursive;
    font-size: 30px;
    font-weight: 700;
    color: #4a3520;
    transform: rotate(-1deg);
    display: inline-block;
  }

  .signup-body {
    padding: 28px 26px 26px;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .field-label {
    font-family: 'Caveat', cursive;
    font-size: 17px;
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
    padding: 10px 14px;
    font-family: 'Architects Daughter', cursive;
    font-size: 16px;
    color: #3a2a10;
    outline: none;
    box-sizing: border-box;
    transform: rotate(0.2deg);
    box-shadow: inset 1px 1px 3px rgba(0,0,0,0.06);
    transition: border-color 0.15s;
  }

  .field-input::placeholder { color: #c4a870; }
  .field-input:focus { border-color: #a08858; }

  .signup-btn {
    background: #4a3520;
    color: #fdf6e3;
    border: none;
    border-radius: 4px 8px 4px 6px;
    font-family: 'Caveat', cursive;
    font-size: 24px;
    font-weight: 700;
    padding: 10px 0;
    cursor: pointer;
    transform: rotate(-0.6deg);
    box-shadow: 2px 2px 0 #2a1a08;
    transition: opacity 0.15s, transform 0.15s;
    margin-top: 4px;
  }

  .signup-btn:hover {
    opacity: 0.85;
    transform: rotate(0deg) scale(1.03);
  }
`

function Signup() {
  const navigate = useNavigate()
  const [user, setUser] = useState({ pseudo: "", email: "", password: "" })

  function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  async function handleSignup() {
    try {
      const response = await axios.post(user_urls.signup, user)
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", response.data.user)
      navigate('/menu')
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="signup-page">
        <div className="signup-outer">
          <div className="tape" />
          <div className="signup-wrap">
            <div className="signup-header">
              <span className="signup-title">sign up</span>
            </div>
            <div className="signup-body">
              <div>
                <label className="field-label">pseudo</label>
                <input
                  className="field-input"
                  type="text"
                  name="pseudo"
                  value={user.pseudo}
                  onChange={handleOnChange}
                  placeholder="your nickname"
                />
              </div>
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
              <button className="signup-btn" onClick={handleSignup}>SIGN UP ↑</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup