import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const PostDetail = () => {

  const {type, id} = useParams()
  const [post, setPost] = useState(null)
  const navigate = useNavigate()
  const username = localStorage.getItem("username")


  useEffect(()=>{
    fetchPost()
  }, [])

  const fetchPost = async () => {
    try{
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/${id}`)
      setPost(res.data)
    } catch(err){
      console.error(err)
    }
  }

  const handleDelete = async () =>{
    const ok = window.confirm("정말 글을 삭제하시겠습니까?")
    
    if (!ok) return

    try{
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/posts/${id}`, {params: {username}})
      alert('지우기 완료!')
      navigate(-1)
    } catch(err){
      console.error(err)
    }
  }

  

  if (!post) return null

  return (
    <>
      <div className='detail_wrap'>
        <div className='B'>
          <h2>{post.title}</h2>
          <div className='h2line'></div>
        </div>
        
        <p className='detail_date'>{new Date(post.createdAt).toLocaleString()}</p>

        <div className='detail_color_wrap'>
  
          <div className="left">
            <div className='user_info'>
              <div className='id_picture'></div>
              <p>{post.username}</p>
            </div>
          </div>

          <div className="right">
            <p className='text'>#오늘의 감정 팔레트:</p>
            {post.colors?.map((color, idx) => (
              <div className='color2' key={idx}>
                <div style={{width:'65px',height:'25px',backgroundColor:color}}/>
                <span>{color}</span>
              </div>
            ))}
          </div>

        </div>

        

        <div className='detail_content' dangerouslySetInnerHTML={{ __html: post.content }}/>

        <div className='btn_wrap1'>
          <button className='button2'  onClick={() => navigate(`/${type}`)}>목록</button>
          {post.username === username && (
            <div className='btn_wrap'>
              <button onClick={()=>navigate(`/${type}/posts/${id}/edit`)}>수정하기</button>
              <button onClick={handleDelete}>글 지우기</button>
            </div>
          )}
        </div>
      </div>
    </>
    
  )
}

export default PostDetail