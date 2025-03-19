import React from 'react'
import { skills, experiences } from '../constants'
import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import CTA from '../components/CTA';
import sabariVS from '../assets/images/sabariVS.jpg'

const About = () => {
  return (
    <section className='max-container'>
      <h1 className='head-text'>
        Hello, I'm <span className='blue-gradient_text font-semibold drop-shadow'> Sabari VS</span> 
      </h1>

      <div className="flex-1 flex justify-center my-8">
        <div className="relative group">
          <img 
            src={sabariVS} 
            className="w-25 h-25 md:w-30 md:h-30 max-w-xs max-h-xs md:max-w-sm md:max-h-sm object-cover rounded-lg transition-all duration-500 group-hover:scale-105 z-10 relative shadow-xl" 
            style={{ 
              objectPosition: 'center top',
              mixBlendMode: 'multiply',
              backgroundColor: 'rgba(240, 240, 240, 0.1)'
            }} 
            alt="Sabari VS portrait"
          />
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-500 group-hover:blur-xl"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#111132] opacity-30 rounded-lg z-20 pointer-events-none"></div>
        </div>
      </div>

      <div className='mt-5 flex flex-col gap-3 text-slate-500'>
        <p>An enthusiastic and dedicated recent Monash University graduate in Business Information Systems with a foundational background in Computer and Communication Engineering, I am poised to bring fresh perspectives and innovative solutions to the IT industry. My practical experience, spanning technical engineering and IT internships, has honed my ability to quickly learn and solve complex problems in fast-paced environments. Adaptable and driven, I am eager to contribute to and grow within an organization that values innovation, collaboration, and forward-thinking.</p>
      </div>
      <div className='py-10 flex flex-col'>
        <h3 className='subhead-text'> My skills </h3>
        <div className='mt-16 flex flex-wrap gap-12'>
          {skills.map((skill) => (
            <div className='block-container w-20 h-20'>
              <div className='btn-back rounded-x1'/>
              <div className='btn-front rounded-xl flex justify-center items-center'>
                <img 
                  src={skill.imageUrl}
                  alt={skill.name}
                  className='w-1/2 h-1/2 object-contain'
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='py-16'>
        <h3 className='subhead-text'> Work Experience </h3>
        <div className='mt-5 flex flex-col gap-3 text-slate-500'>
        <p>My journey in the world of technology has been an exciting adventure. I've explored various facets of IT, from crafting responsive web applications to delving into the intricacies of Java engineering. Let my experiences speak for themselves as you explore my portfolio</p>
        </div>

        <div className='mt-12 flex'>
          <VerticalTimeline>
            {experiences.map((experience)=> (
              <VerticalTimelineElement
                key={experience.company_name}
                date={experience.date}
                icon={<div className='flex justify-center items-center w-full h-full'>
                  <img 
                    src={experience.icon}
                    alt={experience.company_name}
                    className='w-[60%] h-[60%] object-contain'
                  />
                </div>}
                iconStyle={{background: experience.iconBg}}
                contentStyle={{
                  borderBottom: '8px',
                  borderStyle: 'solid',
                  borderBottomColor: experience.iconBg,
                  boxShadow: 'none'
                }}
              >
                <div>
                  <h3 className='text-black text-xl font-poppins font-semibold'>
                    {experience.title}
                  </h3>
                  <p className='text-black-500 font-medium font-base' style={{margin:0}}>
                    {experience.company_name}
                  </p>
                </div>

                <ul className='my-5 list-disc ml-5 space-y-2'>
                  {experience.points.map((point, index) => (
                    <li key={`experience-point-${index}`} className='text-black-500/50 font-normal pl-1 text-small'>
                      {point}
                    </li>
                  ))}
                </ul>
              </VerticalTimelineElement>
            ))}
          </VerticalTimeline>
        </div>
      </div>

      <hr className='border-slate-200' />
      <CTA />
    </section>
  )
}

export default About