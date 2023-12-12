import React from 'react';


export const Landing = () => {

    return (


        <div>
            <header className="">

                <button className='LogIn'><a href='/signIn'>Sign In</a></button>
            </header>
            <div className="main">
                <span>Channel-Based Tool for <span className="greentext">Programming Issues</span></span>
                <p>Get solutions to your programming questions and <br></br> offer your own solutions to other
                    questions.</p>
                <a href='/signUp'>
                    <button>Get Started</button>
                </a>
            </div>
        </div>


    );


}