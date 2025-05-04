import React, { useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const DeleteNotice = ({ setNotices, noticeId, setShowDeleteDialog, showDeleteDialog }) => {
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

    const confirmSuccess = () => {
        confirmDialog({
            group: 'apartmentgGroup',
            message: "האם אתה בטוח שברצונך למחוק את המודעה?",
            header: "אישור מחיקה",
            icon: 'pi pi-exclamation-triangle',
        });
    };

    showDeleteDialog && confirmSuccess()

    const handleDialogHide = () => {
        // resetForm();
    };

    return (
        <>
            {/* <Dialog
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
            </Dialog> */}
            <ConfirmDialog
                group="apartmentgGroup"
                onHide={handleDialogHide}
                content={({ headerRef, contentRef, footerRef, message, hide }) => (
                    <div className="flex flex-column align-items-center p-5 surface-overlay border-round gap-1">
                        <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                            <i className="pi pi-exclamation-triangle" style={{ fontSize: '2.5rem' }}></i>
                        </div>
                        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                            {message.header}
                        </span>
                        <p className="mb-0" ref={contentRef}>
                            {message.message}
                        </p>
                        <div className="flex flex-row align-items-center gap-2 mt-4" ref={footerRef}>
                            <Button label="כן" onClick={(event) => {
                                hide(event);
                                handleDelete();
                            }}  />
                            <Button label="לא" onClick={(event) => {
                                hide(event);
                                setShowDeleteDialog(false)
                            }} />
                        </div>
                    </div>
                )}
            />
        </>
    );
};

export default DeleteNotice;
