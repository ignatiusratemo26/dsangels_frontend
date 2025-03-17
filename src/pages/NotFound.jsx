import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {Button} from '@mui/material'
import { useAuth } from '../contexts/AuthContext';


const NotFoundPage = () => {

    const { currentUser } = useAuth();
    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <h1>404 - Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
            <Link to={currentUser ? '/dashboard' : '/'}><Button>Go Back</Button></Link>
        </div>
    );
}
export default NotFoundPage;