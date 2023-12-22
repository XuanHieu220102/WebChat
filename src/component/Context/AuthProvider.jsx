import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../../firebase/config'
import { useEffect } from 'react';
import { Spin } from 'antd';

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    useEffect(() => {
        auth.onAuthStateChanged((user) =>{
            // console.log(user);
            if (user) {
                const { displayName, email, uid, photoURL } = user;
                setUserInfo({
                    displayName, email, uid, photoURL
                })
                setIsLoading(false)
                navigate('/');
            }else{
                setIsLoading(false)
                navigate("/login")
            }
            
        });
    }, [navigate])
    // console.log("2",userInfo);
    return (
        <AuthContext.Provider value={{userInfo}}>
            {isLoading ? <Spin style={{position:'fixed', inset: 0}} /> :  children}
        </AuthContext.Provider>
    )
}
