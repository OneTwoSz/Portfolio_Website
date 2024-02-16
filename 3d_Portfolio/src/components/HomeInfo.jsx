import React from 'react'
import { Link } from 'react-router-dom'
import {arrow } from '../assets/icons'

const InfoBox = ({ text, link, btnText}) => (
    <div className='info-box'>
        <p className='font-medium sm:text-xl text-center'>{text}</p>
        <Link to={link} className='neo-brutalism-white neo-btn'>
            {btnText}
            <img src={arrow} className='w-4 h-4 object-contain'/>
        </Link>
    </div>
)

const renderContent = {
    1: (
        <h1 className='sm:text-x1 sm:leading-snug text-center neo-brutalism-blue py-4 px-8 text-white mx-5'>
            Hey, I am <span className='font-semibold'> Sabari VS.</span> 🤘 
            <br/> 
            Embark on a tech adventure! 🚀 I'm a recent Monash grad with a tech passion. Use swipes, grabs, or arrow keys to explore the island's highlights: the Well, Fox Island, and Carrot Farm. Each reveals a part of my tech journey!
            </h1> 
    ),
    2: (
        <InfoBox 
        text='With a diverse background and unwavering enthusiasm for all things tech, my story unfolds. Get to know me better.'
         link='/about'
         btnText="Learn more!"   
         />
    ),
    3: (
        <InfoBox 
        text='Discover the innovative projects where I have harnessed the power of technology. Dive into my creations.'
         link='/projects'
         btnText="Check out my projects!"   
         />
    ),
    4: (
        <InfoBox 
        text="Need to get in touch? Don't be shy! Reach out via email and let's chat. I promise, I'm as friendly as the 3D fox waiting for you!"
         link='/contact'
         btnText="Lets talk!"   
         />
    )
}



const HomeInfo = ({ currentStage }) => {
  return renderContent[currentStage] || null;
}

export default HomeInfo