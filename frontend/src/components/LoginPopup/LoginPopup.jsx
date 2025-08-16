import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const LoginPopup = ({ setShowLogin }) => {

    const { setToken, url, loadCartData } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Sign Up");

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const { name, value } = event.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const onLogin = async (e) => {
        e.preventDefault()

        let new_url = url;
        if (currState === "Login") {
            new_url += "/api/user/login";
        } else {
            new_url += "/api/user/register";
        }
        const response = await axios.post(new_url, data);
        if (response.data.success) {
    const userToken = response.data.token;
    setToken(userToken);
    localStorage.setItem("token", userToken);
    await loadCartData(userToken); // ✅ Pass the token you just got
    setShowLogin(false);
}
else {
            toast.error(response.data.message);
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img 
                        onClick={() => setShowLogin(false)} 
                        src={assets.cross_icon} 
                        alt="Close" 
                    />
                </div>

                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Your name"
                            value={data.name}
                            onChange={onChangeHandler}
                            autoComplete="name"
                            required
                        />
                    )}

                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email"
                        value={data.email}
                        onChange={onChangeHandler}
                        autoComplete="email"
                        required
                    />

                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={data.password}
                        onChange={onChangeHandler}
                        autoComplete={currState === "Login" ? "current-password" : "new-password"}
                        required
                    />
                </div>

                <button type="submit">
                    {currState === "Login" ? "Login" : "Create account"}
                </button>

                <div className="login-popup-condition">
                    <input 
                        type="checkbox" 
                        id="terms"
                        name="terms"
                        required
                    />
                    <label htmlFor="terms">
                        By continuing, I agree to the terms of use & privacy policy.
                    </label>
                </div>

                {currState === "Login" ? (
                    <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                ) : (
                    <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                )}
            </form>
        </div>
    )
}

export default LoginPopup
