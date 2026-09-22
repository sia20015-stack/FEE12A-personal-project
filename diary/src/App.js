
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Main from './components/section/Main'
import Home from './page/Home'
import Private from './page/Private'
import Share from './page/Share'
import Open from './page/Open'
import Login from './page/Login'
import Join from './page/Join'
import PrivateWrite from './page/Write/PrivateWrite'
import ShareWrite from './page/Write/ShareWrite'
import OpenWrite from './page/Write/OpenWrite'
import Mylog from './page/Mylog'
import PostDetail from './page/PostDetail'
import PostEdit from './page/PostEdit'
import ShareCodeResult from './page/ShareCode/ShareCodeResult'
import { Slide, ToastContainer } from 'react-toastify'
import ShareCodeInput from './page/ShareCode/ShareCodeInput'
import ShareCodeCreate from './page/ShareCode/ShareCodeCreate'
import ShareRoom from './page/ShareRoom'





// const Home = lazy(()=>import('./pages/Home'));
// const Today = lazy(()=>import('./pages/Today'));
// const Music = lazy(()=>import('./pages/Music'));
// const Movie = lazy(()=>import('./pages/Movie'));

// const Home = lazy(()=>import('어쩌구'));  >>  코드를 필요할 때만 불러오는 기능!


const App = () => {
  return (
    <BrowserRouter>

        <ToastContainer position='bottom-center' autoClose={1200} hideProgressBar transition={Slide} closeButton={false}/> 

        <Routes>

          <Route element={<Main/>}> 
            <Route path='/' element={<Home/>}/>

            <Route path='/login' element={<Login/>}/>
            <Route path='/join' element={<Join/>}/>
            <Route path='/mylog' element={<Mylog/>}/>

            <Route path='/private/write' element={<PrivateWrite/>}/>

            <Route path='/share/write' element={<ShareWrite/>}/>
            <Route path='/open/write' element={<OpenWrite/>}/>

            <Route path='/private' element={<Private/>}/>
            <Route path='/share' element={<Share/>}/>
            <Route path='/share/room/:shareCode' element={<ShareRoom/>}/>
            <Route path='/open' element={<Open/>}/>

            <Route path='/sharecode/result' element={<ShareCodeResult/>}/>
            <Route path='/sharecode/input' element={<ShareCodeInput/>}/>
            <Route path='/shareroom/create/:shareCode' element={<ShareCodeCreate/>}/>

            <Route path='/:type/posts/:id' element={<PostDetail/>}/>
            <Route path='/:type/posts/:id/edit' element={<PostEdit/>}/>

          </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default App

// Suspense      : lazy로 불러오는 동안 잠깐 보여줄 화면 (페이지 로딩중일 때 대신 보여줄 화면)

// BrowserRouter : URL 주소로 페이지 바꿔주는 시스템
// Routes        : 길 목록 넣는 곳
// Route         : 실제 길 목록
// 이거 쓸라면  import { BrowserRouter, Route, Routes } from 'react-router-dom'  해줘야함!
// react-router-dom 이것도 설치해줘야함.. >> 터미널에 npm install react-router-dom
// ToastContainer: 이거 alert 대신 띄워줄거!