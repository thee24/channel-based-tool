import {useNavigate} from "react-router-dom"
import axios from 'axios';
import {useEffect, useRef, useState} from 'react';


export const ViewPosts = () => {

    const [usrName, setName] = useState('')
    const [posts, setPosts] = useState([]);
    const [errMessage, setErrMessage] = useState('');
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

    useEffect(() => {
        fetchPosts()


    }, [])


    // Fetch the posts
    const fetchPosts = async () => {
        try {
            const res = await axios.get("http://localhost:8080/allPosts");
            setPosts(res.data);

        } catch (err) {
            console.log(err)

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


    // Fetch search results
    const fetchData = async (value) => {
        var filteredPosts = posts.filter((post) => post.textcontent.toLowerCase().includes(value.toLowerCase()) || post.author.toLowerCase().includes(value.toLowerCase()) || post.datetime.toLowerCase().includes(value.toLowerCase()) || post.id.toString().includes(value.toLowerCase()));
        setResults(filteredPosts);


    }


    // Handle a search query
    const handleSearch = (value) => {
        setSearch(value);
        fetchData(value);
        if (value === "") {
            fetchPosts()
            setErrMessage("")

        } else if (results.length === 0) {
            setErrMessage("No results found.")
        }
    }


    return (

        <div>
            <header className="head">

                <button className='LogIn' onClick={handleSignOut}>Sign Out</button>


            </header>

            <div className="cmain">
                <div className="info">

                    <span className="greentext">Posts </span> <a href='/deletePost'>
                    <button className="del">-</button>
                </a><br></br>
                    <input placeholder='Search' className='' value={search}
                           onChange={(e) => handleSearch(e.target.value)}></input><br></br>


                    <a href="/adminHome"><p className="back">Back to admin home</p></a>

                </div>

                <div className="posts">
                    {results && results.length > 0 ? (results.map(post => (<div className="post" key={post.id}>
                            <h3 className="time">ID: {post.id}</h3>


                            <h3 className="greentext">in {post.channel}</h3>


                            <h3 className="author">{post.author} <span className="mid">~</span> <span
                                className="level">  {post.authorlvl}</span></h3>


                            <h3 className="time">{post.datetime}</h3>

                            <p className="text">{post.textcontent}</p>
                            <img className="imageFile" src={`http://localhost:8080/${post.othercontent}`} width="100%"
                                 alt=""></img><br></br>

                            <span className="replies">Likes: {post.numlikes}</span>
                            <span className="replies">Dislikes: {post.numdislikes}</span>


                        </div>


                    ))) : errMessage === "" ? (posts.map(post => (<div className="post" key={post.id}>
                        <h3 className="time">ID: {post.id}</h3>


                        <h3 className="greentext">in {post.channel}</h3>


                        <h3 className="author">{post.author} <span className="mid">~</span> <span
                            className="level">  {post.authorlvl}</span></h3>


                        <h3 className="time">{post.datetime}</h3>

                        <p className="text">{post.textcontent}</p>
                        <img className="imageFile" src={`http://localhost:8080/${post.othercontent}`} width="100%"
                             alt=""></img><br></br>

                        <span className="replies">Likes: {post.numlikes}</span>
                        <span className="replies">Dislikes: {post.numdislikes}</span>


                    </div>))) : (<p ref={errRef} className={errMessage ? "errMessage" : "offscreen"}
                                    aria-live="assertive">{errMessage}</p>)}

                    <div className="spacer"></div>


                </div>
            </div>
        </div>

    )

}