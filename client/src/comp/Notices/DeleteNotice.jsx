import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { useSelector } from 'react-redux';

const DeleteNotice = ({ setNotices, noticeId }) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const ACCESS_TOKEN = useSelector((myStore) => myStore.token.token);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:7000/notices/${noticeId}`, {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                },
            });
            setNotices((prevNotices) => prevNotices.filter((notice) => notice._id !== noticeId)); // עדכון ה-state
            setShowConfirmDialog(false); // סגור את הדיאלוג אחרי המחיקה
        } catch (error) {
            console.error('Error deleting notice:', error);
        }
    };

    const handleDeleteClick = () => {
        setShowConfirmDialog(true); // הצגת דיאלוג האישור לפני המחיקה
    };

    return (
        <>
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
