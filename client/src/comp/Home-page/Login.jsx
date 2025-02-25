import React, { useRef } from 'react';
import axios from 'axios'
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { FloatLabel } from "primereact/floatlabel";
import { useForm } from "react-hook-form"
import { Message } from 'primereact/message';
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import Logup from './LogUp-apartment';
import LogUPBuild from "./LogUp-building"
import { Toast } from 'primereact/toast';
import { useDispatch, useSelector } from 'react-redux';
import { updateAllApar } from '../../Store/AllApartment';
import { setToken } from '../../Store/Token';
import { updateBuild } from '../../Store/BuildingSlice';
import { updateApartment } from '../../Store/ApartmentSlice';
import { useNavigate } from 'react-router-dom';

import { Image } from 'primereact/image';

const Login = () => {
    const toast = useRef(null);
    const [visible, setVisible] = useState(false);
    const [password, setBuildingPass] = useState()
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const [houseNum, setHouseNum]= useState()
    



    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const check_building_password = async () => {
        if (!password) {
            toast.current.show({
                severity: 'error',
                summary: 'שגיאה',
                detail: 'הכנס סיסמת בנין',
                life: 3000,
            });
            return;
        }
        try {
            const res = await axios.get(`http://localhost:7000/bulding/${password}`)
            dispatch(updateBuild(res.data.building))
            dispatch(setToken(res.data.token))
            dispatch(updateAllApar(res.data.allApartments))
            dispatch(updateApartment(res.data.apartment))
            setHouseNum(res.data.apartmentsNull)
            setVisible(true)
        }
        catch (e) {
            toast.current.show({
                severity: 'error',
                summary: 'שגיאה',
                detail: 'סיסמה שגויה',
                life: 3000,
            });
        }
    }

    //בדיקת פרטי דייר
    const onSubmit = async (data) => {
        try {
            const res = await axios.get("http://localhost:7000/apartment?mail=" + data.mail + "&password=" + data.password);
            dispatch(setToken(res.data.token))
            dispatch(updateApartment(res.data.apartment))
            dispatch(updateBuild(res.data.building))
            dispatch(updateAllApar(res.data.allApartments))
            navigate('/apartment')
        }
        catch (e) {
            console.log(e);

            toast.current.show({
                severity: 'error',
                summary: 'שגיאה',
                detail: 'שם משתמש או סיסמא שגויים',
                life: 3000,
            });
        }
    }

    return (<>
        <Toast ref={toast} position="top-center" style={{direction:"rtl"}}/>
        <form onSubmit={handleSubmit(onSubmit)} style={{backgroundColor:'rgb(225, 225, 225)' }}>
            <div className="flex flex-column md:flex-row">
                <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-4 py-5 ">
                    <FloatLabel>
                        <InputText id="mail" type="email"  {...register("mail", { required: true })} />
                        <label htmlFor="mail">מייל</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText id="password" type='password' {...register("password", { required: true })} />
                        <label htmlFor="password" >סיסמא</label>
                    </FloatLabel>
                    {/* {errors.exampleRequired && <div className="card flex justify-content-center">
                        <Message text="שדות חובה" /></div>} */}
                    <Button label="כניסת דייר רשום" icon="pi pi-user" className="w-12rem mx-auto" type="submit" severity="secondary"></Button>
                </div>
                <div className="w-full md:w-2">
                    <Divider layout="vertical" className="hidden md:flex" style={{padding:0,backgroundColor:'rgb(225, 225, 225)'}}>
                        <i className="pi pi-angle-double-right" style={{ fontSize: '1.5rem', backgroundColor:'rgb(225, 225, 225)',padding:0}}></i>
                    </Divider>
                    <Divider layout="horizontal" className="flex md:hidden" align="center">
                        <i className="pi pi-angle-double-down" style={{ fontSize: '1.5rem' }}></i>
                    </Divider>
                </div >
                <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-4 py-5 ">
                    <Image src="/logo.png" alt="Image" width='250rem' align="center"/>
                    <LogUPBuild toast={toast} />
                </div>
                <div className="w-full md:w-2">
                    <Divider layout="vertical" className="hidden md:flex">
                        <i className="pi pi-angle-double-right" style={{ fontSize: '1.5rem' }}></i>
                    </Divider>
                    <Divider layout="horizontal" className="flex md:hidden" align="center">
                        <i className="pi pi-angle-double-down" style={{ fontSize: '1.5rem' }}></i>
                    </Divider>
                </div >
                <div className="w-full md:w-5 flex flex-column align-items-center justify-content-center gap-4 py-5">
                    <FloatLabel>
                        <InputText id="building_id" onChange={(e) => setBuildingPass(e.target.value)} />
                        <label htmlFor="passwors">סיסמא של הבנין</label>
                    </FloatLabel>
                    <Button label="רישום דייר חדש" icon="pi pi-user-plus" className="w-12rem mx-auto" onClick={() => { check_building_password() }} severity="secondary"></Button>
                </div>

            </div>
        </form>
        
        <Logup toast={toast} setVisible={setVisible} visible={visible} houseNum={houseNum}  header={"רישום דייר חדש "}/>
        {/* </div> */}
        {/* </div> */}
        {/* </div> */}






    </>)
}
export default Login