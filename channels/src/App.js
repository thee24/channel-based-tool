import logo from './logo.png';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';


import './App.css';
import {Landing} from './Landing';
import {SignIn} from './SignIn';
import {SignUp} from './SignUp';
import {Home} from './Home';
import {CreateChannel} from './CreateChannel';
import {ViewChannel} from './ViewChannel';
import {Channel} from './Channel';
import {Replies} from './Replies';
import {AdminHome} from './AdminHome';
import {ViewChannels} from './ViewChannels';
import {DeleteChannel} from './DeleteChannel';
import {ViewUsers} from './ViewUsers';
import {DeleteUser} from './DeleteUser';
import {ViewPosts} from './ViewPosts';
import {DeletePost} from './DeletePost';
import {ViewReplies} from './ViewReplies';
import {DeleteReply} from './DeleteReply';
import {NestedReply} from './NestedReply';

function App() {
    return (<div className="App">
            <header className="App-header">
                <a href="/home"><img src={logo} className="App-logo" alt="logo"/> </a>
                <Router>
                    <Routes>
                        <Route exact path='/' element={<Landing/>}/>
                        <Route exact path='/signIn' element={<SignIn/>}/>
                        <Route exact path='/signUp' element={<SignUp/>}/>
                        <Route exact path='/home' element={<Home/>}/>
                        <Route exact path='/createChannel' element={<CreateChannel/>}/>
                        <Route exact path='/viewChannels' element={<ViewChannel/>}/>
                        <Route path='/channels/:name' element={<Channel/>}></Route>
                        <Route path='channels/:name/:id/replies' element={<Replies/>}></Route>
                        <Route path='channels/:name/:id/replies/:repId' element={<NestedReply/>}></Route>


                        {/* Admin Routes  */}
                        <Route exact path='/adminHome' element={<AdminHome/>}/>
                        <Route exact path='/allChannels' element={<ViewChannels/>}/>
                        <Route exact path='/deleteChannel' element={<DeleteChannel/>}/>
                        <Route exact path='/viewUsers' element={<ViewUsers/>}/>
                        <Route exact path='/deleteUser' element={<DeleteUser/>}/>
                        <Route exact path='/viewPosts' element={<ViewPosts/>}/>
                        <Route exact path='/deletePost' element={<DeletePost/>}/>
                        <Route exact path='/viewReplies' element={<ViewReplies/>}/>
                        <Route exact path='/deleteReply' element={<DeleteReply/>}/>


                    </Routes>
                </Router>

            </header>


        </div>);
}

export default App;
