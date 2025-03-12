import React from 'react';
import axios from 'axios';
import { Dialog } from "primereact/dialog";
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { updateAllApar } from '../../../../Store/AllApartment';
import ToastService from '../../../Toast/ToastService';


const AddExpenses = (props) => {
    const building = useSelector((myStore) => myStore.buildingDetails.building);
    const apartment = useSelector((myStore) => myStore.apartmentDetails.apartment);
    const dispatch = useDispatch();
    const ACCESS_TOKEN = useSelector((myStore) => myStore.token.token);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const res = await axios.post('http://localhost:7000/expenses', data, {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                }
            });
       
            const newExp = res.data.map((a) => {
                const updateDay = new Date(a.date);
                return {
                    ...a,
                    date: `${updateDay.getDate()}/${updateDay.getMonth() + 1}/${updateDay.getFullYear()}`
                };
            });
            const updatedExp = [...props.expenses, ...newExp].sort((a, b) => new Date(a.date) - new Date(b.date));
            props.setExpenses(updatedExp);
            props.setVisible(false);
            ToastService.show('success', 'הצלחה', 'הוצאה נוספה בהצלחה', 3000); 
        } catch (e) {
            console.log(e);
            ToastService.show('error', 'שגיאה', 'נכשל בהוספת ההוצאה', 3000); 
        }
    }

    return (
        <>
            <Dialog
                visible={props.visible}
                header="הוספת הוצאה לבנין"
                onHide={() => { if (!props.visible) return; props.setVisible(false); }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-column px-8 py-1 gap-4" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                        <br />
                        <FloatLabel>
                            <InputText id="type" {...register("type", { required: true })} />
                            <label htmlFor="type">סוג</label>
                        </FloatLabel>
                        <FloatLabel>
                            <InputText id="date" type="date" {...register("date", { required: true })} style={{ width: '15.5rem' }} />
                            <label htmlFor="date" type='date'>תאריך</label>
                        </FloatLabel>
                        <FloatLabel>
                            <InputText id="sum" type='number' {...register("sum", { required: true })} />
                            <label htmlFor="sum">סכום ההוצאה</label>
                        </FloatLabel>
                        <FloatLabel>
                            <InputText id="comment" {...register("comment")} />
                            <label htmlFor="comment">הערה</label>
                        </FloatLabel>
                        <div className="flex align-items-center gap-2">
                            <Button label="הוספה" text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10" type="submit"></Button>
                            <Button label="ביטול" onClick={() => props.setVisible(false)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                        </div>
                    </div>
                </form>
            </Dialog>
        </>
    );
}

export default AddExpenses;
