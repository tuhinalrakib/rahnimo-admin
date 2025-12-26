"use client"
import Spinner from '@/components/ui/Spinner';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const HomePage = () => {
    const user = useSelector((state)=> state.user.user)
    const authStatus = useSelector((state)=> state.auth.status)
    const router = useRouter()
    
    useEffect(()=>{
        if(!user){
            router.push("/login")
        }else{
            router.push("/dashboard")
        }
    },[user, router])
    
    if(authStatus === "loading") return <Spinner />

    return (
        <div>
            
        </div>
    );
};

export default HomePage;