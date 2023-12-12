import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import axios from 'axios';


export const SignIn = () => {
    const [errMessage, setErrMessage] = useState('');
    const errRef = useRef();
    const [success, setSuccess] = useState(false);


    const [user, setUser] = useState({
        name: "", password: ""
    });


    const handleChange = (e) => {
        setUser(prev => ({...prev, [e.target.name]: e.target.value}))
    };


    axios.defaults.withCredentials = true;

    // Check if the user is signed in already
    useEffect(() => {
        axios.get("http://localhost:8080/home")
            .then(res => {
                if (res.data.valid) {
                    navigate("/home")
                } else {
                    navigate("/signIn")
                }
            })
            .catch(err => console.log(err))
    }, [])

    const navigate = useNavigate();

    // Sign the user in
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/signIn", user);
            if (response.data.Login) {
                if (response.data.name === "admin") {
                    navigate("/adminHome")
                } else {
                    navigate('/home');
                }


            } else {
                setErrMessage("Username or password incorrect. Please try again.")
            }

        } catch (err) {
            if (err.response?.status === 400) {
                setErrMessage("User not found. Please sign up.")
            }

            console.log(err);
        }


    }


    return (<div className='smain'>
            <p ref={errRef} className={errMessage ? "errMessage" : "offscreen"} aria-live="assertive">{errMessage}</p>
            <h2> Sign In </h2>
            <form onSubmit={handleSubmit}>
                <div className='enter'>
                    <input required
                           type="text"
                           placeholder="Username"
                           onChange={handleChange}
                           name='name'

                    ></input>
                </div>
                <div className='enter'>
                    <input required
                           type="password"
                           placeholder="Password"
                           onChange={handleChange}
                           name='password'

                    ></input>
                </div>
                <button>Sign In</button>

            </form>
            <p>Don't have an account? <a className='greentext' href='/signup'>Sign Up</a></p>

        </div>

    );

}
