import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import axios from "axios"
import { useNavigate } from 'react-router-dom';




const baseUrl = "http://localhost:8080/api";

function Form() {

    const location = useLocation();
    const navigate = useNavigate()
    const [inValidUser, setInValidUser] = useState('');
    const [ busy, setBusy ] = useState(true); 
    const [ success, setSuccess ] = useState(false);
    const [error, setError] = useState('');
    const [newPassword, setNewPassword] = useState({
        password:"",
        confirmPassword:""
    });
    
    const {token, id} = queryString.parse(location.search);
    
    const verifyToken = async () => {
       
        try {
            const {data} = await axios(`${baseUrl}/verify-token?token=${token}&id=${id}`);
            setBusy(false)
            

        } catch (error) {
            if(error?.response?.data){
                const { data } = error.response; 
                if(!data.success) return setInValidUser(data.error);
                return console.log(error.response.data);
                
            }
             
            console.log(error);
            
        }


    }


    useEffect(() => {
        verifyToken();
    },[]);

    const handleOnChange = ({target}) => {
        const { name , value } = target;
        setNewPassword({...newPassword,[name]:value});

    }

    const handleSubmit = async (e) => {

        e.preventDefault();
        
        const {password,confirmPassword} = newPassword;
        // console.log(newPassword)
        if(password.trim().length < 8 || password.trim().length > 20){
            return setError("Password must be 8 to 20 characters long !!");
        }
        if(password !== confirmPassword){
            return setError("Password Does Not Match!!s");
        };

        


        try {


            setBusy(true)
            const {data} = await axios.post(`${baseUrl}/reset-password?token=${token}&id=${id}`,{password});
            setBusy(false)

            if(data.success){
                
                navigate('/reset-password');
                setSuccess(true);
                


            }
            

        } catch (error) {
            if(error?.response?.data){
                const { data } = error.response; 
                if(!data.success) return setInValidUser(data.error);
                return console.log(error.response.data);
                
            }
             
            console.log(error);
            
        }

        
    }


    if(inValidUser){
        return (
            <div className='max-w-screen-sm mx-auto pt-40'>
                <h2 className='text-center text-3xl text-gray-500 mb-4'>{inValidUser}</h2>
            </div>
            
        )
    }

    if(busy){
        return (
            <div className='max-w-screen-sm m-auto pt-40'>
                <h1 className='text-center text-3xl text-gray-500 mb-3'>Wait for a moment verifying reset token.</h1>
            </div>
        )
    }

    if(success){
        return (
            <div className='max-w-screen-sm mx-auto pt-40'>
                <h2 className='text-center text-3xl text-gray-500 mb-4'>Password Reset Successfully ..</h2>
            </div>
            
        )
    }


  return (
    <div>
      <div className="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
        <h1 className="text-4xl font-medium">Reset password</h1>
        <p className="text-slate-500">Fill up the form to reset the password</p>

        <form onSubmit={handleSubmit} action="" className="my-10">
           {error &&  (
             <p className="text-center p-2 mb-3 bg-red-500">{error}</p>
           )}
          <div className="flex flex-col space-y-5">
            <label for="password">
              <p className="font-medium text-slate-700 pb-2">Password</p>
              <input
                id="password"
                name="password"
                type="password"
                onChange={handleOnChange}
                className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                placeholder="* * * * * * * * * *"
              />
            </label>
            <label for="password">
              <p className="font-medium text-slate-700 pb-2">
                Conform-Password
              </p>
              <input
                onChange={handleOnChange}
                id="conform-password"
                name="confirmPassword"
                type="password"
                
                className="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow"
                placeholder="* * * * * * * * * *"
              />
            </label>

            <button className="w-full py-3 font-medium text-white bg-[#FBBA01] hover:bg-[#fbba09d2] rounded-lg border-[#fbba09d2] hover:shadow inline-flex space-x-2 items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                />
              </svg>

              <span>Reset password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Form;
