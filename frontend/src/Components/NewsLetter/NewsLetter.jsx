import React from 'react'
import './NewsLetter.css'

function NewsLetter() {
  return (
    <div className='newsletter'>
      <h1>Get Exclusive Offer On Your Email</h1>
      <p>Subscribe To Our Newletter And Stay Updated</p>
      <div>
     <input type="email" placeholder='your Email id' />
     <button>Subscribe</button>

      </div>
    </div>
  )
}

export default NewsLetter
