import React, { useState, useEffect, useRef } from 'react'
import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Loader from '../components/Loader'
import { soundoff, soundon } from '../assets/icons'
import { FaArrowsAlt, FaHandPaper, FaMouse, FaPlaneDeparture, FaInfoCircle, FaVolumeUp, FaArrowDown } from 'react-icons/fa'

import Island  from '../models/island'
import Sky from '../models/sky'
import Bird from '../models/Bird'
import Plane from '../models/Plane'
import HomeInfo from '../components/HomeInfo'
import sakura from '../assets/sakura.mp3'

const Home = () => { 
  const audioRef = useRef(new Audio(sakura));
  audioRef.current.volume = 0.4;
  audioRef.current.loop = true;
  const [isRotating, setIsRotating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [isPlayingMusic, setisPlayingMusic] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    if(isPlayingMusic){
      audioRef.current.play();
    }
    
    return () => {
      audioRef.current.pause();
    }
  }, [isPlayingMusic])

  useEffect(() => {
    if (showInstructions) {
      const timer = setTimeout(() => {
        setShowInstructions(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [showInstructions]);

  const adjustIslandForScreenSize = () =>{
    let screenScale = null;
    let screenPosition = [0, -6.5, -43];
    let rotation = [0.1, 4.7, 0];

    if(window.innerWidth < 768 ) {
      screenScale = [0.9, 0.9, 0.9];
      screenPosition = [0, -6.5, -43];
    } else {
      screenScale = [1, 1, 1];
      screenPosition = [0, -6.5, -43];
    }

    return [screenScale, screenPosition, rotation]
  }

  const adjustPlaneForScreenSize = () =>{
    let screenScale, screenPosition;

    if(window.innerWidth < 768 ) {
      screenScale = [1.5, 1.5, 1.5];
      screenPosition = [0, -1.5, 0];
    } else {
      screenScale = [3, 3, 3];
      screenPosition = [0, -4, -4];
    }

    return [screenScale, screenPosition]
  }

  const [islandScale, islandPositon, islandRotation] = adjustIslandForScreenSize();
  const [planeScale, planePosition] = adjustPlaneForScreenSize();

  return (
    <section className='w-full h-screen relative overflow-hidden touch-none select-none'>
      {showInstructions && (
        <div className='absolute inset-0 flex items-center justify-center z-20 bg-black bg-opacity-75 backdrop-blur-sm transition-opacity duration-500 px-4 sm:px-0'>
          <div className='bg-gradient-to-br from-slate-800 to-slate-900 p-4 sm:p-8 rounded-xl w-full max-w-md text-center shadow-2xl border border-slate-700'>
            <h2 className='text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500'>Navigation Guide</h2>
            
            <div className='grid grid-cols-2 gap-3 sm:gap-6 mb-4 sm:mb-6'>
              <div className='flex flex-col items-center bg-slate-700 p-2 sm:p-3 rounded-lg transition-transform hover:scale-105'>
                <FaHandPaper className='text-2xl sm:text-3xl mb-1 sm:mb-2 text-yellow-300' />
                <p className='text-white text-sm sm:text-base'>Grab & Drag</p>
              </div>
              <div className='flex flex-col items-center bg-slate-700 p-2 sm:p-3 rounded-lg transition-transform hover:scale-105'>
                <FaArrowsAlt className='text-2xl sm:text-3xl mb-1 sm:mb-2 text-green-300' />
                <p className='text-white text-sm sm:text-base'>Arrow Keys</p>
              </div>
              <div className='flex flex-col items-center bg-slate-700 p-2 sm:p-3 rounded-lg transition-transform hover:scale-105'>
                <FaMouse className='text-2xl sm:text-3xl mb-1 sm:mb-2 text-blue-300' />
                <p className='text-white text-sm sm:text-base'>Swipe</p>
              </div>
              <div className='flex flex-col items-center bg-slate-700 p-2 sm:p-3 rounded-lg transition-transform hover:scale-105'>
                <FaPlaneDeparture className='text-2xl sm:text-3xl mb-1 sm:mb-2 text-red-300' />
                <p className='text-white text-sm sm:text-base'>Find the Plane</p>
              </div>
            </div>
            
            <div className='bg-slate-700 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-left'>
              <p className='text-white text-sm sm:text-base mb-1 sm:mb-2'>• Explore the 3D island by rotating it</p>
              <p className='text-white text-sm sm:text-base mb-1 sm:mb-2'>• Discover interactive elements as you navigate</p>
              <p className='text-white text-sm sm:text-base'>• Look for the plane to visit smaller islands</p>
            </div>
            
            <div className='bg-slate-700 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 relative overflow-hidden'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <FaVolumeUp className='text-xl sm:text-2xl text-purple-300 mr-2 sm:mr-3' />
                  <p className='text-white text-sm sm:text-base'>Toggle background music</p>
                </div>
                <div className='flex flex-col items-center'>
                  <FaArrowDown className='text-base sm:text-lg text-yellow-300 animate-bounce' />
                  <p className='text-xs text-yellow-300'>Bottom Left</p>
                </div>
              </div>
              <div className='absolute w-24 sm:w-32 h-1 sm:h-2 bg-gradient-to-r from-transparent to-yellow-300 opacity-60 -rotate-45 -right-8 bottom-6 transform origin-right'></div>
            </div>
            
            <button 
              onClick={() => setShowInstructions(false)}
              className='bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full hover:from-blue-600 hover:to-purple-700 transition-colors font-medium shadow-lg text-sm sm:text-base'
            >
              Start Exploring
            </button>
          </div>
        </div>
      )}
      
      {!showInstructions && (
        <button 
          onClick={() => setShowInstructions(true)}
          className='absolute top-2 sm:top-4 right-2 sm:right-4 z-20 bg-slate-800 text-white p-2 sm:p-3 rounded-full opacity-70 hover:opacity-100 transition-opacity shadow-md'
          title="Show instructions"
        >
          <FaInfoCircle className='text-lg sm:text-xl' />
        </button>
      )}
      
      <div className='absolute top-16 sm:top-28 left-0 right-0 z-10 flex items-center justify-center px-4 sm:px-0'>
        {currentStage && <HomeInfo currentStage={currentStage} />}
      </div>
      <Canvas  
        className={`w-full h-screen bg-transparent ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`}
        camera={{near: 0.1, far:1000 }}
      >
        <Suspense fallback={<Loader />}>
          <directionalLight postion={[1, 1, 1]} intensity={2}/>
          <ambientLight intensity={0.5}/>
          <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1}/>

          <Bird />
          <Sky isRotating={isRotating}/>
          <Island
            position = {islandPositon}
            scale = {islandScale}
            rotation = {islandRotation}
            isRotating = {isRotating}
            setIsRotating = {setIsRotating}
            setCurrentStage={setCurrentStage}
          />
          <Plane
            isRotating={isRotating}
            scale={planeScale}
            position={planePosition}
            rotation={[0, 20, 0]}
          />
        </Suspense>
      </Canvas>

      <div className='absolute bottom-2 left-2 z-10'>
        <img 
          src={!isPlayingMusic ? soundoff : soundon}
          alt='sound'
          className='w-8 h-8 sm:w-10 sm:h-10 cursor-pointer object-contain'
          onClick={() => setisPlayingMusic(!isPlayingMusic)}
        />
      </div>
    </section>
  )
}

export default Home