

import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Join = () => {

  const navigate = useNavigate()   // 페이지 이동

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordCheck: "",
    email: "",
    phone: "",
    displayname: "",
    birth: "",
    gender: ""
  })

  // input 바뀌면 formData 객체에서 해당 값만 업데이트
  const onChange = (e) => {
    setFormData({
      ...formData,   // (기존값 전부 가져옴)처음엔 빈값 > 입력할 수록 값이 누적
      [e.target.name]: e.target.value   // [e.target.name]: e.target.value : 바뀐값 덮어씌기 
      // ex) name = "email", value = "test@gmail.com" > email: "test@gmail.com"
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()


    const {
    username, password, passwordCheck, email, phone, displayname, birth, gender
    } = formData   // formData 안에 있는 값들을 하나씩 꺼내서 변수로 만들기

    if(!username.trim()) return alert('아이디를 입력해주세요!')
    if(!password.trim()) return alert('비밀번호를 입력해주세요!')
    if(password !== passwordCheck) return alert('비밀번호가 일치하지 않습니다!')
    if(!email.trim()) return alert('이메일을 입력해주세요!')
    if(!phone.trim()) return alert('휴대폰 번호를 입력해주세요!')
    if(!displayname.trim()) return alert('이름을 입력해주세요!')
    if(!birth.trim()) return alert('생년월일을 선택해주세요!')
    if(!gender) return alert ('성별을 선택해주세요!')

    try{
      await axios.post(`${process.env.REACT_APP_API_URL}/member`, formData);
      alert ('회원가입 완료')
      navigate('/login');
    } catch(err){
      console.log("status:", err.response?.status);
      console.log("data:", err.response?.data);
      alert('회원가입 실패')
    }
  }

  // 체크표시 제한
    const isValidId = formData.username.length >= 3
    const isValidPw = formData.password.length >= 3
    const isValidPwCheck =
    formData.passwordCheck.length >= 3 &&
    formData.password === formData.passwordCheck

    const isValidPhone = /^\d{11}$/.test(formData.phone)
    // 숫자 11자리만 허용

    const isValidEmail = formData.email.endsWith('.com')
    // .com으로 끝나는지 확인

  


  return (
        <>
            <div className='join_wrap'>
                <h2>회원가입</h2>
                <div className='h2_line'></div>
    
                <form onSubmit={handleSubmit}> 
                    <div className='id_area'>
                        <span className={`checkbox ${isValidId ? 'active' : ''}`}></span>
                        <input className='id' name='username' type='text' placeholder='아이디' value={formData.username} onChange={onChange}/>
                    </div>
    
                    <div className='pw_area'>
                        <span className={`checkbox ${isValidPw ? 'active' : ''}`}></span>
                        <input className='pw' name='password' type='password' placeholder='비밀번호' value={formData.password} onChange={onChange}/>
                    </div>

                    <div className='pwck_area'>
                        <span className={`checkbox ${isValidPwCheck ? 'active' : ''}`}></span>
                        <input className='pw_ck' name='passwordCheck' type='password' placeholder='비밀번호 재확인' value={formData.passwordCheck} onChange={onChange}/>
                    </div>

                    <div className='email_area'>
                        <span className={`checkbox ${isValidEmail ? 'active' : ''}`}></span>
                        <input className='email' name='email' type='email' placeholder='이메일' value={formData.email} onChange={onChange}/>
                    </div>

                    <div className='phone_area'>
                        <span className={`checkbox ${isValidPhone ? 'active' : ''}`}></span>
                        <input className='phone' name='phone' type='tel' placeholder='휴대폰 번호' value={formData.phone} onChange={onChange}/>
                    </div>

                    <div className='displayname_area'>
                        <span className={`checkbox ${formData.displayname ? 'active' : ''}`}></span>
                        <input className='displayname' name='displayname' type='text' placeholder='이름' value={formData.displayname} onChange={onChange}/>                        
                    </div>

                    <div className='birth_area'>
                        <span className={`checkbox ${formData.birth ? 'active' : ''}`}></span>
                        <input className='birth' name='birth' type='date' placeholder='생년월일(8자리)' value={formData.birth} onChange={onChange}/>
                    </div>

                    <div className='gender_area'>
                        <span className={`checkbox ${formData.gender ? 'active' : ''}`}></span>
                        <label>
                            <input className='male' name='gender' type='radio' value='male' checked={formData.gender === 'male'}
                                   onChange={onChange}/>
                            <span className='male_txt'>남자</span>
                        </label>

                        <label>
                            <input className='female' type='radio' name='gender' value='female' checked={formData.gender === 'female'}
                                   onChange={onChange}/>
                            <span className='male_txt'>여자</span>
                        </label>
                    </div>
                    
                    <div className='button_area'>
                        <button type='submit'>가입하기</button>
                    </div>                    
                </form>
              
            </div>
        </>

  )
}

export default Join