import React from 'react'
import Sidebar from '../components/dashboard/Sidebar'
import Home from "./Home"
import ProfilePage from "../components/ProfilePage"
import ConnectionsPage from '../components/ConnectionPage'
import ChatInboxPage from '../components/ChatInboxPage'
import ChatMessageBox from '../components/ChatMessageBox'
import ChatPage from '../components/ChatPage'
import RequestsPage from '../components/RequestsPage'
import { Outlet } from 'react-router-dom'
import AddPost from '../components/AddPost'
import PostList from '../components/PostList'

const Dashboard = () => {
  
  return (
    <div className='md:flex max-h-screen'>
      <Sidebar/>
      <div className='w-full max-h-screen overflow-y-scroll' >
        
      <Outlet/>
      </div>
        
    </div>
  )
}

export default Dashboard