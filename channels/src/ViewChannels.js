import React, {useEffect, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';

import axios from 'axios';


export const ViewChannels = () => {
    const [channels, setChannels] = useState([]);

    const [name, setName] = useState('')
    const [errMessage, setErrMessage] = useState('');
    const errRef = useRef();


    const [search, setSearch] = useState('')
    const [results, setResults] = useState([]);


    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    // Check if the user is signed in and has access
    useEffect(() => {
        axios.get("http://localhost:8080/home")
            .then(res => {
                if (res.data.valid) {
                    setName(res.data.username)
                    if (!res.data.admin) {
                        navigate("/home")
                    }
                } else {
                    navigate("/signIn")

                }
            })
            .catch(err => console.log(err))
    }, [])

    // Fetch the channels
    const fetchChannels = async () => {
        try {
            const res = await axios.get("http://localhost:8080/viewChannels");
            setChannels(res.data);

        } catch (err) {
            console.log(err)

        }
    }

    useEffect(() => {

        fetchChannels();

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


    // Fetch search reults
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

    return (


        <div>
            <header className="">


                <button className='LogIn' onClick={handleSignOut}>Sign Out</button>


            </header>
            <div className="vmain">

                <span>All Channels</span> <a href='/createChannel'>
                <button>+</button>
            </a><a href='/deleteChannel'>
                <button>-</button>
            </a><br></br>
                <input placeholder='Search' className='' value={search}
                       onChange={(e) => handleSearch(e.target.value)}></input><br></br>

                <a href='/adminHome'><p className='back'>Back to admin home</p></a>


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