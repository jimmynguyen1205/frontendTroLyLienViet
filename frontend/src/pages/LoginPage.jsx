import React from 'react'
import LoginForm from '../components/LoginForm'

const LoginPage = ({ setIsLoggedIn }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <LoginForm setIsLoggedIn={setIsLoggedIn} />
      </div>
    </div>
  )
}

export default LoginPage 