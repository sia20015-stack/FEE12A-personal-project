import React from 'react'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <div className='header_wrap'>
      <Link to='/' className='header_logo'>
          <span>#FEE12A</span> 
      </Link>
    </div>
    
  )
}

export default Logo

// a href 보다 Link나 NavLink를 많이 씀!!
// a href : 주로 외부 사이트로 이동할 때, 약간 새로고침하는 것마냥 띵!! 하고 페이지 로딩됨
// Link / NavLink : 띵!! 하는 느낌없이 부드럽게 페이지 로딩
// NavLink는 주로 메뉴같은거에 씀

