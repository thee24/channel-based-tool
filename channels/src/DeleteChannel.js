import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';


export const DeleteChannel = () => {
    const [name, setName] = useState('')
    const [errMessage, setErrMessage] = useState('');

    const errRef = useRef();


    const [channel, setChannel] = useState({
        name: ""
    });

    const handleChange = (e) => {
        setChannel(prev => ({...prev, [e.target.name]: e.target.value}))
    };


    const navigate = useNavigate();

    // Check if the user is signed in and if the user has access
    useEffect(() => {
        axios.get("http://localhost:8080/home")
            .then(res => {
                if (res.data.valid) {
                    setName(res.data.username)
                    if (!res.data.admin) {
                        navigate("/home")
                    }
                } else {
                    // navigate("/signIn")

                }
            })
            .catch(err => console.log(err))
    }, [])

    axios.defaults.withCredentials = true;


    // Delete the channel
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/deleteChannel", channel);
            navigate("/allChannels");

        } catch (err) {
            if (err.response?.status === 400) {
                setErrMessage("Channel not found. Please enter an existing channel.")
            }
            console.log(err);

        }

    }


    // Sign the user out
    const handleSignOut = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get("http://localhost:8080/signOut");
            if (!response.data.valid) {
                navigate('/');
            } else {
                console.log(response);

            }

        } catch (err) {
            console.log(err);
        }

    }


    return (<div>
            <header className="">

                <button className='LogIn' onClick={handleSignOut}>Sign Out</button>


            </header>
            <div className='smain'>
                <p ref={errRef} className={errMessage ? "errMessage" : "offscreen"}
                   aria-live="assertive">{errMessage}</p>
                <h2 className='red'> Delete Channel </h2>
                <form onSubmit={handleSubmit}>
                    <div className='enter'>
                        <input required
                               type="text"
                               placeholder="Channel Name"
                               onChange={handleChange}
                               name="name"
                        ></input>
                    </div>
                    <button className='delete'>Delete</button>


                </form>
                <a href='/allChannels'>
                    <button>Back</button>
                </a>

            </div>

        </div>

    );

}

