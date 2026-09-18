import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import RoomCard from './RoomCard'

const Share = () => {

  const [rooms, setRooms] = useState([])
  const [shareCode, setShareCode] = useState('')
  const [members, setMembers] = useState([])
  const [posts, setPosts] = useState([])

  const [username] = useState(localStorage.getItem("username"))

  // 페이징처리
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const pageGroupSize = 5
  const currentGroup = Math.floor(page / pageGroupSize)
  const startPage = currentGroup * pageGroupSize
  const endPage = Math.min(
    startPage + pageGroupSize,
    totalPages
  )

  useEffect(()=>{
      fetchPosts(0)
    }, [])

  const fetchPosts = async (pageNum = 0) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts/share`,
        {
          params: {
            username,
            page: pageNum,
            size: 8
          }
        }
      )

      setPosts(res.data.content)
      setTotalPages(res.data.totalPages)
      setPage(pageNum)

    } catch (err) {
      console.error(err)
    }
  }


  const fetchMembers = async (code) => {
    try{
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/sharecode/members/${code}`)
      return res.data
    } catch(err){
      console.error(err)
      return []
    }
  }

  

  const navigate = useNavigate()

  const handleCreate = async () => {
      try{
          const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/sharecode`, {username: localStorage.getItem("username")})

          const code = res.data.sharecode

          navigate(`/sharecode/result`, {state: {shareCode: code}})
      } catch(err){
        console.error(err)
      }
  }

  useEffect(() => {
  fetchRooms(0)
}, [])

    const fetchRooms = async (pageNum = 0) => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/sharecode/list`,
          {
            params: {
              username,
              page: pageNum,
              size: 6
            }
          }
        )

        const data = res.data

        setRooms(data?.content ?? data ?? [])
        setTotalPages(data?.totalPages ?? 1)
        setPage(pageNum)

      } catch (err) {
        console.error(err)
        setRooms([])
      }
    }


  return (
    <>
      <div className='share_wrap'>
        <div className='B_share'>
          <h2>교환 일기장</h2>
          <div className="pagination">

            {/* 이전 그룹 (5개 이상일 때만 등장) */}
            {startPage > 0 && (
              <button onClick={() => fetchRooms(startPage - pageGroupSize)}>
                ←
              </button>
            )}

            {/* 현재 그룹 */}
            {Array.from({
              length: Math.min(pageGroupSize, totalPages - startPage)
            }).map((_, idx) => {
              const pageNumber = startPage + idx

              return (
                <button
                  key={pageNumber}
                  onClick={() => fetchRooms(pageNumber)}
                  className={page === pageNumber ? "active" : ""}
                >
                  {pageNumber + 1}
                </button>
              )
            })}

            {/* 다음 그룹 */}
            {endPage < totalPages && (
              <button onClick={() => fetchRooms(endPage)}>
                →
              </button>
            )}

          </div>
        </div>

        <div className='h2line'></div>
        <div className='commentbtn_wrap'>
          <p className='comment'>공유코드를 생성하여 친구들과 함께 일상을 기록하고 공유해보세요</p>
          <div className='codebtn_wrap'>
            <button onClick={handleCreate}>공유코드 생성</button>
            <button onClick={()=>navigate(`/sharecode/input`)}>공유코드 입력</button>
          </div>
        </div>

          
            {rooms.length === 0 ? (
              <p className='diarynone'>아직 교환 일기장이 생성되지 않았습니다</p>
            ) : (
              <div className='A_share'>
              {rooms.map((room) => (
                <RoomCard
                  key={room.shareCode}
                  room={room}
                  onClick={() => navigate(`/share/room/${room.shareCode}`)}
                />
              ))}
              </div>
            )}
          
              
      </div>
      
    </>
  )
}

export default Share