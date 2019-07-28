import React from 'react'
import hyunwoo from '../../content/images/photo_kei.jpg'

export const UserInfo = () => {
  return (
    <aside>
      <div>
        <div>
          <div>
            <img src={hyunwoo} alt='김현우' />
          </div>
          <div>
            <p>김현우입니다.</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
