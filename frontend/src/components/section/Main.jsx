import React from 'react'
import Header from './Header'
import Footer from './Footer'
import Side from './Side'
import { Outlet, useLocation } from 'react-router-dom'
import Menu from './Menu'

const Main = (props) => {

    // useLocation() : 지금 내가 어떤 URL에 있는지 알려주는 훅
    const location = useLocation()
  
    // 로그인/회원가입 페이지인지 체크하는 함수
    // const isAuthPage = location.pathname === '/login' || location.pathname === '/join' 
    //                 || location.pathname === '/sharecode/result' || location.pathname === '/sharecode/input' || location.pathname.startsWith === ('/shareroom/create/')

    // 위에랑 같은데 줄인거임
    const isAuthPage = ['/login', '/join', '/sharecode/result', '/sharecode/input'].includes(location.pathname) ||
      location.pathname.startsWith('/shareroom/create/')

    // 글쓰기 페이지인지 체크하는 함수
    const authpage2 = ['/private/write', '/share/write', '/open/write']
    const isAuthPage2 = authpage2.includes(location.pathname) || location.pathname.endsWith('/edit') || location.pathname.startsWith('/share/write')

  return (
    <>
        <div className='container'>
          <Header/>
          <div className={isAuthPage ? 'main_wrap auth' : 'main_wrap'}>
              <div className='menu_area'>
                {!isAuthPage && <Menu/>}
                {/* !isAuthPage && <Menu/> : 로그인/회원가입 페이지가 아닐때만 Menu 보이기! */}
              </div>
              <div className={isAuthPage ? 'contain auth' : 'contain'}>
                  {!isAuthPage && !isAuthPage2 && <Side/>}
                  <main id='main' role='main'>
                    <Outlet />
                  </main>
                  <Footer/>
              </div>
          </div> 
        </div>
    </>
  )
}

export default Main

// 헤더, 메인, 푸터 항상 고정인데
// <Outlet /> :  페이지 꽂는 공간역할! (Router가 대신 넣어줌)