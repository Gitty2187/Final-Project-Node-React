import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ToastService from '../Toast/ToastService';
import './ResidentUpdateForm.css';
import { updateApartment } from '../../Store/ApartmentSlice';
import { updateAllApar } from '../../Store/AllApartment';

const ResidentUpdateForm = ({ visible, onHide }) => {
    const apartment = useSelector((myStore) => myStore.apartmentDetails.apartment);
    const ACCESS_TOKEN = useSelector((myStore) => myStore.token.token);
    const dispatch = useDispatch();
    const allApartment = useSelector((myStore) => myStore.Allapartments.Allapartments);

    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            last_name: apartment?.last_name || '',
            floor: typeof apartment?.floor === 'number' ? apartment?.floor : '',
            entrance: apartment?.entrance || ''
        }
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await axios.put(
                `http://localhost:7000/apartment/update/${apartment?._id}`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${ACCESS_TOKEN}`
                    }
                }
            );
            if (response.status === 200) {
                dispatch(updateApartment(response.data.apartment))
                if(allApartment){
                dispatch(updateAllApar(
                    allApartment.map((n) =>
                        n._id === response.data.apartment._id ? response.data.apartment : n
                    )
                ));
            }
                ToastService.show('success', 'הצלחה', 'הנתונים עודכנו בהצלחה');
            }
            else
                throw errors;
            onHide();
        } catch (error) {
            ToastService.show('error', 'שגיאה', 'אירעה שגיאה בעדכון הנתונים');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            header="עדכון פרטי דייר"
            visible={visible}
            onHide={onHide}
            style={{ width: '35vw' }}
            modal
            className="p-fluid"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="resident-update-form">
                <div className="field">
                    <label htmlFor="last_name">שם משפחה</label>
                    <Controller
                        name="last_name"
                        control={control}
                        rules={{ required: 'שדה חובה', minLength: { value: 2, message: 'לפחות 2 תווים' } }}
                        render={({ field }) => (
                            <InputText id="last_name" {...field} className={classNames({ 'p-invalid': errors.last_name })} />
                        )}
                    />
                    {errors.last_name && <small className="p-error">{errors.last_name.message}</small>}
                </div>


                <div className="field">
                    <label htmlFor="floor">קומה</label>
                    <Controller
                        name="floor"
                        control={control}
                        render={({ field }) => (
                            <InputText id="floor" {...field} />
                        )}
                    />
                </div>

                <div className="field">
                    <label htmlFor="entrance">כניסה</label>
                    <Controller
                        name="entrance"
                        control={control}
                        render={({ field }) => (
                            <InputText id="entrance" {...field} />
                        )}
                    />
                </div>

                <div className="field text-left">
                    <button
                        type="submit"
                        className="p-button p-component p-button-success w-full"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="p-button-icon pi pi-spin pi-spinner p-button-icon-left" />
                                <span className="p-button-label">מעדכן...</span>
                            </>
                        ) : (
                            <>
                                <span className="p-button-icon pi pi-save p-button-icon-left" />
                                <span className="p-button-label">שמור שינויים</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </Dialog>
    );
};

export default ResidentUpdateForm;
