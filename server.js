'use strict';

const express = require("express")
const mysql = require("mysql")
const bcrypt = require("bcrypt")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const bodyParser = require("body-parser")
const multer  = require('multer')
const cors = require("cors")





const app = express();
const upload = multer({dest: "uploads/"});
app.use('/uploads', express.static('uploads'));

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 3600000
    }
}))


// Connect to the database
const db = mysql.createConnection({
    host: "localhost",     
    user: "root",
    password: "admin",
    database: "channels"
})

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to the database');
});


db.query(`CREATE DATABASE IF NOT EXISTS channels`, function(error, result){
    if(error){
        console.log(error);
    }
    console.log("Database created successfully.")
 });


// Create tables
const createTables = [
`CREATE TABLE IF NOT EXISTS channelslist(
id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id),
  UNIQUE KEY name_UNIQUE (name)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;`,

`CREATE TABLE IF NOT EXISTS dislikes (
  id INT(11) NOT NULL AUTO_INCREMENT,
  postid INT(11) DEFAULT NULL,
  username VARCHAR(45) NOT NULL,
  replyid INT(11) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8;`,

`CREATE TABLE IF NOT EXISTS likes (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  postid INT(11) DEFAULT NULL,
  username VARCHAR(45) NOT NULL,
  replyid INT(11) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=104 DEFAULT CHARSET=utf8;`,

`CREATE TABLE IF NOT EXISTS posts (
  id INT(11) NOT NULL AUTO_INCREMENT,
  textcontent VARCHAR(1000) NOT NULL,
  othercontent VARCHAR(100) DEFAULT NULL,
  author VARCHAR(45) DEFAULT NULL,
  datetime VARCHAR(100) DEFAULT NULL,
  numlikes INT(11) DEFAULT NULL,
  numdislikes INT(11) DEFAULT NULL,
  channel VARCHAR(45) DEFAULT NULL,
  channelid INT(11) DEFAULT NULL,
  authorlvl VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id)
) ENGINE=InnoDB AUTO_INCREMENT=280 DEFAULT CHARSET=utf8;`,

`CREATE TABLE IF NOT EXISTS replies (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  textcontent VARCHAR(1000) NOT NULL,
  othercontent VARCHAR(100) DEFAULT NULL,
  author VARCHAR(45) NOT NULL,
  datetime VARCHAR(100) NOT NULL,
  numlikes INT(11) DEFAULT NULL,
  numdislikes INT(11) DEFAULT NULL,
  channel VARCHAR(45) DEFAULT NULL,
  channelid INT(11) DEFAULT NULL,
  postid INT(11) NOT NULL,
  authorlvl VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;`,

`CREATE TABLE IF NOT EXISTS users (
  id INT(11) NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NOT NULL,
  password VARCHAR(1000) NOT NULL,
  level VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY id_UNIQUE (id),
  UNIQUE KEY username_UNIQUE (name)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8;`
];

// Execute the queries
createTables.forEach((query) => {
    db.query(query, (err, results) => {
      if (err) {
        throw err;
      }
    console.log('Table created successfully');

    });
  });


// Handle user sessions
app.get("/home", (req, res) => {
    if(req.session.name){
        if(req.session.name === "admin"){
        return res.json({valid: true, username: req.session.name, admin: true})
        }
        else{
        return res.json({valid: true, username: req.session.name, admin: false})

        }
    }
    else{
        return res.json({valid: false})
    }
    
})

// handle sign out
app.get("/signOut", (req, res) => {
    req.session.name = null;
    return res.json({valid: false})
})

