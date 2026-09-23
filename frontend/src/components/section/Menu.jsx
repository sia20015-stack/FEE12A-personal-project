
import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const Menu = () => {

  // useLocation() : 지금 내가 어떤 URL에 있는지 알려주는 훅
  const location = useLocation()

  // 첫 화면 페이지인지 체크하는 함수
  const isHome = location.pathname === '/'

  const getClass = (isActive) => {
    if (isHome) return 'home'
                return isActive ? 'active' : 'inactive'
  }
  // isActive : 현재 URL이 이 링크랑 일치하는지
  // isActive가 true면 active, isActive가 false면 inactive

  const [isLogin] = useState(localStorage.getItem('isLogin') === 'true')
    // localStorage > 브라우저 안에 데이터를 영구적으로 저장해주는 공간 (로그인 및 게시글 등 새로고침이나 브라우저 껐켰해도 유지)
    // localStorage.getItem('isLogin') > 브라우저에 저장된 값 꺼내오기

  return (
    <>
      <div className='menubar'>
        {isLogin ?
        (<>
          <NavLink to='/private' className={({ isActive }) => getClass(isActive)}>
            <div>개인 일기장</div>
          </NavLink>

          <NavLink to='/share' className={({ isActive }) => getClass(isActive)}>
            <div>교환 일기장</div>
          </NavLink>
        </>) : 
       (<>
          <NavLink to='/login' className={({ isActive }) => getClass(isActive)}>
            <div>개인 일기장</div>
          </NavLink>

          <NavLink to='/login' className={({ isActive }) => getClass(isActive)}>
            <div>교환 일기장</div>
          </NavLink>
        </>)}

        <NavLink to='/open' className={({ isActive }) => getClass(isActive)}>
          <div>공개 일기장</div>
        </NavLink>
      </div>
    </>
  )
}

export default Menu