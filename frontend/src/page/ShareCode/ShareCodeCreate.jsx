import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const ShareCodeCreate = () => {

  const [roomname, setRoomname] = useState('')
  const [maxMember, setMaxMember] = useState('')
  const {shareCode} = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) =>{
    e.preventDefault()

    if (!roomname.trim()){
      return alert('방 이름을 입력해주세요!')
    }

    if (!maxMember){
      return alert('인원수를 설정해주세요!')
    }

    if (maxMember < 1 || maxMember > 10){
      return alert('인원수는 1~10명까지 가능합니다!')
    }

    try{
      // 방 생성
      await axios.post(`${process.env.REACT_APP_API_URL}/api/sharecode/room/${shareCode}`, {roomname, maxMember})

      // 방 생성자 자동 입장
      await axios.post(`${process.env.REACT_APP_API_URL}/api/sharecode/join/${shareCode}`, {username: localStorage.getItem("username")})

      alert('공유방 생성완료!')

      navigate(`/share/room/${shareCode}`)

    } catch(err){
        const message = err.response?.data

        if (message === "정원 초과입니다"){
          alert("정원 초과입니다")
        }
        else if (message === "이미 참여한 방입니다"){
          alert("이미 참여한 방입니다")
        }
        else if (message === "방이 존재하지 않습니다"){
          alert("존재하지 않는 방입니다")
        }
        else{
          alert("오류가 발생했습니다")
        }
        console.error(err)
    }
  }

  return (
    <>
      <div className='sc_create_wrap'>

        <h2>공유방 설정</h2>
        <div className='h2_line'></div>
        
        <form onSubmit={handleSubmit}>

          <div className='input_area'>
            <input className='input1' type='text' placeholder='방 이름' value={roomname} onChange={(e) => setRoomname(e.target.value)}></input>
            <input type='number' placeholder='방 인원 수(최대 10명)' value={maxMember} onChange={(e) => setMaxMember(Number(e.target.value))}></input>
          </div>

          <div className='button_area'>
            <button type='submit'>공유방 생성하기</button>
          </div>

        </form>

      </div>    
    </>
  )
}

export default ShareCodeCreate