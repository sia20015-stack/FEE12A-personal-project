import React, { useState } from 'react'

const Menu = () => {

  const [isLogin, setIsLogin] = useState(localStorage.getItem('isLogin') === 'true')
      // localStorage > 브라우저 안에 데이터를 영구적으로 저장해주는 공간 (로그인 및 게시글 등 새로고침이나 브라우저 껐켰해도 유지)
      // localStorage.getItem('isLogin') > 브라우저에 저장된 값 꺼내오기


  return (
    <>
      <div className='menubar'>
        {isLogin? (
          <a href='/private' className='private_diary'>
             <div>개인 일기장</div>
          </a>
        ):(
          <a href='/login' className='private_diary'>
             <div>개인 일기장</div>
          </a>
        )}
        

        <a href='/share' className='share_diary'>
          <div>공유 일기장</div>
        </a>

        <a href='/open' className='open_diary'>
          <div>전체 일기장</div>
        </a>
      </div>
    </>
  )
}

export default Menu