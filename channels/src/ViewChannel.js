import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import axios from 'axios';


export const ViewChannel = () => {
    const [channels, setChannels] = useState([]);
    const [errMessage, setErrMessage] = useState('');
    const errRef = useRef();

    const [name, setName] = useState('')
    const [search, setSearch] = useState('')
    const [results, setResults] = useState([]);


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

    useEffect(() => {

        fetchChannels();

    }, [])

    // Fetch the channels
    const fetchChannels = async () => {
        try {
            const res = await axios.get("http://localhost:8080/viewChannels");
            setChannels(res.data);
            console.log(res);

        } catch (err) {
            console.log(err)

        }
    }


    // Fetch the search results
    const fetchData = async (value) => {
        const filteredChannels = channels.filter((channel) => channel.name.toLowerCase().includes(value.toLowerCase()));

        setResults(filteredChannels);

    };


    // Handle a search query
    const handleSearch = (value) => {
        setSearch(value);
        fetchData(value);
        if (value === "") {
            fetchChannels()
            setErrMessage("")

        } else if (results.length === 0) {
            setErrMessage("No results found.")
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

    return (


        <div>
            <header className="">


                <button className='LogIn' onClick={handleSignOut}>Sign Out</button>


            </header>
            <div className="vmain">

                <span>All Channels</span> <a href='/createChannel'>
                <button>+</button>
            </a><br></br>
                <input placeholder='Search' className='' value={search}
                       onChange={(e) => handleSearch(e.target.value)}></input><br></br>

                <a href='/home'><p className='back'>Back to home</p></a>


                <ul className='channels'>
                    {results && results.length > 0 ? (

                        results.map(channel => (<Link to={`/channels/${channel.name}`}>

                            <li className='channel' key={channel.id}>#{channel.name}
                            </li>
                        </Link>))) : errMessage === "" ? (channels.map(channel => (
                        <Link to={`/channels/${channel.name}`}>

                            <li className='channel' key={channel.id}>#{channel.name}
                            </li>
                        </Link>))) : (<p ref={errRef} className={errMessage ? "errMessage" : "offscreen"}
                                         aria-live="assertive">{errMessage}</p>)}
                </ul>


            </div>
        </div>


    );


}