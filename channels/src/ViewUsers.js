import React, {useEffect, useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import axios from 'axios';


export const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const [errMessage, setErrMessage] = useState('');

    const [name, setName] = useState('')
    const [search, setSearch] = useState('')
    const [results, setResults] = useState([]);
    const errRef = useRef();



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

    // Fetch the users
    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:8080/viewUsers");
            setUsers(res.data);

        } catch (err) {
            console.log(err)

        }
    }

    useEffect(() => {

        fetchUsers();

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

    // Fetch search results
    const fetchData = async (value) => {
        const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(value.toLowerCase()));

        setResults(filteredUsers);


    };


    // Handle a search query
    const handleSearch = (value) => {
        setSearch(value);
        fetchData(value);
        if (value === "") {
            fetchUsers()
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

                <span>All Users</span> <a href='/deleteUser'>
                <button>-</button>
            </a><br></br>
                <input placeholder='Search' className='' value={search}
                       onChange={(e) => handleSearch(e.target.value)}></input><br></br>

                <a href='/adminHome'><p className='back'>Back to admin home</p></a>


                <ul className='channels'>
                    {results && results.length > 0 ? (


                        results.map(user => (<li className='channel' key={user.id}>{user.name}
                        </li>))) : errMessage === "" ? (users.map(user => (
                        <li className='channel' key={user.id}>{user.name}
                        </li>

                    ))) : (<p ref={errRef} className={errMessage ? "errMessage" : "offscreen"}
                              aria-live="assertive">{errMessage}</p>

                    )}
                </ul>


            </div>
        </div>


    );


}