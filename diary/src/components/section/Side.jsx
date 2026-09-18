import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { Link, Navigate, useNavigate } from 'react-router-dom'

const Side = () => {

    const username = localStorage.getItem("username")
    const navigate = useNavigate()

    const [date, setDate] = useState(new Date())

    const [isLogin, setIsLogin] = useState(localStorage.getItem('isLogin') === 'true')
    // localStorage > 브라우저 안에 데이터를 영구적으로 저장해주는 공간 (로그인 및 게시글 등 새로고침이나 브라우저 껐켰해도 유지)
    // localStorage.getItem('isLogin') > 브라우저에 저장된 값 꺼내오기

    const [posts, setPosts] = useState([])
    const [myPostCount, setMyPostCount] = useState(0)

    const logout = () => {
      localStorage.removeItem("username")
      localStorage.removeItem("isLogin")

      window.dispatchEvent(new Event('logout'))


      setIsLogin(false)
      navigate('/')
    }

    useEffect(() => {
    const fetchPosts = async () => {
      try {

        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/posts/home`,
          {
            params: {
              username
            }
          }
        )

        console.log(res.data)
        setMyPostCount(res.data.myPostCount)

        // 모든 글 합치기
        const allPosts = [
          ...res.data.privatePosts,
          ...res.data.openPosts,
          ...res.data.sharePosts
        ]

        setPosts(allPosts)

      } catch (err) {
        console.log(err)
      }
    }

    fetchPosts()
  }, [username])


  // 최근 감정 팔레트에서 내 글들만 필터 > 최신글 찾기 > 그 글의 색 가져오기
  const myPosts = posts.filter(
    post => post.username === username
  )

  const latestPost = myPosts.length > 0
    ? [...myPosts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )[0]
    : null

  const latestColors = latestPost?.colors || [
    '#ddd',
    '#ddd',
    '#ddd'
  ]

  return (
    <>
      <div className='side_wrap'>
        <div className='clip'></div>
        {isLogin ? 
        (<div className='login_join'>
          <div className='clip'></div>
          <div className='id_picture'></div>
          <div className='username_sticker'>{username}</div>
          <p className='post_count'>
            작성한 일기 수<br/>{myPostCount}개
          </p>
          <p className='last_post_date'>
            마지막 작성일<br/>
            {latestPost
              ? `${new Date(latestPost.createdAt).getFullYear()}-${
                  new Date(latestPost.createdAt).getMonth() + 1
                }-${
                  new Date(latestPost.createdAt).getDate()
                }`
              : ' 없음'}
          </p>
          <div className='recent_palette'>
            <p>「최근 감정 팔레트」</p>

            <div className='palette_colors'>
              {latestColors.map((color, idx) => (
                <span
                  key={idx}
                  className='palette_circle'
                  style={{ backgroundColor: color }}
                  title={color}
                ></span>
              ))}
            </div>
          </div>
          <Link to='/mylog' className='mylog_btn'>월별 나의 기록들✐</Link>
          <p className='setting'>설정</p>
          <Link to='/' onClick={logout}>로그아웃</Link>
        </div>) : 
        (<div className='login_join'>
          <div className='clip'></div>
          <div className='id_picture'></div>
          <div className='username_sticker'>✎</div>
          <Link to='/login' className='login_btn'>로그인</Link>
          <Link to='/join' className='join_btn'>회원가입</Link>
          <p className='login_memo'>
            “ 로그인 후<br/>
            &nbsp;&nbsp;하루의 색상을 담은<br/>
            &nbsp;&nbsp;일기를 기록할 수 있어요 ”
          </p>
        </div>)}
        <div className='write_container'>
          <p className='writetitle'>일기 쓰기</p>
          <div className='write_contain'>
              {isLogin ? 
              (<>
                    <Link to='/private/write' className='private_btn'>개인</Link>
                    <Link to='/share/write' className='share_btn'>교환</Link>
                    <Link to='/open/write' className='open_btn'>공개</Link>
                  
              </>) :
              (<>
                    <Link to='/login' className='private_btn'>개인</Link>
                    <Link to='/login' className='share_btn'>교환</Link>
                    <Link to='/login' className='open_btn'>공개</Link>
              </>)}
          </div>
        </div>
          <div style={{ marginTop: '20px' }} className='calen'>
                <Calendar onChange={setDate} value={date} />
          </div>
          
      </div>
    </>
  )
}

export default Side