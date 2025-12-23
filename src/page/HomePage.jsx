"use client"
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const HomePage = () => {
    const user = useSelector((state)=> state.user.user)
    const router = useRouter()

    useEffect(()=>{
        if(user){
            router.push("/login")
        }else{
            router.push("/dashboard")
        }
    },[user, router])

    return (
        <div>
            
        </div>
    );
};

export default HomePage;