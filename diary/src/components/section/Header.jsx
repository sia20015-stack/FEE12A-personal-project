
import React from 'react'
import Logo from '../header/Logo'
import Menu from './Menu'
import Sns from '../header/Sns'
import { useLocation } from 'react-router-dom'


const Header = () => {
  

  return (
    <header id='header' role='banner'>
        <Logo/>
        {/* <Sns/>       */}
    </header>
  )
}

export default Header