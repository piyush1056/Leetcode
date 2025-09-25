import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { googleSignIn } from '../authSlice'
import toast from 'react-hot-toast'

const GoogleSignInButton = ({ text = "Continue with Google" }) => {
  const dispatch = useDispatch()

  const handleSuccess = async (credentialResponse) => {
    try {
      const decodedToken = jwtDecode(credentialResponse.credential)
      
      const result = await dispatch(googleSignIn({
        credential: credentialResponse.credential,
        userInfo: decodedToken
      })).unwrap()
      
      if (result) {
        const isAdmin = result.role === 'admin'
        const welcomeMessage = isAdmin 
          ? `Welcome back, Admin ${decodedToken.name}! 🔥` 
          : `Welcome ${decodedToken.name}! 🎉`
        toast.success(welcomeMessage)
      }
    } catch (error) {
      console.error('Google sign-in error:', error)
      toast.error(error || 'Google sign-in failed. Please try again.')
    }
  }

  const handleError = () => {
    console.error('Google sign-in failed')
    toast.error('Google sign-in was cancelled or failed')
  }

  return (
    <div className="w-full">
      {/* Custom styled Google button container */}
      <div 
        className="w-full rounded-lg border border-gray-300 hover:border-gray-400 transition-all duration-200 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          size="large"
          text="continue_with"
          shape="rectangular" 
          theme="outline"
          logo_alignment="left"
          ux_mode="popup"
          use_fedcm_for_prompt={true}
          locale="en"
        //   width="100%"
        />
      </div>
    </div>
  )
}

export default GoogleSignInButton