// Get the channels
app.get("/viewChannels", (req, res) => {
    const query = "SELECT * FROM channelslist";
    db.query(query, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
})


// Create a channel
app.post("/viewChannels", (req, res) => {
    const query = "INSERT INTO channelslist (`name`, `description`) VALUES (?)"
    const values = [req.body.name, req.body.description]
    db.query(query, [values], (err, data) =>{
        if(err) return res.json(err);
        return res.json("success");
    });
    
})

// Delete a post
app.post("/deletePost", (req, res) => {
    const q2 = "DELETE FROM posts WHERE id = ?";
    const values = [req.body.id];

    db.query(q2, values, (err, data) => {
        if(data.affectedRows === 0){
            return res.sendStatus(400);

        }
        if(err) return res.json(err);
        return res.json("success");
    });


})

// Delete a reply
app.post("/deleteReply", (req, res) => {
    const q2 = "DELETE FROM replies WHERE id = ?";
    const values = [req.body.id];

    db.query(q2, values, (err, data) => {
        if(data.affectedRows === 0){
            return res.sendStatus(400);

        }
        if(err) return res.json(err);
        return res.json("success");
    });


})

// Delete a channel
app.post("/deleteChannel", (req, res) => {
    const q = "SELECT * FROM channelslist WHERE name = ?";
    const values = [req.body.name];
    
    db.query(q, values, (err, data) => {

        if (err) {
            return res.json(err);
        } else if (!data || data.length === 0) {
            return res.sendStatus(400);
        } else {
            const q2 = "DELETE FROM posts WHERE channel = ?";
            db.query(q2, values, (err, data) => {
                if (err) {
                    return res.json(err);
                }
            });
            const q3 = "DELETE FROM replies WHERE channel = ?";
            db.query(q3, values, (err, data) => {
                if (err) {
                    return res.json(err);
                }
            });
            const query = "DELETE FROM channelslist WHERE name = ?";
            db.query(query, values, (err, data) => {
                if (err) {
                    return res.json(err);
                }
            });
        }
        return res.json("success");
    });
});


// Get the users
app.get("/viewUsers", (req, res) => {
    const query = "SELECT * FROM users";
    db.query(query, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
})

// Get all posts
app.get("/allPosts", (req, res) => {
    const query = "SELECT * FROM posts";
    db.query(query, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
})

// Get all replies
app.get("/allReplies", (req, res) => {
    const query = "SELECT * FROM replies";
    db.query(query, (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
})

// Delete a user
app.post("/deleteUser", (req, res) => {
    const q = "SELECT * FROM users WHERE name = ?";
    const values = [req.body.name];
    
    db.query(q, values, (err, data) => {

        if (err) {
            return res.json(err);
        } else if (!data || data.length === 0) {
            return res.sendStatus(400);
        } else {
            const q2 = "DELETE FROM posts WHERE author = ?";
            db.query(q2, values, (err, data) => {
                if (err) {
                    return res.json(err);
                }
            });
            const q3 = "DELETE FROM replies WHERE author = ?";
            db.query(q3, values, (err, data) => {
                if (err) {
                    return res.json(err);
                }
            });
            const query = "DELETE FROM users WHERE name = ?";
            db.query(query, values, (err, data) => {
                if (err) {
                    return res.json(err);
                }
            });
        }
        return res.json("success");
    });
});




// Handle sign up
app.post("/signUp", async (req, res) => {
    const query = "INSERT INTO users (`name`, `password`, `level`) VALUES (?)"
    const saltRounds = 10;
    const password = req.body.password;
    const hash = await bcrypt.hash(password, saltRounds);
    const values = [req.body.name, hash, req.body.level];
    db.query(query, [values], (err, data) =>{
        if(err) return res.json(err);
        return res.json("success");
    });
})

// Handle sign in
app.post("/signIn", async (req, res) => {
    const query = "SELECT * FROM users WHERE name = ?";
    const userName = req.body.name;
    const password = req.body.password;
    var userPass = password;
    db.query(query, [userName], async (err, data) => {
        if(err) return res.json(err);
        if (!data || data.length === 0) {
            return res.sendStatus(400);
        }
        else{
            userPass = data[0].password;
            const match = await bcrypt.compare(password, userPass);
            if(match){
                req.session.name = data[0].name;
                res.json({"Login": true, name: req.session.name});
            }
            else{
                res.json({"Login": false});
            }
            
        }   
    });

   
   
});

// Send a message
app.post("/message", upload.single('screenshot'),(req, res) => {
    const q = "SELECT * FROM users WHERE name = ?";
    db.query(q, [req.body.author], (err, data) =>{
        if(err) return res.json(err);
        if (!data || data.length === 0) {
            return res.sendStatus(400);
        }
        else{
            var level = data[0].level;
      

            const imagePath = req.file ? req.file.path : null;
            const query = "INSERT INTO posts (`textcontent`, `othercontent`, `channel`, `author`, `datetime`, `authorlvl`) VALUES (?)"
            const values = [req.body.textcontent, imagePath, req.body.channel, req.body.author, new Date().toLocaleString(), level]
            db.query(query, [values], (err, data) => {
                if(err) return res.json(err);
                return res.json(data);
            });


        }

    });
    
})


// Get the posts associated with a channel
app.post("/posts", (req, res) => {
    const query = "SELECT * FROM posts WHERE channel = ?";
    db.query(query, [req.body.channel], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

// Get the description of a channel
app.post("/desc", (req, res) => {
    const query = "SELECT * FROM channelslist WHERE name = ?";
    db.query(query, [req.body.channel], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

// Send a reply
app.post("/reply", upload.single('screenshot'), (req, res) => {
    const q = "SELECT * FROM users WHERE name = ?";
    db.query(q, [req.body.author], (err, data) =>{
        if(err) return res.json(err);
        if (!data || data.length === 0) {
            return res.sendStatus(400);
        }
        else{
            var level = data[0].level;
          

            const imagePath = req.file ? req.file.path : null;
            
            const query = "INSERT INTO replies (`textcontent`, `othercontent`, `channel`, `author`, `postid`, `datetime`, `authorlvl`) VALUES (?)"
            const values = [req.body.textcontent, imagePath, req.body.channel, req.body.author, req.body.postid, new Date().toLocaleString(), level]
            db.query(query, [values], (err, data) => {
                if(err) return res.json(err);
                return res.json(data);
            });


        }

    });
    
})


// Get the replies associated with the postid
app.post("/replies", (req, res) => {
    const query = "SELECT * FROM replies WHERE postid = ?";
    db.query(query, [req.body.post], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

// Get the parent post
app.post("/getRoot", (req, res) => {
    const query = "SELECT * FROM posts WHERE id = ?";
    db.query(query, [req.body.id], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

// Get the parent post
app.post("/root", (req, res) => {
    const query = "SELECT * FROM replies WHERE id = ?";
    db.query(query, [req.body.id], (err, data) => {
        if(err) return res.json(err);
        return res.json(data);
    });
});

// Handle liking a post
app.post("/like", (req, res) => {
    const postId = req.body.id;
    const username = req.body.user;

    const checkDislikeQuery = "SELECT * FROM dislikes WHERE postid = ? AND username = ?";
    const checkDislikeValues = [postId, username];

    db.query(checkDislikeQuery, checkDislikeValues, (err, dislikeData) => {
        if (err) return res.json(err);

        if (dislikeData && dislikeData.length > 0) {
            const deleteDislikeQuery = "DELETE FROM dislikes WHERE postid = ? AND username = ?";
            const deleteDislikeValues = [postId, username];

            db.query(deleteDislikeQuery, deleteDislikeValues, (err, result) => {
                if (err) return res.json(err);
            });
        }

        const toggleQuery = "SELECT * FROM likes WHERE postid = ? AND username = ?";
        const toggleValues = [postId, username];

        db.query(toggleQuery, toggleValues, (err, data) => {
            if (err) return res.json(err);

            if (!data || data.length === 0) {
                const insertQuery = "INSERT INTO likes (`postid`, `username`) VALUES (?, ?)";
                const insertValues = [postId, username];

                db.query(insertQuery, insertValues, (err, result) => {
                    if (err) return res.json(err);
                    return res.json({ success: true, action: "like" });
                });
            } else {
                const deleteQuery = "DELETE FROM likes WHERE postid = ? AND username = ?";
                const deleteValues = [postId, username];

                db.query(deleteQuery, deleteValues, (err, result) => {
                    if (err) return res.json(err);
                    return res.json({ success: true, action: "unlike" });
                });
            }
        });
    });
});

// Handle disliking a post
app.post("/dislike", (req, res) => {
    const postId = req.body.id;
    const username = req.body.user;

    const checkLikeQuery = "SELECT * FROM likes WHERE postid = ? AND username = ?";
    const checkLikeValues = [postId, username];

    db.query(checkLikeQuery, checkLikeValues, (err, likeData) => {
        if (err) return res.json(err);

        if (likeData && likeData.length > 0) {
            const deleteLikeQuery = "DELETE FROM likes WHERE postid = ? AND username = ?";
            const deleteLikeValues = [postId, username];

            db.query(deleteLikeQuery, deleteLikeValues, (err, result) => {
                if (err) return res.json(err);
            });
        }

        const toggleQuery = "SELECT * FROM dislikes WHERE postid = ? AND username = ?";
        const toggleValues = [postId, username];

        db.query(toggleQuery, toggleValues, (err, data) => {
            if (err) return res.json(err);

            if (!data || data.length === 0) {
                const insertQuery = "INSERT INTO dislikes (`postid`, `username`) VALUES (?, ?)";
                const insertValues = [postId, username];

                db.query(insertQuery, insertValues, (err, result) => {
                    if (err) return res.json(err);
                    return res.json({ success: true, action: "dislike" });
                });
            } else {
                const deleteQuery = "DELETE FROM dislikes WHERE postid = ? AND username = ?";
                const deleteValues = [postId, username];

                db.query(deleteQuery, deleteValues, (err, result) => {
                    if (err) return res.json(err);
                    return res.json({ success: true, action: "undislike" });
                });
            }
        });
    });
});


// Update the number of likes
app.post("/setLike", (req, res) => {
    const postId = req.body.id;

    const getQuery = "SELECT * FROM likes WHERE postid = ?";
    const getValues = [postId];

    db.query(getQuery, getValues, (err, data) => {
        if (err) return res.json(err);

        const likes = data.length;

        const setQuery = "UPDATE posts SET numlikes = ? WHERE id = ?";
        const setValues = [likes, postId];

        db.query(setQuery, setValues, (err, result) => {
            if (err) return res.json(err);
            return res.json({success: true });
        });
    });
});


// Update the number of dislikes
app.post("/setDislike", (req, res) => {
    const postId = req.body.id;

    const getQuery = "SELECT * FROM dislikes WHERE postid = ?";
    const getValues = [postId];

    db.query(getQuery, getValues, (err, data) => {
        if (err) return res.json(err);

        const dislikes = data.length;

        const setQuery = "UPDATE posts SET numdislikes = ? WHERE id = ?";
        const setValues = [dislikes, postId];

        db.query(setQuery, setValues, (err, result) => {
            if (err) return res.json(err);
            return res.json({success: true });
        });
    });
});

// Handle liking a reply
app.post("/rlike", (req, res) => {
    const postId = req.body.id;
    const username = req.body.user;

    const checkDislikeQuery = "SELECT * FROM dislikes WHERE replyid = ? AND username = ?";
    const checkDislikeValues = [postId, username];

    db.query(checkDislikeQuery, checkDislikeValues, (err, dislikeData) => {
        if (err) return res.json(err);

        if (dislikeData && dislikeData.length > 0) {
            const deleteDislikeQuery = "DELETE FROM dislikes WHERE replyid = ? AND username = ?";
            const deleteDislikeValues = [postId, username];

            db.query(deleteDislikeQuery, deleteDislikeValues, (err, result) => {
                if (err) return res.json(err);
            });
        }

        const toggleQuery = "SELECT * FROM likes WHERE replyid = ? AND username = ?";
        const toggleValues = [postId, username];

        db.query(toggleQuery, toggleValues, (err, data) => {
            if (err) return res.json(err);

            if (!data || data.length === 0) {
                const insertQuery = "INSERT INTO likes (`replyid`, `username`) VALUES (?, ?)";
                const insertValues = [postId, username];

                db.query(insertQuery, insertValues, (err, result) => {
                    if (err) return res.json(err);
                    return res.json({ success: true, action: "like" });
                });
            } else {
                const deleteQuery = "DELETE FROM likes WHERE replyid = ? AND username = ?";
                const deleteValues = [postId, username];

                db.query(deleteQuery, deleteValues, (err, result) => {
                    if (err) return res.json(err);
                    return res.json({ success: true, action: "unlike" });
                });
            }
        });
    });
});

// Handle disliking a reply
app.post("/rdislike", (req, res) => {
    const postId = req.body.id;
    const username = req.body.user;

    const checkLikeQuery = "SELECT * FROM likes WHERE replyid = ? AND username = ?";
    const checkLikeValues = [postId, username];

    db.query(checkLikeQuery, checkLikeValues, (err, likeData) => {
        if (err) return res.json(err);

        if (likeData && likeData.length > 0) {
            const deleteLikeQuery = "DELETE FROM likes WHERE replyid = ? AND username = ?";
            const deleteLikeValues = [postId, username];

            db.query(deleteLikeQuery, deleteLikeValues, (err, result) => {
                if (err) return res.json(err);
            });
        }

        const toggleQuery = "SELECT * FROM dislikes WHERE replyid = ? AND username = ?";
        const toggleValues = [postId, username];

        db.query(toggleQuery, toggleValues, (err, data) => {
            if (err) return res.json(err);

            if (!data || data.length === 0) {
                const insertQuery = "INSERT INTO dislikes (`replyid`, `username`) VALUES (?, ?)";
                const insertValues = [postId, username];

                db.query(insertQuery, insertValues, (err, result) => {
                    if (err) return res.json(err);
                    return res.json({ success: true, action: "dislike" });
                });
            } else {
                const deleteQuery = "DELETE FROM dislikes WHERE replyid = ? AND username = ?";
                const deleteValues = [postId, username];

                db.query(deleteQuery, deleteValues, (err, result) => {
                    if (err) return res.json(err);
                    return res.json({ success: true, action: "undislike" });
                });
            }
        });
    });
});


// Update the number of likes
app.post("/rsetLike", (req, res) => {
    const postId = req.body.id;

    const getQuery = "SELECT * FROM likes WHERE replyid = ?";
    const getValues = [postId];

    db.query(getQuery, getValues, (err, data) => {
        if (err) return res.json(err);

        const likes = data.length;

        const setQuery = "UPDATE replies SET numlikes = ? WHERE id = ?";
        const setValues = [likes, postId];

        db.query(setQuery, setValues, (err, result) => {
            if (err) return res.json(err);
            return res.json({success: true });
        });
    });
});


// Update the number of dislikes
app.post("/rsetDislike", (req, res) => {
    const postId = req.body.id;

    const getQuery = "SELECT * FROM dislikes WHERE replyid = ?";
    const getValues = [postId];

    db.query(getQuery, getValues, (err, data) => {
        if (err) return res.json(err);

        const dislikes = data.length;

        const setQuery = "UPDATE replies SET numdislikes = ? WHERE id = ?";
        const setValues = [dislikes, postId];

        db.query(setQuery, setValues, (err, result) => {
            if (err) return res.json(err);
            return res.json({success: true });
        });
    });
});


app.listen(8080, () => {
    console.log("Connected to backend");
})