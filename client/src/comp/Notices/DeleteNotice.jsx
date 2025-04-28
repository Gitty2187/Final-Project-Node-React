import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { mergeProps } from 'primereact/utils';

const DeleteNotice = ({ setNotices, noticeId,setShowDeleteDialog,showDeleteDialog }) => {
    const ACCESS_TOKEN = useSelector((myStore) => myStore.token.token);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:7000/notices/${noticeId}`, {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                },
            });
            setNotices((prevNotices) => prevNotices.filter((notice) => notice._id !== noticeId)); 
            setShowDeleteDialog(false); 
        } catch (error) {
            console.error('Error deleting notice:', error);
        }
    };

    return (
        <Dialog
            visible={showDeleteDialog}
            header="אישור מחיקה"
            onHide={() => setShowDeleteDialog(false)}
            footer={
                <>
                    <Button
                        label="לא"
                        icon="pi pi-times"
                        onClick={() => setShowDeleteDialog(false)}
                        className="p-button-text"
                    />
                    <Button
                        label="כן"
                        icon="pi pi-check"
                        onClick={handleDelete}
                        className="p-button-danger"
                    />
                </>
            }
        >
            <p>האם אתה בטוח שברצונך למחוק את המודעה?</p>
            <p>מחיקת המודעה היא צעד בלתי הפיך</p>
        </Dialog>
    );
};

export default DeleteNotice;
