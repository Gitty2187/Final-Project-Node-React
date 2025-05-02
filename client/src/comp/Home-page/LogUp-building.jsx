import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateBuild } from '../../Store/BuildingSlice';
import axios from 'axios';
import './RegisterBuilding.css';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { useForm } from 'react-hook-form';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import ToastService from '../Toast/ToastService';
import { Message } from 'primereact/message';
import { useNavigate } from 'react-router-dom';

const LogUPBuild = () => {
    const [visible, setVisible] = useState(false);
    const [building, setBuilding] = useState();
    const [houseNum, setHouseNum] = useState();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const confirm1 = () => {
        const copyToClipboard = () => {
            navigator.clipboard.writeText(building?.password)
                .then(() => {
                    ToastService.show('success', 'הסיסמה הועתקה בהצלחה', '', 3000);
                })
                .catch(err => {
                    console.error('שגיאה בהעתקת הסיסמה: ', err);
                });
        };

        confirmDialog({
            group: 'buildingGroup',
            message: (
                <div className="dialog-copy-container">
                    <p className="dialog-copy-label">קוד הבניין שלך לכניסת דיירים חדשים:</p>
                    <div className="dialog-copy-row">
                        <Button
                            icon="pi pi-copy"
                            severity="info"
                            rounded
                            text
                            aria-label="העתק סיסמה"
                            className="dialog-copy-btn"
                            onClick={copyToClipboard}
                        />
                        <span className="dialog-copy-code">{building?.password}</span>
                    </div>
                </div>
            ),
            header: 'בניין נוסף בהצלחה',
            icon: 'pi pi-thumbs-up',
        });
    };

    const onSubmit = async (data) => {
        data.apartments_sum = data.maximum_apartment_number - data.minimum_apartment_number + 1;
        if (data.apartments_sum < 1) {
            ToastService.show('error', 'שגיאה', 'יש להזין טווח דירות חוקי', 3000);
            return;
        }
        try {
            const res = await axios.post('http://localhost:7000/bulding', data);
            dispatch(updateBuild(res.data.building));
            setBuilding(res.data.building);
            setHouseNum(res.data.apartmentsNull);
            reset();
        } catch (error) {
            console.log(error);
            ToastService.show('error', 'שגיאה', 'נכשל בהוספת הבנין, אנא נסה שוב מאוחר יותר', 3000);
        }
    };

    useEffect(() => {
        if (building) {
            confirm1();
            setVisible(false);
        }
    }, [building]);

    const handleDialogHide = () => {
        setVisible(false);
        reset(); // ✅ איפוס הטופס גם כשסוגרים את הדיאלוג
    };

    return (
        <>
            <Button
                label="רישום בנין חדש"
                icon="pi pi-building"
                onClick={() => setVisible(true)}
                severity="secondary"
                
                className='Button-building'
            />
            <Dialog
                header={null}
                visible={visible}
                onHide={handleDialogHide}
                className="dialog-container"
            >
                <div>
                    <div className="dialog-header">פתיחת בניין חדש</div>
                    <form onSubmit={handleSubmit(onSubmit)} className="dialog-form">
                        <span className="field">
                            <label htmlFor="address">כתובת הבניין</label>
                            <InputText
                                id="address"
                                {...register("address", { required: "יש להזין כתובת" })}
                                className="w-full"
                            />
                        </span>
                        {errors.address && <Message severity="error" text={errors.address.message} />}

                        <span className="field">
                            <label htmlFor="minimum_apartment_number">מס' הדירה המינימלית בבניין</label>
                            <InputText
                                type="number"
                                id="minimum_apartment_number"
                                {...register("minimum_apartment_number", { required: "יש להזין מספר דירה מינימלי" })}
                                className="w-full"
                            />
                        </span>
                        {errors.minimum_apartment_number && <Message severity="error" text={errors.minimum_apartment_number.message} />}

                        <span className="field">
                            <label htmlFor="maximum_apartment_number">מס' הדירה המקסימלית בבניין</label>
                            <InputText
                                type="number"
                                id="maximum_apartment_number"
                                {...register("maximum_apartment_number", { required: "יש להזין מספר דירה מקסימלי" })}
                                className="w-full"
                            />
                        </span>
                        {errors.maximum_apartment_number && <Message severity="error" text={errors.maximum_apartment_number.message} />}

                        <Button type="submit" label="צור בניין" className="dialog-btn" />
                    </form>
                </div>
            </Dialog>

            <ConfirmDialog
                group="buildingGroup"
                content={({ headerRef, contentRef, footerRef, hide, message }) => (
                    <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
                        <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                            <i className="pi pi-thumbs-up-fill" style={{ fontSize: '2.5rem' }}></i>
                        </div>
                        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                            {message.header}
                        </span>
                        <p className="mb-0" ref={contentRef}>
                            {message.message}
                        </p>
                        <div className="flex align-items-center gap-2 mt-4" ref={footerRef}>
                            <Button
                                label="מעבר לרישום ועד הבית"
                                onClick={(event) => {
                                    hide(event);
                                    navigate('/register', { state: { header: "רישום ועד בית", is_admin: true, houseNum } });
                                }}
                                className="w-16rem"
                            />
                        </div>
                    </div>
                )}
            />
        </>
    );
};

export default LogUPBuild;

