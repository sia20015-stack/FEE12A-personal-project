import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {

  const [privatePosts, setPrivatePosts] = useState([])
  const [sharePosts, setSharePosts] = useState([])
  const [openPosts, setOpenPosts] = useState([])

  const [username, setUsername] = useState(localStorage.getItem("username"))

  
  useEffect(()=>{
    const syncLogout = () =>{
      setUsername(null);
      setPrivatePosts([]);
      setSharePosts([]);
    };

    window.addEventListener("logout", syncLogout);

    return () => {
      window.removeEventListener('logout', syncLogout);
    };
  }, []);

  useEffect(()=>{
    fetchPosts();

    if (!username){
      setPrivatePosts([]);
      setSharePosts([]);
    }
  }, [username]);




  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/posts/home`, {params: username ? { username } : {}});

      const data = res.data;

      console.log("ALL DATA:", data)
      

      setPrivatePosts(data.privatePosts || []);
      setSharePosts(data.sharePosts || []);
      setOpenPosts(data.openPosts || []);

    } catch(err){
      console.error(err)
    }
  }

  return (
    <>
      <div className='home_body'>
        <div className='private_show'>
          <h2>개인 일기장</h2>
          <div className='h2_line'></div>

          <Link to={username ? '/private' : '/login'} className='more'>
            <span>더보기 +</span>
          </Link>

          <div className={`post_list ${!username ? 'blurred' : ''}`}>
            {username && privatePosts.length === 0 ? (
            <p className='empty_post'>
              아직 작성된 일기가 없습니다
            </p>
          ) : (
            (username ? privatePosts : Array(5).fill(null))
              .slice(0, 5)
              .map((post, idx) => (

              username && post ? (
                <Link
                  to={`/private/posts/${post.id}`}
                  className='homeposts'
                  key={post.id}
                >

                  <p>
                    {post.title?.length > 17
                      ? post.title.slice(0, 17) + '...'
                      : post.title || "제목 없음"}
                  </p>

                  <p>
                    #오늘의 감정 팔레트:
                    {post.colors?.map((color, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          position: 'relative',
                          top: '2px',
                          left:'5px',
                          width: '41px',
                          height: '15px',
                          backgroundColor: color,
                          marginLeft: '5px',
                          borderRadius: '5px'
                        }}
                      ></span>
                    ))}
                  </p>

                  <div className='user_date'>
                    <div className='user_info'>
                      <div className='id_picture'></div>
                      <p className='username'>{post.username}</p>
                    </div>

                    <p>{post.createdAt}</p>
                  </div>

                </Link>
              ) : (
                <div className='homeposts' key={idx}>
                  <p>개인 일기입니다</p>
                  <p>
                    #오늘의 감정 팔레트:
                    <span className='fake_color'></span>
                    <span className='fake_color'></span>
                    <span className='fake_color'></span>
                  </p>
                  <div className='user_date'>
                    <div className='user_info'>
                      <div className='id_picture'></div>
                      <p className='username'>username</p>
                    </div>
                    <p>2026-01-01</p>
                  </div>
                </div>
              )
            )))}
          </div>

          {!username && (
            <div className='login_notice'>
              🔒 로그인 후 사용할 수 있습니다
            </div>
          )}
        </div>

        <div className='share_show'>
          <h2>교환 일기장</h2>
          <div className='h2_line'></div>
          <Link to={username ? '/share' : '/login'} className='more'>
            <span>더보기 +</span>
          </Link>
          <div className={`post_list ${!username ? 'blurred' : ''}`}>
            {username && sharePosts.length === 0 ? (
            <p className='empty_post'>
              아직 작성된 일기가 없습니다
            </p>
          ) : (

            (username ? sharePosts : Array(5).fill(null))
              .slice(0, 5)
              .map((post, idx) => (

              username && post ? (
                <Link
                  to={`/share/posts/${post.id}`}
                  className='homeposts'
                  key={post.id}
                >

                  <p>
                    {post.title?.length > 17
                      ? post.title.slice(0, 17) + '...'
                      : post.title || "이름 없음"}
                  </p>

                  <p>
                    #오늘의 감정 팔레트:
                    {post.colors?.map((color, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          position: 'relative',
                          top: '2px',
                          left:'5px',
                          width: '41px',
                          height: '15px',
                          backgroundColor: color,
                          marginLeft: '5px',
                          borderRadius: '5px'
                        }}
                      ></span>
                    ))}
                  </p>

                  <div className='user_date'>
                    <div className='user_info'>
                      <div className='id_picture'></div>
                      <p className='username'>{post.username}</p>
                    </div>


                    <p>{post.createdAt}</p>
                  </div>

                </Link>
              ) : (
                <div className='homeposts' key={idx}>
                  <p>교환 일기입니다</p>
                  <p>
                    #오늘의 감정 팔레트:
                    <span className='fake_color'></span>
                    <span className='fake_color'></span>
                    <span className='fake_color'></span>
                  </p>
                  <div className='user_date'>
                    <div className='user_info'>
                      <div className='id_picture'></div>
                      <p className='username'>username</p>
                    </div>
                    <p>2026-01-01</p>
                  </div>
                </div>
              )
            )))}
          </div>
          {!username && (
            <div className='login_notice'>
              🔒 로그인 후 사용할 수 있습니다
            </div>
          )}
        </div>

        <div className='open_show'>
          <h2>공개 일기장</h2>
          <div className='h2_line'></div>
          <Link to='/open' className='more'>
            <span>더보기 +</span>
          </Link>
          <div className='post_list'>
            {openPosts.length === 0 ? (
            <p className='empty_post'>
              아직 작성된 일기가 없습니다
            </p>
          ) : (
            openPosts.slice(0, 5).map((post) => (
              <Link to={`/open/posts/${post.id}`} className='homeposts' key={post.id}>
                <div key={post.id}>
                  <p>
                      {post.title?.length > 17 ? post.title.slice(0, 17)+'...' : post.title || "제목 없음"}
                  </p>
                  <p>
                    #오늘의 감정 팔레트:
                    {post.colors?.map((color, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-block',
                          position: 'relative',
                          top: '2px',
                          left:'5px',
                          width: '41px',
                          height: '15px',
                          backgroundColor: color,
                          marginLeft: '5px',
                          borderRadius: '5px'
                        }}
                      ></span>
                    ))}
                  </p>  
                  <div className='user_date'>
                    <div className='user_info'>
                      <div className='id_picture'></div>
                      <p className='username'>{post.username}</p>
                    </div>

                    <p>{post.createdAt}</p>
                  </div>
                </div>
            </Link>
            )))}
          </div>
          
          
        </div>
      </div>
    </>
  )
}

export default Home
