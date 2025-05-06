import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

const Start = () => {
    const apartment = useSelector((myStore) => myStore.apartmentDetails.apartment);

    useEffect(() => {
        apartment ? 
        window.location.href = "/apartment" :
        window.location.href = "/login"
    }, []);

    return (
        <div>
        </div>
    );
};

export default Start;