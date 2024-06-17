import React from 'react'
import './DescriptionBox.css'

function DescriptionBox() {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews(122)</div>
        </div>
        <div className="descriptionbox-description">
            <p>
                An e-commerce website is an online platform that facilitated
                buying and selling of products or services over the internet
                serves as a virtual marketplace where bussinesses and individuals
                showcase their products , interact with customers , and 
                transactions without the need of physical presence . E-commerce wesites
                have gained immense popularity due to their convineance accessibility
                and global reach they offer.
            </p>
            <p>
                E-coomerce websites typically display products or services and 
                detailed descriptions,images,prices or any available variable (e.g. sizes,colors).
                Each products usually has its own with relevent information.
            </p>
        </div>
      
    </div>
  )
}

export default DescriptionBox
