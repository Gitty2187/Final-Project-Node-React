import React, { useState } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { useForm } from "react-hook-form";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useDispatch, useSelector } from 'react-redux';
import { updateApartment } from '../../Store/ApartmentSlice';
import { updateAllApar } from '../../Store/AllApartment';
import { setToken } from '../../Store/Token';
import { useNavigate } from 'react-router-dom';
import { updateBuild } from '../../Store/BuildingSlice';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import ToastService from '../Toast/ToastService';
import { Message } from 'primereact/message';


const Logup = (props) => {
    const is_admin = props.is_admin ? true : false;
    const dispatch = useDispatch();
    const building = useSelector((myStore) => myStore.buildingDetails.building);
    const navigate = useNavigate();
    const [selectedNum, setSelectedNUM] = useState(null);
    const [termsVisible, setTermsVisible] = useState(false);
    const [accepted, setAccepted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const confirm2 = () => {
        confirmDialog({
            group: 'apartmentgGroup',
            message: '',
            header: 'דייר נוסף בהצלחה',
            icon: 'pi pi-thumbs-up',
        });
    };

    const onSubmit = async (data) => {
        if (!accepted) return;
        data = { ...data, is_admin: is_admin, building_id: building?._id, number: selectedNum };
        try {
            const res = await axios.post('http://localhost:7000/apartment', data);
            dispatch(updateApartment(res.data.apartment));
            dispatch(setToken(res.data.token));
            dispatch(updateAllApar(res.data.allApartments));
            confirm2();
            props.setVisible(false);
        } catch (e) {
            ToastService.show('error', 'שגיאה', 'המייל שהכנסת כבר קיים במערכת', 3000);
        }
    };

    return (
        <>
            <Dialog
                visible={props.visible}
                header={props.header}
                onHide={() => { if (!props.visible) return; props.setVisible(false); }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-column px-8 py-1 gap-4" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                        <Dropdown required value={selectedNum} onChange={(e) => setSelectedNUM(e.value)} options={props.houseNum} optionLabel="name"
                            placeholder="מספר דירה" className="w-full md:w-14rem flex" style={{ width: '100%' }} />
                        {errors.number && <Message text="יש להזין מספר דירה" severity="error" />}

                        <FloatLabel>
                            <InputText id="mail" type='email' {...register("mail", { required: true })} style={{direction:'ltr'}}/>
                            <label htmlFor="mail">*ךלם</label>
                        </FloatLabel>
                        {errors.mail && <Message text="יש להזין מייל" severity="error" />}

                        <FloatLabel>
                            <InputText id="password" type='password' {...register("password", { required: true })} />
                            <label htmlFor="password">*סיסמא</label>
                        </FloatLabel>
                        {errors.password && <Message text="יש להזין סיסמא" severity="error" />}

                        <FloatLabel>
                            <InputText id="last_name" {...register("last_name", { required: true })} />
                            <label htmlFor="last_name">*שם משפחה</label>
                        </FloatLabel>
                        {errors.last_name && <Message text="יש להזין שם משפחה" severity="error" />}

                        <FloatLabel>
                            <InputText id="area" type="number" {...register("area")} />
                            <label htmlFor="area">שטח הדירה</label>
                        </FloatLabel>

                        <FloatLabel>
                            <InputText id="floor" type="number" {...register("floor")} />
                            <label htmlFor="floor">קומה</label>
                        </FloatLabel>

                        <FloatLabel>
                            <InputText id="entrance" {...register("entrance")} />
                            <label htmlFor="entrance">כניסה</label>
                        </FloatLabel>

                        <div className="flex align-items-center gap-2 mt-2">
                            <Checkbox inputId="accept" onChange={e => setAccepted(e.checked)} checked={accepted} />
                            <label htmlFor="accept" className="text-white">
                                אני מאשר את
                                <a href="/terms.pdf" target="_blank" rel="noopener noreferrer" className="underline text-blue-300">
                                     תקנון האתר 
                                </a>

                            </label>
                        </div>
                        {/* {!accepted && <Message text="יש לאשר את התקנון" severity="error" />} */}

                        <div className="flex align-items-center gap-2">
                            <Button label="רישום" text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10" type="submit" />
                            <Button label="ביטול" onClick={() => props.setVisible(false)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10" />
                        </div>
                    </div>
                </form>
            </Dialog>

            <ConfirmDialog
                group="apartmentgGroup"
                content={({ headerRef, contentRef, footerRef, hide, message }) => (
                    <div className="flex flex-column align-items-center p-5 surface-overlay border-round gap-1">
                        <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                            <i className="pi pi-check-circle" style={{ fontSize: '2.5rem' }}></i>
                        </div>
                        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                            {message.header}
                        </span>
                        <p className="mb-0" ref={contentRef}>
                            {message.message}
                        </p>
                        <div className="flex align-items-center gap-2 mt-4" ref={footerRef}>
                            <Button
                                label="מעבר לאתר"
                                onClick={(event) => {
                                    hide(event);
                                    navigate('/apartment');
                                }}
                                className="w-16rem"
                            />
                            <Button
                                label="חזרה"
                                onClick={(event) => {
                                    hide(event);
                                    navigate('/login');
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

export default Logup;
