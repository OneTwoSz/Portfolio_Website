import React from 'react'
import { Link } from 'react-router-dom'

const CTA = () => {
  return (
    <section className='cta'>
        <p className='cta-text'>
            Not convinced yet? <br className='sm:block hidden' /> Take a look at my projects!
        </p>
        <Link to="/Projects" className='btn'>
            Projects!
        </Link>
    </section>
  )
}

export default CTA