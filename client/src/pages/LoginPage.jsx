import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {

  const [currState, setCurrState] =useState("Sign Up");
  const [fullName, setFullName] =useState("");
  const [email, setEmail] =useState("");
  const [password, setPassword] =useState("");
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted]= useState(false);

  const {login} = useContext(AuthContext)

  const onSubmitHandler =(event)=>{
    event.preventDefault();

    if(currState === "Sign Up" && !isDataSubmitted){
      setIsDataSubmitted(true);
      return;
    }

    login(currState === "Sign Up" ? 'signup' : 'login', {fullName, email,password,bio})
  }

  return (
    <div className='min-h-screen bg-cover flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/*  ----------------Left----------------  */}
      <img src={assets.logo_big} alt="" className="w-[30vw] max-w-[250px]"/>
      {/*  ----------------Right----------------  */}

      <form 
      onSubmit={onSubmitHandler}
      className="w-full max-w-md border border-gray-500 bg-white/10 backdrop-blur-md 
      text-white p-8 flex flex-col gap-4 rounded-xl shadow-xl">

        <h2 className="font-semibold text-2xl flex justify-between items-center mb-2">
        {currState}
          {isDataSubmitted &&
          <img 
          onClick={()=> setIsDataSubmitted(false)}
          src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" />}
        </h2>

        {currState === "Sign Up" && !isDataSubmitted && (
          <input
          type="text"
          placeholder="Full Name"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-500 bg-transparent 
          focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              type="email"
              placeholder="Email Address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-500 bg-transparent 
              focus:outline-none focus:ring-2 focus:ring-violet-500"
            />

            <input
              type="password"
              placeholder="Enter Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-500 bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </>
        )}

        {currState === "Sign Up" && isDataSubmitted && (
          <textarea
            rows={4}
            placeholder="Provide a short bio..."
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-500 bg-transparent 
            focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />
        )}

        <button
          type="submit"
          className="mt-2 py-3 rounded-lg font-medium 
          bg-gradient-to-r from-purple-500 to-violet-600 
          hover:opacity-90 transition-all duration-200"
        >
          {currState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className="flex items-start gap-2 text-sm text-gray-300 mt-1">
          <input type="checkbox" className="mt-1" />
          <p>Agree to the terms of use & Privacy Policy.</p>
        </div>

        <div className="flex flex-col gap-2 mt-2">
          {currState === "Sign Up" ? (
            <p className="text-sm text-gray-300">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
                className="font-medium text-violet-400 cursor-pointer hover:underline"
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-300">
              Create an account{" "}
              <span
                onClick={() => setCurrState("Sign Up")}
                className="font-medium text-violet-400 cursor-pointer hover:underline"
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>

    </div>
  )
}

export default LoginPage