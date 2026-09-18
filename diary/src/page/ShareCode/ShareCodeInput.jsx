import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'


const ShareCodeInput = () => {

    const [sharecode, setSharecode] = useState('')
    const username = localStorage.getItem("username")
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!sharecode.trim()) {
            return alert('공유코드를 입력해주세요!')
        }

        try{
            // 서버에 코드 상태 확인
            const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/sharecode/${sharecode}?username=${username}`)

            const {exists, isNewRoom, alreadyJoined} = res.data

            // 이거 아래 입력순서 중요!! 존재하는가 > 이미 참여했는가 > 새 방인가 > 기존에 있는 방인가

            // 존재하지 않는 코드일 경우
            if (!exists) {
                alert('존재하지 않는 코드입니다')
                return
            }

            // 이미 참여한 경우
            if (alreadyJoined){
                alert('이미 참여하고 있는 방입니다!')
                navigate(`/share/room/${sharecode}`)
                return
            }

            // 새 코드 입력하여 방 생성 -> 방 이름 입력페이지
            if(isNewRoom){
                navigate(`/shareroom/create/${sharecode}`)
                return
            }

            // 생성된 방 처음 입장
            await axios.post(`${process.env.REACT_APP_API_URL}/api/sharecode/join/${sharecode}`, {username: localStorage.getItem("username")})

            navigate(`/share/room/${sharecode}`)

        } catch(err){
            console.error(err)

            const message = err.response?.data?.message

            if(message === '정원 초과입니다'){
                alert('방 인원이 가득 찼습니다!')
                return
            }

            alert(message || '오류가 발생했습니다')
        }
    }
    


  return (
        <>
            <div className='input_wrap'>

                <h2>공유코드 입력</h2>
                <div className='h2_line'></div>

                <form onSubmit={handleSubmit}>
                    <div className='input_area'>
                        <input type='text' placeholder='공유코드' maxLength={8} value={sharecode} 
                               onChange={(e) => setSharecode(e.target.value.toUpperCase().replace(/\s/g, ''))}></input>
                    </div>
                    

                    <div className='button_area'>
                        <button type='submit'>교환 일기장 시작하기</button>
                    </div>
                </form>
                
                
              
            </div>
        </>
  )
}

export default ShareCodeInput