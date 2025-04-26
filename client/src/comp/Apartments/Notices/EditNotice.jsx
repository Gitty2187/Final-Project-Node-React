import React, { useState, useEffect } from 'react';
import { Button, InputText, Dialog } from 'primereact';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const EditNotice = ({ ACCESS_TOKEN, apartment, setNotices, setShowEditDialog, showEditDialog, notice }) => {
    // הגדרת defaultValues לפי הערכים מהמודעה הנוכחית
    const { register, handleSubmit, setValue } = useForm({
        defaultValues: { title: notice?.title, content: notice?.content },
    });

    useEffect(() => {
        // עדכון הערכים בעת הצגת הדיאלוג, אם יש שינוי ב-notice
        if (notice) {
            setValue("title", notice.title);
            setValue("content", notice.content);
        }
    }, [notice, setValue]);

    const handleEditNotice = async (data) => {
        try {
            const res = await axios.put(
                `http://localhost:7000/notices/${notice._id}`,
                { ...data, publisher: apartment._id },
                {
                    headers: {
                        Authorization: `Bearer ${ACCESS_TOKEN}`,
                    },
                }
            );
            setNotices((prevNotices) =>
                prevNotices.map((n) => (n._id === notice._id ? res.data : n))
            );
            
            setShowEditDialog(false);
        } catch (error) {
            console.error('Error updating notice:', error);
        }
    };

    return (
        <Dialog
            visible={showEditDialog}
            header="ערוך את המודעה"
            onHide={() => setShowEditDialog(false)}
        >
            <form onSubmit={handleSubmit(handleEditNotice)}>
                <div className="flex flex-column gap-2">
                    <label htmlFor="title">כותרת</label>
                    <InputText id="title" {...register("title", { required: true })} />
                    <label htmlFor="content">תוכן</label>
                    <InputText id="content" {...register("content", { required: true })} />
                    <div className="flex justify-content-end gap-2">
                        <Button label="שמור" type="submit" />
                        <Button
                            label="ביטול"
                            onClick={() => setShowEditDialog(false)}
                            className="p-button-secondary"
                        />
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

export default EditNotice;
