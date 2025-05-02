import React, { useState, useEffect } from 'react';
import { Button, InputText, Dialog } from 'primereact';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { InputTextarea } from "primereact/inputtextarea";

const EditNotice = ({ setNotices, setShowEditDialog, showEditDialog, notice }) => {
    const { register, handleSubmit, setValue, reset } = useForm({
        defaultValues: { title: notice?.title, content: notice?.content },
    });
    const ACCESS_TOKEN = useSelector((myStore) => myStore.token.token);
    const apartment = useSelector((myStore) => myStore.apartmentDetails.apartment);

    useEffect(() => {
        if (notice) {
            setValue("title", notice.title);
            setValue("content", notice.content);
        }
    }, [notice, setValue]);

    const handleEditNotice = async (data) => {
        try {
            const res = await axios.put(
                `http://localhost:7000/notices/${notice._id}`,
                { ...data, publisher: apartment?._id },
                {
                    headers: {
                        Authorization: `Bearer ${ACCESS_TOKEN}`,
                    },
                }
            );
            setNotices((prevNotices) =>
                prevNotices.map((n) => (n._id === notice._id ? res.data.notice : n))
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
            onHide={() => {
                reset();
                setShowEditDialog(false);
            }}
        >
            <form onSubmit={handleSubmit(handleEditNotice)}>
                <div className="flex flex-column gap-2">
                    <label htmlFor="title">כותרת</label>
                    <InputText id="title" {...register("title", { required: true })} />
                    <label htmlFor="content">תוכן</label>
                    <InputTextarea autoResize id="content" {...register("content", { required: true })} rows={5} cols={30} />
                    <div className="flex justify-content-end gap-2">
                        <Button label="שמור" type="submit" />
                        <Button
                            label="ביטול"
                            onClick={() => {
                                reset();
                                setShowEditDialog(false);
                            }}
                            className="p-button-secondary"
                        />
                    </div>
                </div>
            </form>
        </Dialog>
    );
};

export default EditNotice;
