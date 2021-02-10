import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

export const Header = ({back}) => {
  return (
    <header className="w-full h-20 px-12 flex items-center justify-between">
      
      {
        back ?
        <Link href="/">
          <div className="flex items-center transition-all duration-150 cursor-pointer">
            <FontAwesomeIcon className="mr-4" size="lg" color="black" icon={["fas", "chevron-circle-left"]} />
            <p>Back</p>
          </div>
        </Link>  
        :
        <div></div>
      }

      <div className="transition-all  duration-150  p-2 rounded-md text-white bg-gradient-to-r from-red-600 to-red-400 hover:bg-gradient-to-l hover:from-red-700 hover:to-red-600">
        <Link href="/login">
          <a>Logout</a>
        </Link>
      </div> 
    </header>
  )
}