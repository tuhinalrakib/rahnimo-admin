import React from 'react';
import AddProjectsClient from './AddProjectsClient';

export const metadata = {
  title: "Add Projects",
  description: "This is Interior and Architecture site",
};

const AddProjects = () => {
    return (
        <div className='p-6 mt-10'>
            <AddProjectsClient />
        </div>
    )
};

export default AddProjectsClient