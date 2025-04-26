import React, { useState } from 'react';
import { Button } from 'primereact/button';
import {Dialog} from 'primereact'
import axios from 'axios';

const DeleteNotice = ({ ACCESS_TOKEN, apartment, setNotices, noticeId }) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:7000/notices/${noticeId}`, {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                },
            });
            setNotices((prevNotices) => prevNotices.filter((notice) => notice._id !== noticeId));
            setShowConfirmDialog(false); // סגור את הדיאלוג אחרי המחיקה
        } catch (error) {
            console.error('Error deleting notice:', error);
        }
    };

    return (
        <>
            <Button
                label="מחיקה"
                icon="pi pi-trash"
                className="p-button-danger"
                onClick={() => setShowConfirmDialog(true)} // פותח את דיאלוג האישור
            />

            <Dialog
                visible={showConfirmDialog}
                header="אישור מחיקה"
                onHide={() => setShowConfirmDialog(false)}
                footer={
                    <>
                        <Button
                            label="לא"
                            icon="pi pi-times"
                            onClick={() => setShowConfirmDialog(false)}
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
        </>
    );
};

export default DeleteNotice;
