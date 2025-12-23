import React from 'react';

const CardSkeleton = () => {
    return (
        <div className="
            rounded-3xl overflow-hidden shadow-lg 
            bg-white/20 backdrop-blur-md border border-gray-200
            animate-pulse
        ">
            <div className="w-full h-95 bg-gray-300/50" />
            <div className="p-5 space-y-4">
                <div className="h-5 w-3/4 bg-gray-300/70 rounded-md"></div>
                <div className="h-4 w-1/2 bg-gray-300/70 rounded-md"></div>
                <div className="h-5 w-1/4 bg-gray-300/70 rounded-md"></div>
                <div className="flex justify-between mt-6">
                    <div className="h-10 w-24 bg-gray-300/70 rounded-xl"></div>
                    <div className="h-10 w-24 bg-gray-300/70 rounded-xl"></div>
                </div>
            </div>
        </div>
    );
};

export default CardSkeleton;