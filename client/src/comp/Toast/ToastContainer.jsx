import React, { useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import ToastService from './ToastService';

const ToastContainer = () => {
    const toast = useRef(null);

    useEffect(() => {
        ToastService.setRef(toast.current);
    }, []);

    return <Toast ref={toast} position="top-center" style={{ direction: "rtl" }} />;
};

export default ToastContainer;
