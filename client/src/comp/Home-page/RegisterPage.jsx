import React, { useRef, useState } from 'react';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { updateApartment } from '../../Store/ApartmentSlice';
import { updateAllApar } from '../../Store/AllApartment';
import { setToken } from '../../Store/Token';
import ToastService from '../Toast/ToastService';
import './RegisterPage.css';

const RegisterPage = (props) => {
    const [formData, setFormData] = useState({
        last_name: '',
        mail: '',
        password: '',
        floor: '',
        entrance: '',
        accepted: false
    });
    const [selectedNum, setSelectedNUM] = useState(null);
    const [errors, setErrors] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const routeLocation = useLocation();
    const building = useSelector((store) => store.buildingDetails.building);
    const headerText = routeLocation.state?.header || props.header
    const is_admin = routeLocation.state?.is_admin || props.is_admin;
    const houseNum = routeLocation.state?.houseNum || props.houseNum

    const resetForm = () => {
        setFormData({
            last_name: '',
            mail: '',
            password: '',
            floor: '',
            entrance: '',
            accepted: false
        });
        setSelectedNUM(null);
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        if (name === 'mail') {
            setErrorMessage('');
        }
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validate = () => {
        let newErrors = {};
        if (!selectedNum) newErrors.number = 'יש לבחור מספר דירה';
        if (!formData.last_name) newErrors.last_name = 'יש להזין שם משפחה';
        if (!formData.mail) newErrors.mail = 'יש להזין מייל';
        if (!formData.password) newErrors.password = 'יש להזין סיסמה';
        if (!formData.accepted) newErrors.accepted = 'יש לאשר את התקנון';
        return newErrors;
    };

    const confirmSuccess = () => {
        confirmDialog({
            group: 'apartmentgGroup',
            message: '',
            header: 'דייר נוסף בהצלחה',
            icon: 'pi pi-thumbs-up',
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        const data = {
            ...formData,
            is_admin,
            building_id: building?._id,
            number: selectedNum
        };

        try {
            const res = await axios.post('http://localhost:7000/apartment', data);
            dispatch(updateApartment(res.data.apartment));
            dispatch(setToken(res.data.token));
            dispatch(updateAllApar(res.data.allApartments));
            props.onSuccess ? props.onSuccess()
                : confirmSuccess();

        } catch (error) {
            if (error.status === 500)
                setErrorMessage("המייל לא תקין");
            else {
                if (error.status === 401)
                    setErrorMessage("המייל שהכנסת כבר קיים במערכת");
                else
                    ToastService.show('error', 'שגיאה', 3000);
            }
        }
    };

    const handleDialogHide = () => {
        resetForm();
    };

    const handleNavigate = (path) => {
        resetForm();
        navigate(path);
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2>{headerText}</h2>
                    <p>מלאו את הפרטים כדי להירשם</p>
                </div>

                <form onSubmit={handleSubmit} dir="rtl">
                    <div className="field">
                        <label htmlFor="apartmentNum">מספר דירה<span className="required-star">*</span></label>
                        <Dropdown
                            inputId="apartmentNum"
                            value={selectedNum}
                            onChange={(e) => setSelectedNUM(e.value)}
                            options={houseNum}
                            optionLabel="name"
                            className="w-full dropdown-field"
                        />
                        {errors.number && <small className="p-error">{errors.number}</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="last_name">שם משפחה<span className="required-star">*</span></label>
                        <InputText id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full" />
                        {errors.last_name && <small className="p-error">{errors.last_name}</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="mail">מייל<span className="required-star">*</span></label>
                        <InputText id="mail" name="mail" value={formData.mail} onChange={handleChange} className="w-full" type="email" style={{ direction: 'ltr' }} />
                        {errors.mail && <small className="p-error">{errors.mail}</small>}
                        {errorMessage && (
                            <div className="error-message">{errorMessage}</div>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="password">סיסמה<span className="required-star">*</span></label>

                        <Password id="password" name="password" value={formData.password} onChange={handleChange} className="w-full" feedback={false} />
                        {errors.password && <small className="p-error">{errors.password}</small>}
                    </div>


                    <div className="field">
                        <label htmlFor="floor">קומה</label>
                        <InputText id="floor" name="floor" value={formData.floor} onChange={handleChange} className="w-full" type="text" />
                    </div>

                    <div className="field">
                        <label htmlFor="entrance">כניסה</label>
                        <InputText id="entrance" name="entrance" value={formData.entrance} onChange={handleChange} className="w-full" type="text" />
                    </div>

                    <div className="field-checkbox">
                        <Checkbox inputId="accept" name="accepted" checked={formData.accepted} onChange={handleChange} />
                        <label htmlFor="accept" className="checkbox-label">
                            אני מאשר את <a href="/terms.pdf" target="_blank">תקנון האתר</a>
                        </label>
                        {errors.accepted && <small className="p-error">{errors.accepted}</small>}
                    </div>

                    <Button type="submit" label="הרשמה" className="submit-btn w-full" />
                    <p className="login-link">כבר רשום? <a href="/login">התחבר</a></p>
                </form>
            </div>

            <ConfirmDialog
                group="apartmentgGroup"
                onHide={handleDialogHide}
                content={({ headerRef, contentRef, footerRef, message, hide }) => (
                    <div className="flex flex-column align-items-center p-5 surface-overlay border-round gap-1">
                        <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem">
                            <i className="pi pi-check-circle" style={{ fontSize: '2.5rem' }}></i>
                        </div>
                        <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
                            {message.header}
                        </span>
                        <p className="mb-0" ref={contentRef}>
                            {message.message}
                        </p>
                        <div className="flex align-items-center gap-2 mt-4" ref={footerRef}>
                            <Button label="מעבר לאתר" onClick={() => handleNavigate('/apartment')} className="w-16rem" />
                            <Button label="חזרה" onClick={() => handleNavigate('/login')} className="w-16rem" />
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default RegisterPage;
