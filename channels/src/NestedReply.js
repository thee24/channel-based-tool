import {Link, useNavigate, useParams} from "react-router-dom"
import axios from 'axios';
import {useEffect, useRef, useState} from 'react';

export const NestedReply = () => {
    const {id} = useParams();
    const {name} = useParams();
    const {repId} = useParams();

    const [usrName, setName] = useState('')
    const [posts, setPosts] = useState([]);
    const [search, setSearch] = useState('')
    const [errMessage, setErrMessage] = useState('');
    const [results, setResults] = useState([]);
    const [root, setRoot] = useState([])

    const errRef = useRef();


    const [text, setText] = useState('')
    const [file, setFile] = useState(null)


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
        fetchPosts()
        getRoot()


    }, [])

    const bottomRef = useRef(null);
    const topRef = useRef(null);


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
            const res = await axios.post("http://localhost:8080/replies", {post: repId});
            setPosts(res.data);
        } catch (err) {
            console.log(err)

        }
    }

    // Get the parent post
    const getRoot = async () => {
        try {
            const res = await axios.post("http://localhost:8080/root", {id: repId});
            setRoot(res.data)
        } catch (err) {
            console.log(err)

        }
    }


    // Fetch search results
    const fetchData = async (value) => {
        var filteredPosts = posts.filter((post) => post.textcontent.toLowerCase().includes(value.toLowerCase()) || post.author.toLowerCase().includes(value.toLowerCase()) || post.datetime.toLowerCase().includes(value.toLowerCase()));
        setResults(filteredPosts);


    }


    // handle a search query
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


    // Send the reply
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/reply", {
                textcontent: text,
                screenshot: file,
                channel: {name}.name,
                author: usrName,
                postid: repId
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


    // Handle like
    const rcheckLikes = async (postid) => {
        try {
            const res = await axios.post("http://localhost:8080/rlike", {
                id: postid,
                user: usrName
            });
            rlike(postid)
            rdislike(postid)

        } catch (err) {
            console.log(err)

        }
    }

    // Update likes
    const rlike = async (postid) => {
        try {
            const res = await axios.post("http://localhost:8080/rsetLike", {
                id: postid,
            });
            getRoot()
            fetchPosts()


        } catch (err) {
            console.log(err)

        }
    }


    // Handle dislike
    const rcheckDislikes = async (postid) => {
        try {
            const res = await axios.post("http://localhost:8080/rdislike", {
                id: postid,
                user: usrName
            });
            rlike(postid)
            rdislike(postid)

        } catch (err) {
            console.log(err)

        }
    }

    // Update dislikes
    const rdislike = async (postid) => {
        try {
            const res = await axios.post("http://localhost:8080/rsetDislike", {
                id: postid,
            });
            getRoot()
            fetchPosts()


        } catch (err) {
            console.log(err)

        }
    }

    return (

        <div>
            <header className="head" ref={topRef}>

                <button className='LogIn' onClick={handleSignOut}>Sign Out</button>


            </header>

            <div className="cmain">
                <div className="info">
                    <span className="greentext">Replies </span> <br></br>

                    <input placeholder='Search' className='' value={search}
                           onChange={(e) => handleSearch(e.target.value)}></input><br></br>

                    <Link to={`/channels/${name}/${id}/replies`}><p className="back">Back to replies</p></Link>


                </div>

                <div className="posts">
                    <div className="root">
                        {root.map(parent => (<div className="parent" key={parent.id}>
                                <h3 className="author">{parent.author} <span className="mid">~</span> <span
                                    className="level">  {parent.authorlvl}</span></h3>


                                <h3 className="time">{parent.datetime}</h3>

                                <p className="text">{parent.textcontent}</p>
                                <img className="imageFile" src={`http://localhost:8080/${parent.othercontent}`}
                                     width="100%" alt=""></img><br></br>

                                <i class="uil uil-thumbs-up up" id="up"
                                   onClick={() => rcheckLikes(parent.id)}></i><span
                                className="replies">{parent.numlikes}</span>
                                <i class="uil uil-thumbs-down down" id="down"
                                   onClick={() => rcheckDislikes(parent.id)}></i><span
                                className="replies">{parent.numdislikes}</span>
                            </div>


                        ))}


                    </div>
                    {results && results.length > 0 ? (

                        results.map(reply => (<div className="reply" key={reply.id}>

                            <h3 className="author">{reply.author} <span className="mid">~</span> <span
                                className="level">  {reply.authorlvl}</span></h3>


                            <h3 className="time">{reply.datetime}</h3>

                            <p className="text">{reply.textcontent}</p>
                            <img className="imageFile" src={`http://localhost:8080/${reply.othercontent}`}
                                 width="100%" alt=""></img><br></br>

                            <i class="uil uil-thumbs-up up" id="up"
                               onClick={() => rcheckLikes(reply.id)}></i><span
                            className="replies">{reply.numlikes}</span>
                            <i class="uil uil-thumbs-down down" id="down"
                               onClick={() => rcheckDislikes(reply.id)}></i><span
                            className="replies">{reply.numdislikes}</span>
                        </div>))) : errMessage === "" ? (posts.map(reply => (<div className="reply" key={reply.id}>

                            <h3 className="author">{reply.author} <span className="mid">~</span> <span
                                className="level">  {reply.authorlvl}</span></h3>


                            <h3 className="time">{reply.datetime}</h3>

                            <p className="text">{reply.textcontent}</p>
                            <img className="imageFile" src={`http://localhost:8080/${reply.othercontent}`} width="100%"
                                 alt=""></img><br></br>

                            <i class="uil uil-thumbs-up up" id="up"
                               onClick={() => rcheckLikes(reply.id)}></i><span
                            className="replies">{reply.numlikes}</span>
                            <i class="uil uil-thumbs-down down" id="down"
                               onClick={() => rcheckDislikes(reply.id)}></i><span
                            className="replies">{reply.numdislikes}</span>
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