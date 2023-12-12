import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';


export const Home = () => {
    const [name, setName] = useState('')
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    // Check if the user is signed in
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


    return (


        <div>
            <header className="">

                <button className='LogIn' onClick={handleSignOut}>Sign Out</button>


            </header>
            <div className="hmain">

                <h2>Welcome, {name}</h2>
                <a href='/createChannel'>
                    <button>Create Channel</button>
                </a><br></br>
                <a href='/viewChannels'>
                    <button>View Channels</button>
                </a>

            </div>
        </div>


    );


}