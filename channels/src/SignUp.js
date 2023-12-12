import React, {useEffect, useRef, useState} from 'react';
import axios from './api/axios';

import {useNavigate} from 'react-router-dom';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;


export const SignUp = () => {


    const userRef = useRef(null);
    const errRef = useRef();

    const [userName, setUserName] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setvalidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [confirmPwd, setConfirmPwd] = useState('');
    const [validConfirm, setValidConfirm] = useState(false);
    const [confirmFocus, setConfirmFocus] = useState(false);

    const [errMessage, setErrMessage] = useState('');
    const [success, setSuccess] = useState(false);

    const [level, setLevel] = useState('');


    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        const result = USER_REGEX.test(userName);
        console.log(result);
        console.log(userName);
        setValidName(result);
    }, [userName])

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd);
        setvalidPwd(result);
        const confirm = pwd === confirmPwd;
        setValidConfirm(confirm);

    }, [pwd, confirmPwd])


    useEffect(() => {
        setErrMessage('');
    }, [userName, pwd, confirmPwd])


    const navigate = useNavigate();

    // Sign the user up
    const handleSubmit = async (e) => {
        e.preventDefault();
        const u = USER_REGEX.test(userName);
        const p = PWD_REGEX.test(pwd);
        if (!u || !p) {
            setErrMessage("Invalid Entry");
            return;
        }

        try {
            const response = await axios.post("http://localhost:8080/signUp", {
                name: userName,
                password: pwd,
                level: level
            });


            if (response.data.errno === 1062) {
                setErrMessage("Username taken");
            } else {
                setSuccess(true);
                navigate("/signIn");
            }

        } catch (err) {
            console.log(err)

        }

    }


    return (

        <div className='smain'>
            <p ref={errRef} className={errMessage ? "errMessage" : "offscreen"} aria-live="assertive">{errMessage}</p>
            <h2> Sign Up </h2>
            <form onSubmit={handleSubmit} name='signUp'>
                <div className='enter'>
                    <label htmlFor="username">
                        <span className={validName ? "valid" : "hide"}>Valid</span>
                        <span className={validName || !userName ? "hide" : "invalid"}>Invalid</span>

                    </label><br></br>
                    <input required
                           type="text"
                           name="name"
                           placeholder="Username"
                           id="username"
                           ref={userRef}
                           autoComplete="off"
                           onChange={(e) => setUserName(e.target.value)}
                           aria-invalid={validName ? "false" : "true"}
                           aria-describedby="userNotes"
                           onFocus={() => setUserFocus(true)}
                           onBlur={() => setUserFocus(false)}
                    ></input>
                    <p id="userNotes"
                       className={userFocus && userName && !validName ? "instructions" : "offscreen"}>
                        Must contain 4-24 characters.<br></br>
                        Must begin with a letter.<br></br>
                        Letters, numbers, underscores, and hyphens are allowed.

                    </p>
                </div>
                <div className='enter'>
                    <label htmlFor="password">
                        <span className={validPwd ? "valid" : "hide"}>Valid</span>
                        <span className={validPwd || !pwd ? "hide" : "invalid"}>Invalid</span>

                    </label><br></br>
                    <input required
                           type="password"
                           name="password"
                           placeholder="Password"
                           id="password"
                           onChange={(e) => setPwd(e.target.value)}
                           aria-invalid={validPwd ? "false" : "true"}
                           aria-describedby="pwdNote"
                           onFocus={() => setPwdFocus(true)}
                           onBlur={() => setPwdFocus(false)}
                    ></input>
                    <p id="pwdNotes"
                       className={pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"}>
                        Must contain 8-24 characters.<br></br>
                        Must include uppercase and lowercase letters, a number, and a special character.<br></br>
                        Allowed special characters: !, @, #, $, %

                    </p>
                </div>

                <div className='enter'>
                    <label htmlFor="confirmPwd">
                        <span className={validConfirm && confirmPwd ? "validC" : "hide"}>Passwords match</span>
                        <span
                            className={validConfirm || !confirmPwd ? "hide" : "invalidC"}>Passwords do not match</span>
                    </label><br></br>
                    <input required
                           type="password"
                           name="level"
                           placeholder="Re-enter Password"
                           id="confirmPwd"
                           onChange={(e) => setConfirmPwd(e.target.value)}
                           aria-invalid={validConfirm ? "false" : "true"}
                           aria-describedby="confirmNotes"
                           onFocus={() => setConfirmFocus(true)}
                           onBlur={() => setConfirmFocus(false)}

                    ></input>
                    <p id="confirmNotes"
                       className={confirmFocus && !validConfirm ? "instructions" : "offscreen"}>
                        Must match the password above.
                    </p>
                </div>

                <div className='enter'>
                    <select required
                            onChange={(e) => setLevel(e.target.value)}
                            value={level}
                            placeholder='Select Level'>
                        <option value="none" defaultValue hidden>Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                    </select>

                </div>
                <button disabled={!validName || !validPwd || !validConfirm ? true : false}>Sign Up</button>
            </form>
            <p>Already have an account? <a className='greentext' href='/signIn'>Sign In</a></p>

        </div>)
}

