import React, { useState } from 'react';
import { Button, InputText, Dialog, Dropdown } from 'primereact';
import { useForm } from 'react-hook-form';
import { InputTextarea } from "primereact/inputtextarea";
import axios from 'axios';

const AddNotice = ({ ACCESS_TOKEN, apartment, setNotices, setShowAddDialog, showAddDialog }) => {
    const { register, handleSubmit, reset } = useForm();
    const [duration, setDuration] = useState('week'); // ברירת מחדל היא שבוע
    const durationOptions = [
        { label: 'יום', value: 'day' },
        { label: 'שבוע', value: 'week' },
        { label: 'חודש', value: 'month' }
    ];

    const handleAddNotice = async (data) => {
        // חישוב ה-endDate לפי הבחירה
        let endDate = new Date();
        if (duration === 'day') {
            endDate.setDate(endDate.getDate() + 1); // יום
        } else if (duration === 'week') {
            endDate.setDate(endDate.getDate() + 7); // שבוע
        } else if (duration === 'month') {
            endDate.setMonth(endDate.getMonth() + 1); // חודש
        }

        try {
            const res = await axios.post(
                `http://localhost:7000/notices/`,
                { ...data, publisher: apartment?._id, endDate: endDate.toISOString() }, // שולחים את endDate
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
                    
                    <label htmlFor="duration">משך הצגת המודעה</label>
                    <Dropdown
                        id="duration"
                        value={duration}
                        options={durationOptions}
                        onChange={(e) => setDuration(e.value)}
                        optionLabel="label"
                        placeholder="בחר"
                    />
                    
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
