import React from 'react'
import { Link } from 'react-router-dom'

const CTB = () => {
  return (
    <section className='cta'>
        <p className='cta-text'>
            Want to get in touch? <br className='sm:block hidden' /> Or just see a cool fox?
        </p>
        <Link to="/contact" className='btn'>
            Contact me, or look at Fox.
        </Link>
    </section>
  )
}

export default CTB