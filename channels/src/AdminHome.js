import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';


export const AdminHome = () => {
    const [name, setName] = useState('')
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;


    // Check if a user is logged in and has access
    useEffect(() => {
        axios.get("http://localhost:8080/home")
            .then(res => {
                if (res.data.valid) {
                    setName(res.data.username);
                    if (!res.data.admin) {
                        navigate("/home");
                    }
                } else {
                    navigate("/signIn");

                }
            })
            .catch(err => console.log(err));
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

                <h2>Welcome, Admin</h2>
                <a href='/home'>
                    <button>Switch to User</button>
                </a><br></br>


                <a href='/viewUsers'>
                    <button>View Users</button>
                </a>
                <a href='/allChannels'>
                    <button>View Channels</button>
                </a>
                <a href='/createChannel'>
                    <button>Create Channel</button>
                </a>
                <a href='/viewPosts'>
                    <button>View Posts</button>
                </a>
                <a href='/viewReplies'>
                    <button>View Replies</button>
                </a>


            </div>
        </div>


    );


}