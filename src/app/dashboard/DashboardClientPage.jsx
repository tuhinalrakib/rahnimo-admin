"use client"
import { Card, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const DashboardClientPage = () => {
    const user = useSelector((state) => state.user.user)
    const router = useRouter()

    useEffect(() => {
        if (!user) router.replace("/login")
    }, [user, router])

    return (
        <div>
            
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