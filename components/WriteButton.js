import React from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const WriteButton = () => {
  return (
    <Link href="/write-article">
      <div className="fixed bottom-12 right-12 hover:bg-black hover:text-white w-48 h-12 rounded-lg bg-white shadow-lg flex justify-center items-center border-b-2 border-black transition-all duration-150 cursor-pointer">
        <FontAwesomeIcon className="mr-4" size="lg" icon={["fas", "feather-alt"]} />
        <p>Wtrite an Article</p>
      </div>
    </Link>
  )
}