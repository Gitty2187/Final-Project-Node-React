import React, { useRef, useState } from 'react';
import axios from 'axios';

import { Dialog } from "primereact/dialog";
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Toast } from "primereact/toast";
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import ToastService from '../../Toast/ToastService';
import { updateAllApar } from '../../../Store/AllApartment';
import { RadioButton } from "primereact/radiobutton";
import { updateBalance } from '../../../Store/BuildingSlice';


const AddPayment = (props) => {
    const toast = useRef(null);
    const dispatch = useDispatch();
    const ACCESS_TOKEN = useSelector((myStore) => myStore.token.token);
    const building = useSelector((store) => store.buildingDetails.building);

    const option = [
        { name: 'מזומן', key: 'מזומן' },
        { name: 'צק', key: 'צק' }
    ];
    const [payment_method, setPayment_method] = useState(option[1]);
    const allApartment = useSelector((myStore) => myStore.Allapartments.Allapartments);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        data = { ...data, apartment_id: props.apartment_id ,payment_method:payment_method.key}
        try {
            const res = await axios.post('http://localhost:7000/payments', data, {
                headers: {
                    Authorization: "Bearer " + ACCESS_TOKEN
                }
            });
            dispatch(updateAllApar(allApartment.map((n) => (n._id === res.data.apartment._id ? res.data.apartment : n))));
            dispatch(updateBalance(building.balance+data.sum));
            props.setVisible(false);
            ToastService.show('success', 'הצלחה', 'תשלום נוסף בהצלחה');
        } catch (e) {
            ToastService.show('error', 'שגיאה', 'נכשל בהוספת התשלום');
        }
    }

    return (
        <>
            <Toast ref={toast} position="top-center" style={{ direction: "rtl" }} />
            <Dialog
                visible={props.visible}
                header="דיווח תשלום לדייר  "
                onHide={() => { if (!props.visible) return; props.setVisible(false); }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-column px-8 py-1 gap-4" >

                        <FloatLabel>
                            <InputText id="date" type="date" {...register("date", { required: true })} style={{ width: '15.5rem' }} />
                            <label htmlFor="date" type='date'>תאריך</label>
                        </FloatLabel>
                        <FloatLabel>
                            <InputText id="sum" type='number' {...register("sum", { required: true })} />
                            <label htmlFor="sum">סכום התשלום </label>
                        </FloatLabel>
                        <FloatLabel>
                            <InputText id="comment" {...register("comment")} />
                            <label htmlFor="comment">הערה</label>
                        </FloatLabel>
                        <div className="flex flex-wrap gap-3">
                            {option.map((o) => {
                                return (
                                    <div key={o.key} className="flex align-items-center">
                                        <RadioButton inputId={o.key} name="category" value={o} onChange={(e) => setPayment_method(e.value)} checked={payment_method.key === o.key} />
                                        <label htmlFor={o.key} className="ml-2">{o.name}</label>
                                    </div>
                                );
                            })}
                        </div>
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

export default AddPayment;
