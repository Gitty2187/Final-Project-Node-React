import React, { useState } from 'react';
import { Button, InputText, Dialog } from 'primereact';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const AddNotice = ({ ACCESS_TOKEN, apartment, setNotices, setShowAddDialog, showAddDialog }) => {
    const { register, handleSubmit } = useForm();
    
    const handleAddNotice = async (data) => {
        try {
            const res = await axios.post(
                `http://localhost:7000/notices/`,
                { ...data, publisher: apartment._id },
                {
                    headers: {
                        Authorization: `Bearer ${ACCESS_TOKEN}`,
                    },
                }
            );
            setNotices((prevNotices) => [...prevNotices, res.data]);
            setShowAddDialog(false); // סגירת הדיאלוג
        } catch (error) {
            console.error('Error adding notice:', error);
        }
    };

    return (
        <Dialog visible={showAddDialog} header="הוסף מודעה" onHide={() => setShowAddDialog(false)}>
            <form onSubmit={handleSubmit(handleAddNotice)}>
                <div className="flex flex-column gap-2">
                    <label htmlFor="title">כותרת</label>
                    <InputText id="title" {...register("title", { required: true })} />
                    <label htmlFor="content">תוכן</label>
                    <InputText id="content" {...register("content", { required: true })} />
                    <div className="flex justify-content-end gap-2">
                        <Button label="שמור" type="submit" />
                        <Button label="ביטול" onClick={() => setShowAddDialog(false)} className="p-button-secondary" />
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

export default AddNotice;
