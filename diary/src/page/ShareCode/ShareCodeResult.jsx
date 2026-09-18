import axios from 'axios'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

const ShareCodeResult = () => {

    const location = useLocation()
    const shareCode = location.state?.shareCode

    // 코드 복사하기 기능 만들기
    const handleCopy = async () => {
        try{
            await navigator.clipboard.writeText(shareCode)
            toast.success("코드가 복사되었습니다!", {className: 'custom_toast'})
        } catch(err){
            console.error("복사 실패", err)
            toast.error("복사에 실패하였습니다..", {className: 'custom_toast'})
        }
    }

  return (
        <>
            <div className='result_wrap'>

                <h2>생성된 공유코드</h2>
                <div className='h2_line'></div>

                <p className='code_area'>{shareCode}</p>

                <div className='button_area'>
                    <button onClick={handleCopy}>코드 복사하기</button>
                </div>

                <div className='button_area2'>
                    <Link to='/sharecode/input' className='button2'>공유코드 입력하러 가기</Link>
                </div>
                
              
            </div>
        </>
  )
}

export default ShareCodeResult