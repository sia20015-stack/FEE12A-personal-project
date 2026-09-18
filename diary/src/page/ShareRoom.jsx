import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const ShareRoom = () => {

    const {shareCode} = useParams();

    const alerted = useRef(false)
    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [authorized, setAuthorized] = useState(false)

    const [posts, setPosts] = useState([])

    const [roomInfo, setRoomInfo] = useState(null)
    

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

    const removeHtml = (html) => {
    const div = document.createElement('div')
    div.innerHTML = html
    return div.textContent || div.innerText || ''
    }

  const [username] = useState(localStorage.getItem("username"))

  console.log("params username:", username)

  const fetchPosts = async (currentPage = 0) => {
    try {

        const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts/share`,
        {
            params: {
            shareCode: shareCode,
            page: currentPage,
            size: 8
            }
        }
        )

        console.log("posts response:", res.data)

        setPosts(res.data.content)
        setTotalPages(res.data.totalPages)
        setPage(currentPage)

    } catch (err) {
        console.error(err)
    }
    }

    useEffect(() => {
  const run = async () => {
    try {

      await axios.get(
        `${process.env.REACT_APP_API_URL}/api/sharecode/room/access/${shareCode}?username=${username}`
      )

      setAuthorized(true)

      // 방 정보
      const roomRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/sharecode/room/${shareCode}`
      )

      setRoomInfo(roomRes.data)

      // 게시글
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts/share`,
        {
          params: {
            shareCode: shareCode,
            page: 0,
            size: 8
          }
        }
      )

      setPosts(res.data.content)
      setTotalPages(res.data.totalPages)

    } catch (err) {

      if (!alerted.current) {
        alerted.current = true
        alert("접근 권한이 없습니다")
      }

      navigate("/")

    } finally {
      setLoading(false)
    }
  }

  run()

}, [shareCode, username])


    

  return (
    <>
        <div className='shareroom_wrap'>
            <div className='B'>
                <h2 className='h2_shareroom'>{roomInfo?.roomname}</h2>
                <div className="pagination">

                {/* 이전 그룹 */}
                {startPage > 0 && (
                    <button
                    className='arrow_btn1'
                    onClick={() =>
                        fetchPosts(startPage - pageGroupSize)
                    }
                    >
                    ←
                    </button>
                )}

                {/* 현재 그룹 */}
                {Array.from({
                    length: endPage - startPage
                }).map((_, idx) => {

                    const pageNumber = startPage + idx

                    return (
                    <button
                        key={pageNumber}
                        onClick={() => fetchPosts(pageNumber)}
                        className={
                        page === pageNumber
                            ? 'active'
                            : ''
                        }
                    >
                        {pageNumber + 1}
                    </button>
                    )
                })}

                {/* 다음 그룹 */}
                {endPage < totalPages && (
                    <button
                    className='arrow_btn2'
                    onClick={() => fetchPosts(endPage)}
                    >
                    →
                    </button>
                )}
                </div>
            </div>
            <div className='roomcode'>{roomInfo?.roomname}의 코드: {roomInfo?.shareCode}</div>

            <div className='h2line_shareroom'></div>

            {posts.length === 0 ? (
            <p className='diarynone_2'>아직 작성된 일기가 없습니다</p>
            ) : (
            <div className='A_shareroom'>
                {posts.map((post)=>(
                <div className="post_item" key={post.id}>
                    <div className='shareroom_post' onClick={()=>navigate(`/share/posts/${post.id}`)}>
                        <p className='title'>{post.title.length > 15 ? post.title.slice(0, 15)+'...' : post.title}</p>
                        <div className='h2line2'></div>
                        {post.thumbnail ? (
                        <img
                            className="post_thumbnail"
                            src={`${process.env.REACT_APP_API_URL}${post.thumbnail}`}
                        />
                        ) : (
                        <div className="post_thumbnail empty" style={{
                            background: `linear-gradient(
                            180deg,
                            ${post.colors?.[0] || '#ffd6de'}50,
                            ${post.colors?.[1] || '#fff1a8'}50,
                            ${post.colors?.[2] || '#c2f0fc'}50
                            )`
                        }}/>
                        )}
                        <p className='content'>{removeHtml(post.content)}</p>
                        <div className='color_wrap'>
                        <p>#오늘감정:</p>
                            {post.colors?.map((color, idx)=>(
                            <span key={idx} style={{backgroundColor: color}}/>
                            ))}
                        </div>

                        <div className='user_date'>
                        <div className='user_info'>
                            <div className='id_picture'></div>
                            <p className='username'>{post.username}</p>
                        </div>
                        <p className='post_date'>{post.createdAt}</p>
                        </div>
                        
                    </div>
                </div>
            ))}
            </div>
            )}
        </div>
    
    </>
  )
}

export default ShareRoom