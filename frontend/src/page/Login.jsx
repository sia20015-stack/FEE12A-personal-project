
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {

  const [id, setId] = useState('')   // id: 상자 안 내용, setID: 상자 내용 바꾸기, useState: 값을 저장하는 상자(처음에는 아무것도 X -> '' 빈 값으로 시작)
  const [pw, setPw] = useState('')
  const [remember, setRemember] = useState(false)   // false: 처음에는 체크 안 된 상태로 설정

  const navigate = useNavigate()

  const handleSubmit = async (e) => {  // e: 무슨일이 발생했는지 알려주는 이벤트 객체
    e.preventDefault()    // form 은 제출하면 새로고침 되므로, 그걸 막는 코드
    // console.log(id, pw)   // 지금까지 입력한 값 출력(값 잘 들어오는지 확인용)

    // 로그인 버튼 클릭 시, 입력칸이 하나라도 비어있을 경우 띄우는 경고창 (trim(): 공백만 입력하는 것 방지!)
    if(!id.trim()) return alert('아이디를 입력해주세요!')
    if(!pw.trim()) return alert('비밀번호를 입력해주세요!')

    if(remember){
      localStorage.setItem('saveId', id)   // 아이디 기억하기 체크했으면 브라우저에 id 저장
      localStorage.setItem('remember', 'true')
    } else{
      localStorage.removeItem('saveId')    // 아이디 기억하기 체크 해제했으면 저장한 id 삭제
      localStorage.removeItem('remember')
    }

    const res = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {username: id, password: pw})

    if(res.data.success){
      // 로그인 성공 처리 후, 페이지 홈으로 이동
      localStorage.setItem('isLogin', 'true')

      // 로그인한 아이디 브라우저에 기억
      localStorage.setItem('username', id)
      navigate('/')
    } else{
      alert('로그인 실패')
    }

    
  }
  
  useEffect(() => {
    const saveId = localStorage.getItem('saveId')
    const savedRemember = localStorage.getItem('remember')

    if (saveId){
      setId(saveId)
    }
    if (savedRemember === 'true'){
      setRemember(true)
    }
  }, [])

  return (
    <>
        <div className='login_wrap'>
            <h2>로그인</h2>
            <div className='h2_line'></div>

            <form onSubmit={handleSubmit}>   
                <div className='id_area'>
                    <input className='id' type='text' placeholder='아이디' value={id} onChange={(e) => setId(e.target.value)}/>
                </div>

                <div className='pw_area'>
                    <input className='pw' type='password' placeholder='비밀번호' value={pw} onChange={(e) => setPw(e.target.value)}/>
                </div>

                <label>
                    <input className='id_checkbox' type='checkbox' checked={remember} onChange={(e) => setRemember(e.target.checked)}/>
                    아이디 기억하기
                </label>
                
                <div className='button_area'>
                  <button type='submit'>로그인</button>
                </div>
                
                <div className='button_area2'>
                  <Link to='/join' className='button2'>회원가입</Link>
                </div>
                
            </form>
          
        </div>
    </>
  )
}

export default Login

// <form onSubmit={handleSubmit}> : 폼이 제출되면 handelSubmit 실행 (onSubmit: 제출완료!! 버튼)
// value={id, pw} : input값은 id 또는 pw 상태값이라고 알려주는 것 (value: 화면에 보이는 값)
// onChange={(e) => setId(e.target.value) : 사용자가 입력할 때마다 id 또는 pw값을 업데이트 (onChange: 값 바꾸는 버튼)
// 전체 흐름 = 사용자 입력 → e 발생 → e.target.value 읽음 → setId 실행