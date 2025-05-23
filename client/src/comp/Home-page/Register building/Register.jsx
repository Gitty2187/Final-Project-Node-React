import React from 'react';
import { useDispatch } from 'react-redux';
import { updateBuild } from '../../../Store/BuildingSlice';
import axios from 'axios';
import './RegisterBuilding.css';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { useForm } from 'react-hook-form';
import { Message } from 'primereact/message';
import ToastService from '../../Toast/ToastService';

const RegisterBuilding = ({ onSuccess }) => {
    const dispatch = useDispatch();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = async (data) => {
        // Combine city, neighborhood, and building into one string with commas
        data.address = `${data.city}, ${data.neighborhood}, ${data.building}`;
        data.apartments_sum = data.maximum_apartment_number - data.minimum_apartment_number + 1;

        if (data.apartments_sum < 1) {
            ToastService.show('error', 'שגיאה', 'יש להזין טווח דירות חוקי', 3000);
            return;
        }

        try {
            const res = await axios.post('http://localhost:7000/bulding', data);
            dispatch(updateBuild(res.data.building));
            reset();
            onSuccess(res.data);
        } catch (error) {
            console.log(error);
            ToastService.show('error', 'שגיאה', 'נכשל בהוספת הבנין, אנא נסה שוב מאוחר יותר', 3000);
        }
    };

    return (
        <div className="register-container-building">
            <form onSubmit={handleSubmit(onSubmit)} className="dialog-form">

                {/* City Field */}
                <div className="field">
                    <label htmlFor="city">עיר</label>
                    <InputText
                        id="city"
                        {...register("city", { required: "יש להזין עיר" })}
                        className="w-full"
                    />
                    {errors.city && <Message severity="error" text={errors.city.message} />}
                </div>

                {/* Neighborhood Field */}
                <div className="field">
                    <label htmlFor="neighborhood">שכונה</label>
                    <InputText
                        id="neighborhood"
                        {...register("neighborhood", { required: "יש להזין שכונה" })}
                        className="w-full"
                    />
                    {errors.neighborhood && <Message severity="error" text={errors.neighborhood.message} />}
                </div>

                {/* Building Field */}
                <div className="field">
                    <label htmlFor="building">בניין</label>
                    <InputText
                        id="building"
                        {...register("building", { required: "יש להזין בניין" })}
                        className="w-full"
                    />
                    {errors.building && <Message severity="error" text={errors.building.message} />}
                </div>

                {/* Range of Apartments */}
                <label htmlFor="minimum_apartment_number">טווח הדירות</label>
                <div className="field flex flex-row">
                    <InputText
                        type="number"
                        id="maximum_apartment_number"
                        {...register("maximum_apartment_number", { required: "יש להזין מספר דירה מקסימלי" })}
                        style={{ width: "6rem" }}
                    />
                    {errors.maximum_apartment_number && (
                        <Message severity="error" text={errors.maximum_apartment_number.message} />
                    )}
                    <p></p>
                    <hr style={{ width: "100%", border: "1px solid #ccc", margin: "1.2rem 0" }} />
                    <p></p>
                    <InputText
                        type="number"
                        id="minimum_apartment_number"
                        {...register("minimum_apartment_number", { required: "יש להזין מספר דירה מינימלי" })}
                        style={{ width: "6rem" }}
                    />
                    {errors.minimum_apartment_number && (
                        <Message severity="error" text={errors.minimum_apartment_number.message} />
                    )}
                </div>

                <Button type="submit" label="צור בניין" className="dialog-btn w-full" />
            </form>
        </div>
    );
};

export default RegisterBuilding;