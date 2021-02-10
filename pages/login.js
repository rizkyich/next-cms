import { useRouter } from 'next/router'
import React, {useState} from 'react'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (username && password) {
      if (username === 'fazar' && password === 'fffazarff') {
        sessionStorage.setItem('bl-002-key', 'fazarella')
        router.push('/')
      } else {
        alert('Username/Password yang dimasukkan salah')
      }
    } else {
      alert('Semua kolom harus diisi')
    }
  }

  return (
    <div className="w-screen h-screen grid place-items-center bg-gray-100">
      <div className="w-auto h-auto relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 shadow-xl transform -skew-y-6 sm:skew-y-0 sm:-rotate-12 sm:rounded-3xl"></div>
        <div className="rounded-3xl shadow-2xl bg-white p-16 relative">
          <h1 className="">Login Admin</h1>

          <form className="flex flex-col items-center" onSubmit={e => handleSubmit(e)}>
            <input
                value={username}
                type="username"
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 my-4 py-2 bg-gray-200 focus:outline-none shadow-lg rounded-lg"
                placeholder="Username"
              />

            <input
                value={password}
                type="password"
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 my-4 py-2 bg-gray-200 focus:outline-none shadow-lg rounded-lg"
                placeholder="Password"
              />

              <button className="my-4 w-full h-12 rounded-lg text-white bg-red-200 bg-gradient-to-l from-green-400 to-blue-500">Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}