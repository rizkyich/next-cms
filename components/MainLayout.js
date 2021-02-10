import React from 'react'
import NavBar from '../components/Nav'
import Link from 'next/link'
import {Header} from './Header' 

const MainLayout = ({children, back, showOverflow}) => {
  return (
    <div className="w-full h-screen relative bg-gray-100 flex overflow-hidden">
      <NavBar/>
      <main className={`w-full relative pb-4 ${showOverflow ? 'overflow-hidden' : 'overflow-y-auto'}`}>
        <Header back={back}/>

        {children}
      </main>
    </div>
  )
}

export default MainLayout