import React from 'react';
import { Button, InputText, Dialog } from 'primereact';
import { useForm } from 'react-hook-form';
import { InputTextarea } from "primereact/inputtextarea";
import axios from 'axios';

const AddNotice = ({ ACCESS_TOKEN, apartment, setNotices, setShowAddDialog, showAddDialog }) => {
    const { register, handleSubmit, reset } = useForm();

    const handleAddNotice = async (data) => {
        try {
            const res = await axios.post(
                `http://localhost:7000/notices/`,
                { ...data, publisher: apartment?._id },
                {
                    headers: {
                        Authorization: `Bearer ${ACCESS_TOKEN}`,
                    },
                }
            );
            setNotices((prevNotices) => [...prevNotices, res.data]);
            reset(); 
            setShowAddDialog(false); 
        } catch (error) {
            console.error('Error adding notice:', error);
        }
    };

    const handleCloseDialog = () => {
        reset(); 
        setShowAddDialog(false);
    };

    return (
        <Dialog visible={showAddDialog} header="הוסף מודעה" onHide={handleCloseDialog}>
            <form onSubmit={handleSubmit(handleAddNotice)}>
                <div className="flex flex-column gap-2">
                    <label htmlFor="title">כותרת</label>
                    <InputText id="title" {...register("title", { required: true })} />
                    <label htmlFor="content">תוכן</label>
                    <InputTextarea autoResize id="content" {...register("content", { required: true })} rows={5} cols={30} />
                    <div className="flex justify-content-end gap-2">
                        <Button label="שמור" type="submit" />
                        <Button label="ביטול" type="button" onClick={handleCloseDialog} className="p-button-secondary" />
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

export default AddNotice;
