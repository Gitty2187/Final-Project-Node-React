import React, { useEffect } from 'react';

const Start = () => {
    useEffect(() => {
        window.location.href = "http://localhost:3000/login";
    }, []);

    return (
        <div>
           
        </div>
    );
};

export default Start;