import React, {useEffect, useRef, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';


export const CreateChannel = () => {
    const [name, setName] = useState('')
    const [errMessage, setErrMessage] = useState('');

    const errRef = useRef();


    const [channel, setChannel] = useState({
        name: "", description: ""
    });

    const handleChange = (e) => {
        setChannel(prev => ({...prev, [e.target.name]: e.target.value}))
    };


    const navigate = useNavigate();

    // Check if the user is logged in
    useEffect(() => {
        axios.get("http://localhost:8080/home")
            .then(res => {
                if (res.data.valid) {
                    setName(res.data.username)
                } else {
                    navigate("/signIn")

                }
            })
            .catch(err => console.log(err))
    }, [])

    axios.defaults.withCredentials = true;


    // Create the channel
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/viewChannels", channel);
            if (response.data.errno === 1062) {
                setErrMessage("Channel name taken. Please select another one.");
            } else {
                if (name === "admin") {
                    navigate("/allChannels")
                } else {
                    navigate('/viewChannels');
                }
            }
        } catch (err) {
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
                <h2> Create Channel </h2>
                <form onSubmit={handleSubmit}>
                    <div className='enter'>
                        <input required
                               type="text"
                               placeholder="Channel Name"
                               onChange={handleChange}
                               name="name"
                        ></input>
                    </div>
                    <div className='enter'>
        <textarea
            type="text"
            placeholder="Description"
            onChange={handleChange}
            name="description"

        ></textarea>
                    </div>
                    <button>Create</button>
                </form>
                <a href='/viewChannels'>
                    <button>Back</button>
                </a>


            </div>

        </div>

    );

}

