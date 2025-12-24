"use client"
import StatsCards from '@/components/dashboard/StatsCards';
import Spinner from '@/components/ui/Spinner';
import { Card, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const DashboardClientPage = () => {
    const user = useSelector((state) => state.user.user)
    const router = useRouter()
    const status = useSelector((state)=> state.auth.status)
    
    useEffect(() => {
        if (!user) router.replace("/login")
        }, [user, router])
    
    if(status === "loading") return <Spinner />

    return (
        <div className='space-y-6 p-4 md:p-6'>
            <h1 className="text-2xl font-semibold">My Dashboard</h1>
            <StatsCards />

            <Card className="shadow-md hover:shadow-lg transition">
                <CardContent>
                    <Typography variant="h6" className="font-bold text-primary">
                        Notifications
                    </Typography>
                    <p className="text-sm text-gray-500 mt-2">
                        You don’t have any new notifications.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardClientPage;