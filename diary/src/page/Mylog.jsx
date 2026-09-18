import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// 달력 생성 함수
const getCalendar = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()

  const days = []

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= lastDate; i++) {
    days.push(i)
  }

  return days
}


const Mylog = () => {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [monthlyMemo, setMonthlyMemo] = useState("");

  const days = getCalendar(year, month)
  const username = localStorage.getItem("username")

  const navigate = useNavigate()

  useEffect(() => {
    if (!username) return;

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/memo`, {
        params: { year, month: month + 1, username }
      })
      .then(res => setMonthlyMemo(res.data.memo || ""))
      .catch(() => setMonthlyMemo(""));
  }, [year, month, username]);

  const saveMemo = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/memo`, {
      year,
      month: month + 1,
      username,
      memo: monthlyMemo
    });
  };

  const getDiary = (day) => {
    if (!day) return [];
    return allPosts.filter((d) => {
      const date = d.dateObj;
      if (Number.isNaN(date.getTime())) return false;

      // 여기서 백엔드에서 가져온 데이터가 해당 년/월/일과 일치하는지 확인
      return (
        date.getFullYear() === year &&
        date.getMonth() === month &&
        date.getDate() === day
      );
    });
  };


  // 요일 추가
  const weekDays = ['MON','TUE','WED','THU','FRI','SAT','SUN']


  // 이전, 다음달 버튼
  const prevMonth = () => {
    if(month === 0){
      setYear(year-1)
      setMonth(11)
    } else {
      setMonth(month-1)
    } 
  }

  const nextMonth = () => {
    if(month === 11) {
      setYear(year+1)
      setMonth(0)
    } else {
      setMonth(month+1)
    }
  }


  // DB연결
  const [diaryData, setDiaryData] = useState([])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/posts/mylog`, {params: {year: year, month: month+1, username: username}})
         .then(res => setDiaryData(res.data))
         .catch(err => console.log(err))
  }, [year, month])

  const allPosts = React.useMemo(() => {
    const data = Array.isArray(diaryData) ? diaryData : [];
    return data.map(p => ({
      ...p,
      // 백엔드에서 온 createdAt을 Date 객체로 확실히 변환
      dateObj: new Date(p.createdAt)
    }));
  }, [diaryData]);

  const getVisibilityLabel = (visibility) => {
    if (!visibility) return "미분류";
    const v = visibility.trim().toLowerCase(); // 공백 제거 및 소문자화
    if (v === "private") return "개인";
    if (v === "share") return "교환";
    if (v === "open") return "공개";
    return `[${visibility}]`; // 예상치 못한 값 확인용
  };

  const weeks = [];

  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }


  // 하루에 활동한 계산함수
const stats = React.useMemo(() => {
    const privateDays = new Set();
    const shareDays = new Set();
    const openDays = new Set();

    allPosts.forEach((d) => {
      const date = d.dateObj;
      if (Number.isNaN(date.getTime())) return;

      // 현재 달력에 보이는 년/월의 데이터만 카운트
      if (date.getFullYear() === year && date.getMonth() === month) {
        const vis = d.visibility; 
        const day = date.getDate();

        if (vis === "private") privateDays.add(day);
        if (vis === "share") shareDays.add(day);
        if (vis === "open") openDays.add(day);
      }
    });

    return {
      private: privateDays.size,
      share: shareDays.size,
      open: openDays.size,
      total: new Date(year, month + 1, 0).getDate(),
    };
  }, [allPosts, year, month]);



  return (
    <>
      <div className='mylog_calender'>
        <div className='log_A'>
          <h2>월별 나의 기록들</h2>
          <div className='log_h2line'></div>
        </div>

        <div className='calendar_wrap'>
          <div className="header">

          
            <h2 className='h2_month'>{month + 1}월</h2>
            <h2 className='h2_year'>{year}</h2>
            <div className='log_h2line2'></div>

            <div className="month_stats">
              <p>이번 달 일기 기록</p>
              <div className='stats_index private_index'>
                <div className='index_tab'>개인</div>
                <div className='index_body'>
                  {stats.private}/{stats.total}
                </div>
              </div>

              <div className='stats_index share_index'>
                <div className='index_tab'>교환</div>
                <div className='index_body'>
                  {stats.share}/{stats.total}
                </div>
              </div>
              <div className='stats_index open_index'>
                <div className='index_tab'>공개</div>
                <div className='index_body'>
                  {stats.open}/{stats.total}
                </div>
              </div>
            </div>

            <div className="month_memo">
              <p>이번 달 메모</p>
              <textarea
                value={monthlyMemo}
                onChange={(e) => setMonthlyMemo(e.target.value)}
                placeholder="메모를 남겨보세요"
              />
              <button onClick={saveMemo}>저장</button>
            </div>

            <div className='header_btn'>
              <button className='btn1' onClick={prevMonth}>🡠 이전달</button>
              <button className='btn2' onClick={nextMonth}>다음달 🡢</button>
            </div>
      
          </div>

          <div className='calendar_body'>
            <div className="week">
              {weekDays.map((d) => (
                <div key={d} className="week_day">{d}</div>
              ))}
            </div>

            <div className="grid">
              {days.map((day, idx) => {
                const diaries = getDiary(day)

                return (
                  <div
                    className="cell"
                    key={idx}
                    onClick={() => {
                      if (diaries.length > 0) {
                        const first = diaries[0]
                        navigate(`/${first.visibility}/posts/${first.id}`)
                      }
                    }}
                  >
                    {day && (
                      <>
                        <span className="date">{day}</span>

                        {diaries.length > 0 && (
                          <div className="diary">
                            {diaries.map((d) => (
                              <div
                                key={d.id}
                                className='diary_item'
                                onClick={(e) => {
                                  e.stopPropagation()
                                  navigate(`/${d.visibility}/posts/${d.id}`)
                                }}
                              >

                                <span className='diary_type'>
                                  {getVisibilityLabel(d.visibility)}
                                </span>

                                <div className='diary_tabs'>
                                  {d.colors?.map((color, idx) => (
                                    <span
                                      key={idx}
                                      className='tab'
                                      style={{ backgroundColor: color }}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

export default Mylog