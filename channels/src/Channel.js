import {Link, useNavigate, useParams} from "react-router-dom"
import axios from 'axios';
import {useEffect, useRef, useState} from 'react';
import {Tooltip} from 'react-tooltip'

export const Channel = () => {
    const {name} = useParams();
    const [usrName, setName] = useState('')
    const [posts, setPosts] = useState([]);
    const [desc, setDesc] = useState([]);
    const [search, setSearch] = useState('')
    const [errMessage, setErrMessage] = useState('');
    const [results, setResults] = useState([]);
    const bottomRef = useRef(null);
    const topRef = useRef(null);

    const errRef = useRef();


    const [text, setText] = useState('')
    const [file, setFile] = useState('')


    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    // Check if a user is logged in
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
        fetchPosts()
        fetchdesc()


    }, [])


    // Scroll to the bottom of the page
    const goDown = () => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }

    // Scroll to the top of the page
    const goUp = () => {
        topRef.current?.scrollIntoView({behavior: 'smooth'});
    }

    // Fetch the posts
    const fetchPosts = async () => {
        try {
            const res = await axios.post("http://localhost:8080/posts", {channel: {name}.name});
            setPosts(res.data);
        } catch (err) {
            console.log(err)

        }
    }

    // Fetch the channel description
    const fetchdesc = async () => {
        try {
            const res = await axios.post("http://localhost:8080/desc", {channel: {name}.name});
            setDesc(res.data[0].description);

        } catch (err) {
            console.log(err)

        }
    }

    // Handle like
    const checkLikes = async (postid) => {
        try {
            const res = await axios.post("http://localhost:8080/like", {
                id: postid, user: usrName
            });
            like(postid)
            dislike(postid)

        } catch (err) {
            console.log(err)

        }
    }

    // Update likes
    const like = async (postid) => {
        try {
            const res = await axios.post("http://localhost:8080/setLike", {
                id: postid,
            });
            fetchPosts()


        } catch (err) {
            console.log(err)

        }
    }


    // Handle dislike
    const checkDislikes = async (postid) => {
        try {
            const res = await axios.post("http://localhost:8080/dislike", {
                id: postid, user: usrName
            });
            like(postid)
            dislike(postid)

        } catch (err) {
            console.log(err)

        }
    }

    // Update dislikes
    const dislike = async (postid) => {
        try {
            const res = await axios.post("http://localhost:8080/setDislike", {
                id: postid,
            });
            fetchPosts()


        } catch (err) {
            console.log(err)

        }
    }


    // Fetch search results
    const fetchData = async (value) => {
        var filteredPosts = posts.filter((post) => post.textcontent.toLowerCase().includes(value.toLowerCase()) || post.author.toLowerCase().includes(value.toLowerCase()) || post.datetime.toLowerCase().includes(value.toLowerCase()));
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


    // Display the insert element
    const showInsert = () => {
        if (document.getElementById("upload").style.display === "none") {
            document.getElementById("upload").style.display = "inline";
        } else {
            document.getElementById("upload").style.display = "none";

        }
    }


    // Send the message
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/message", {
                textcontent: text, screenshot: file, channel: {name}.name, author: usrName
            }, {headers: {'Content-Type': 'multipart/form-data'}});

            setFile("")


            fetchPosts();
            document.getElementById("textIn").value = ""
            document.getElementById("upload").value = ""
            document.getElementById("upload").style.display = "none";
            goDown()



        } catch (err) {
            console.log(err);

        }

    }


    return (

        <div>
            <header className="head" ref={topRef}>

                <button className='LogIn' onClick={handleSignOut}>Sign Out</button>


            </header>

            <div className="cmain">
                <div className="info">
                    <span className="greentext">#{name} </span>
                    <a
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content={desc}
                        data-tooltip-place="bottom">
                        <i class="uil uil-info-circle"></i>
                    </a>
                    <Tooltip id="my-tooltip" classNameArrow="arrow"/>
                    <br></br>

                    <input placeholder='Search' className='' value={search}
                           onChange={(e) => handleSearch(e.target.value)}></input><br></br>

                    <a href="/viewChannels"><p className="back">Back to all channels</p></a>


                </div>

                <div className="posts">
                    {results && results.length > 0 ? (

                        results.map(post => (<div className="post" key={post.id}>

                            <h3 className="author">{post.author} <span className="mid">~</span> <span
                                className="level">  {post.authorlvl}</span></h3>


                            <h3 className="time">{post.datetime}</h3>

                            <p className="text">{post.textcontent}</p>
                            <img className="imageFile" src={`http://localhost:8080/${post.othercontent}`}
                                 width="100%" alt=""></img><br></br>

                            <i class="uil uil-thumbs-up up" id="up"
                               onClick={() => checkLikes(post.id)}></i><span
                            className="replies">{post.numlikes}</span>
                            <i class="uil uil-thumbs-down down" id="down"
                               onClick={() => checkDislikes(post.id)}></i><span
                            className="replies">{post.numdislikes}</span>
                            <Link to={`/channels/${name}/${post.id}/replies`}>
                                <span className="replies">Reply</span>
                            </Link>
                            <Link to={`/channels/${name}/${post.id}/replies`}>
                                <span className="replies">View replies</span>
                            </Link>
                        </div>))) : errMessage === "" ? (posts.map(post => (<div className="post" key={post.id}>

                            <h3 className="author">{post.author} <span className="mid">~</span> <span
                                className="level">  {post.authorlvl}</span></h3>


                            <h3 className="time">{post.datetime}</h3>

                            <p className="text">{post.textcontent}</p>
                            <img className="imageFile" src={`http://localhost:8080/${post.othercontent}`} width="100%"
                                 alt=""></img><br></br>

                            <i class="uil uil-thumbs-up up" id="up"
                               onClick={() => checkLikes(post.id)}></i><span
                            className="replies">{post.numlikes}</span>
                            <i class="uil uil-thumbs-down down" id="down"
                               onClick={() => checkDislikes(post.id)}></i><span
                            className="replies">{post.numdislikes}</span>
                            <Link to={`/channels/${name}/${post.id}/replies`}>
                                <span className="replies">Reply</span>
                            </Link>
                            <Link to={`/channels/${name}/${post.id}/replies`}>
                                <span className="replies">View replies</span>
                            </Link>
                        </div>

                    ))) : (<p ref={errRef} className={errMessage ? "errMessage" : "offscreen"}
                              aria-live="assertive">{errMessage}</p>)}

                    <div className="spacer" ref={bottomRef}></div>
                </div>
                <div className="message-cont">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">

                        <input placeholder='Type a message' className='message' required id="textIn"
                               onChange={(e) => setText(e.target.value)}></input>
                        <i onClick={showInsert} class="uil uil-paperclip" title="Insert an image"></i>
                        <input type="file" className="upload" id="upload" name="image" accept="image/*"
                               onChange={(e) => setFile(e.target.files[0])}></input>
                        <button type="submit">Send</button>
                        <button type="button" onClick={goDown} className="down-button" title="Go down"><i
                            class="uil uil-arrow-down"></i></button>
                        <button type="button" onClick={goUp} className="down-button" title="Go up"><i
                            class="uil uil-arrow-up"></i></button>


                    </form>


                </div>

            </div>
        </div>)
}