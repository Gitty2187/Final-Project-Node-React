import React, { useState } from 'react';
import axios from 'axios';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { FloatLabel } from "primereact/floatlabel";
import { useForm } from "react-hook-form";
import { useDispatch } from 'react-redux';
import { updateAllApar } from '../../Store/AllApartment';
import { setToken } from '../../Store/Token';
import { updateBuild } from '../../Store/BuildingSlice';
import { updateApartment } from '../../Store/ApartmentSlice';
import { useNavigate } from 'react-router-dom';
import { Image } from 'primereact/image';
import ToastService from '../Toast/ToastService';
import { InputText } from 'primereact/inputtext';
import './Login.css'

const Login = () => {
    const [password, setBuildingPass] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessageRegister, setErrorMessageRegister] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm();

    const check_building_password = async () => {
        if (!password) {
            ToastService.show('error', 'שגיאה', 'הכנס סיסמת בנין', 3000);
            return;
        }
        try {
            const res = await axios.post(`http://localhost:7000/bulding/login`, { password: password });
            dispatch(updateBuild(res.data.building));
            dispatch(setToken(res.data.token));
            dispatch(updateAllApar(res.data.allApartments));
            dispatch(updateApartment(res.data.apartment));
            navigate('/register', { state: { header: "רישום דייר חדש", is_admin: false, houseNum: res.data.apartmentsNull } });
        } catch (e) {
            if (e.response && e.response.status === 401) {
                setErrorMessageRegister("סיסמא שגויה");
            } else {
                ToastService.show('error', 'שגיאה', 3000);
            }
        }
    };

    const onSubmit = async (data) => {
        try {
            const res = await axios.post('http://localhost:7000/apartment/login', { mail: data.mail, password: data.password });
            dispatch(setToken(res.data.token));
            dispatch(updateApartment(res.data.apartment));
            dispatch(updateBuild(res.data.building));
            dispatch(updateAllApar(res.data.allApartments));
            navigate('/apartment');
        } catch (e) {
            if (e.response && e.response.status === 401) {
                setErrorMessage("שם המשתמש או הסיסמה שגויים");
            } else {
                ToastService.show('error', 'שגיאה', 3000);
            }
        }
    };

    const handleBuildingPassChange = (e) => {
        setBuildingPass(e.target.value);
        if (errorMessageRegister) setErrorMessageRegister('');
    };

    const handleInputChange = (field, value) => {
        setValue(field, value);
        if (errorMessage) setErrorMessage('');
    };

    return (
        <>
            <div className="login-wrapper">
                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    <div className="flex flex-column md:flex-row">
                        <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-4 py-5">
                            <FloatLabel>
                                <InputText
                                    id="building_id"
                                    value={password}
                                    onChange={handleBuildingPassChange}
                                />
                                <label htmlFor="building_id">סיסמא של הבנין</label>
                            </FloatLabel>
                            {errorMessageRegister && (
                                <div className="error-message">{errorMessageRegister}</div>
                            )}
                            <Button
                                label="רישום דייר חדש"
                                icon="pi pi-user-plus"
                                className="w-12rem mx-auto"
                                onClick={check_building_password}
                                severity="secondary"
                            // type="button"
                            />

                        </div>

                        <div className="w-full md:w-2">
                            <Divider layout="vertical" className="hidden md:flex login-divider">
                                <i className="pi pi-arrow-right-arrow-left login-icon"></i>
                            </Divider>

                            <Divider layout="horizontal" className="flex md:hidden" align="center">
                                <i className="pi pi-arrow-right-arrow-left" style={{ fontSize: '1.5rem' }}></i>
                            </Divider>
                        </div>

                        <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-4 py-5">
                            <Image src="/logo.png" alt="Image" width="250px" align="center" />
                            <Button
                                label="רישום בנין חדש"
                                icon="pi pi-building"
                                onClick={() => navigate("/register_building")}
                                severity="secondary"
                                className='Button-building'
                            />
                        </div>

                        <div className="w-full md:w-2">
                            <Divider layout="vertical" className="hidden md:flex login-divider">
                                <i className="pi pi-arrow-right-arrow-left login-icon"></i>
                            </Divider>

                            <Divider layout="horizontal" className="flex md:hidden" align="center">
                                <i className="pi pi-arrow-right-arrow-left" style={{ fontSize: '1.5rem' }}></i>
                            </Divider>
                        </div>

                        <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-4 py-5">
                            <FloatLabel>
                                <InputText
                                    id="mail"
                                    type="email"
                                    {...register("mail", { required: true })}
                                    onChange={(e) => handleInputChange("mail", e.target.value)}
                                    style={{ direction: 'ltr' }}
                                />
                                <label htmlFor="mail">מייל</label>
                            </FloatLabel>

                            <FloatLabel>
                                <InputText
                                    id="password"
                                    type="password"
                                    {...register("password", { required: true })}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
                                />
                                <label htmlFor="password">סיסמא</label>
                            </FloatLabel>

                            {errorMessage && (
                                <div className="error-message-login">{errorMessage}</div>
                            )}
                            <Button
                                label="כניסת דייר רשום"
                                icon="pi pi-user"
                                className="w-12rem mx-auto"
                                type="submit"
                                severity="secondary"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Login;
