import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignupForm from './components/SignupForm.jsx';
import LoginForm from './components/LoginForm.jsx';
import VerifyOtp from './components/VerifyOtp.jsx';

import { Provider } from "react-redux";
import { store } from './store/store.js';
import HomePage from './page/Home.jsx';
import Dashboard from './page/Dashboard.jsx';
import ProfilePage from './components/ProfilePage.jsx';
import ChatInbox from './components/ChatInbox.jsx';
import ChatPage from './components/ChatPage.jsx';
import ConnectionsPage from './components/ConnectionPage.jsx';
import PostList from './components/PostList.jsx';
import RequestsPage from './components/RequestsPage.jsx';
import AddPost from './components/AddPost.jsx';
import Search from './components/Search.jsx';
import ChatInboxPage from './components/ChatInboxPage.jsx';
import { SocketProvider } from './SocketWrapper.jsx';
import Video from './components/video/Video.jsx';
import VideoCallComponent from './components/video/VideoCallComponent.jsx';


const router = createBrowserRouter([
  {
    path:"/",
    element: <App />,
    children:[
      {
        path:"/",
        element:<HomePage/>
      },{
        path:"/login",
        element:<LoginForm/>
      },{
        path:"/verifyOtp",
        element:<VerifyOtp/>
      },{
        path:"/signup",
        element:<SignupForm/>
      },{
        path:"/dashboard",
        element:<Dashboard/>,
        children:[
          {
            path:"/dashboard",
            element:<ProfilePage/>
          },
          {
            path:"/dashboard/chat",
            element:<ChatInboxPage/>
          },{
            path:"/dashboard/chat/:personId",
            element:<ChatPage/>
          },{
            path:"/dashboard/feed",
            element:<PostList/>
          },{
            path:"/dashboard/requests",
            element:<RequestsPage/>
          },{
            path:"/dashboard/addpost",
            element:<AddPost/>
          },{
            path:"/dashboard/connections",
            element:<ConnectionsPage/>
          },{
            path:"/dashboard/search",
            element:<Search/>
          },{
            path:"/dashboard/vc",
            element:<Video/>
          },
        ]
      },{
        path:'/vc/:roomID',
        element:<VideoCallComponent/>
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(

  // <React.StrictMode>
    <Provider  store={store}>
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
    </Provider>
    
  // </React.StrictMode>,
)
