import React, { useRef, useState } from 'react';
import axios from 'axios'

import { Dialog } from "primereact/dialog"
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import { useForm } from 'react-hook-form';
import { useSelector,useDispatch } from 'react-redux';
import { updateAllApar } from '../../../../Store/AllApartment';

// import {updateAllApar} from "..../Store/"

const AddSums = (props) => {
    const toast = useRef(null);
    const building = useSelector((myStore) => myStore.buildingDetails.building)
    const apartment = useSelector((myStore) => myStore.apartmentDetails.apartment)
    const allapartment = useSelector((myStore) => myStore.Allapartments.Allapartments)
    const dispatch = useDispatch()
    const ACCESS_TOKEN = useSelector((myStore) => myStore.token.token);

    
    // const options = ['הוצאה חודשית', 'הוצאה חד פעמית'];
    // const [value, setValue] = useState(options[0]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data) => {
        try {
            // console.log(allapartment);
            const apartments_id = allapartment.map(a=>a._id)
            const is_general = props.is_general ? true : false;
            data = { ...data, building_id: building._id, admin_id: apartment._id,admin_last_name: apartment.last_name,apartments_id,is_general}
            const res = await axios.post('http://localhost:7000/apartment_sum', data, {
                headers: {
                    Authorization: "Bearer " + ACCESS_TOKEN
                }
            });
            const updatedSums = res.data.allApartments_sum.map((a) => {
                const updateDay = new Date(a.date);
                return {
                    ...a,
                    date: `${updateDay.getDate()}/${updateDay.getMonth() + 1}/${updateDay.getFullYear()}`
                };
            });
            // console.log(res.data.allApartments_sum);
            props.setSums(updatedSums);
            // console.log(updatedSums);
            console.log(res.data.allApartments);
            
            dispatch(updateAllApar(res.data.allApartments))
            props.setVisible(false)
        }
        catch (e) {
            console.log(e);
            
            toast.current.show({
                severity: 'error',
                summary: 'שגיאה',
                detail: 'נכשל בהוספת התשלום',
                life: 3000,
            });
        }

    }

    return (<>
        <Toast ref={toast} position="top-center" style={{ direction: "rtl" }} />
        <Dialog
            visible={props.visible}
            header="הוספת תשלום לכלל הדיירים"
            //modal
            onHide={() => { if (!props.visible) return; props.setVisible(false); }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-column px-8 py-1 gap-4" style={{ borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--primary-400), var(--primary-700))' }}>
                    <br />
                    {/* <SelectButton value={value} onChange={(e) => setValue(e.value)} options={options} /> */}
                    {/* {value===options[0] ? <Constant register={register}/> : <One_time register={register}/>} */}
                    <FloatLabel>
                        <InputText id="type"   {...register("type", { required: true })} />
                        <label htmlFor="type" >סוג</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText id="date" type="date" {...register("date", { required: true })} style={{width:'15.5rem'}}/>
                        <label htmlFor="date" type='date' >תאריך</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText id="sum" type='number'{...register("sum", { required: true })} />
                        <label htmlFor="sum">סכום התשלום לדייר</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText id="comment" {...register("comment")} />
                        <label htmlFor="comment">הערה</label>
                    </FloatLabel>
                    {/* {errors.mail && <Message text="יש להזין מייל" severity="error" />} */}

                    {/* {errors.password && <Message text="יש להזין סיסמא" severity="error" />} */}
                    <div className="flex align-items-center gap-2">
                        <Button label="הוספה" text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10" type="submit"></Button>
                        <Button label="ביטול" onClick={() => props.setVisible(false)} text className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-10"></Button>
                    </div>
                </div>
            </form>

        </Dialog>
    </>)
}

export default AddSums