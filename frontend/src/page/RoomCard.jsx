import React from 'react'


const RoomCard = ({ room, onClick }) => {
  return (

      <div className="share_post" onClick={onClick}>
        <div className='title_share'>
          <p className='title_share2'>{room.roomname}</p>
        </div>
        <div className="divider">|</div>
        
        <div className='h2line2_share'></div>

        <div className='shareroomcode'>
          <p className='shareroomcode2'>코드: {room.shareCode}</p>          
        </div>

        <div className="divider">|</div>
        
      
        <div className="joiner_count">
          <p className='count1'>참여 인원 수</p>
          <p className='count2'>{room.members.length} / {room.maxMembers}</p>
        </div>

        <div className="divider">|</div>
        
        <div className='joiner_list'>
          <p className='joiner'>참여자 목록</p>
          <div className='userinfo_share'>
            <p>{room.members?.join(", ") || "없음"}</p>
          </div>

        </div>
      </div>

  
  )
}

export default RoomCard