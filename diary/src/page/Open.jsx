import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Open = () => {

  const [posts, setPosts] = useState([])

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

  const fetchPosts = useCallback(async (pageNum = 0) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/posts/open`,
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
  }, [username])

  useEffect(() => {
    fetchPosts(0)
  }, [fetchPosts])

  const navigate = useNavigate()




  return (
    <>
      <div className='open_wrap'>
        <div className='B'>
          <h2>공개 일기장</h2>
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
          
          <div className='h2line'></div>
          <div className='A'>
            {posts.map((post)=>(
            <div className="post_item" key={post.id}>
              <div className='open_post' onClick={()=>navigate(`/open/posts/${post.id}`)}>
                  <p className='title'>{post.title.length > 15 ? post.title.slice(0, 15)+'...' : post.title}</p>
                  <div className='h2line2'></div>
                  {post.thumbnail ? (
                      <img
                        className="post_thumbnail"
                        src={`${process.env.REACT_APP_API_URL}${post.thumbnail}`}
                        alt="게시글 썸네일"
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
              
      </div>
    </>
  )
}

export default Open