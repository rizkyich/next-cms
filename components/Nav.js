import React from 'react'
import Link from 'next/link'

const NavBar = () => {
  return (
    <nav className="h-screen sm:w-80 xl:w-96 bg-white shadow-xl px-8 pt-36"> 
      <ul className="w-full h-auto">
        
        <li className="my-6 pl-4 flex items-center justify-start h-9 rounded-md text-gray-600 bg-blue-200">
          <Link href="/login">
            <a>Logout</a>
          </Link>
        </li>

        <li className="my-6 pl-4 flex items-center justify-start h-9 rounded-md text-gray-600 bg-blue-200">
          <Link href="/login">
            <a>Logout</a>
          </Link>
        </li>
    
      </ul>
    </nav>
  )
}

export default NavBar