import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateBuild } from '../../Store/BuildingSlice';
import axios from 'axios';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { useForm } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import { Message } from 'primereact/message';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import Logup from './LogUp-apartment';



const LogUPBuild = (props) => {
    const [visible, setVisible] = useState(false);
    const [visLogup, setVisLOgup] = useState(false)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch()
    const [building, setBuilding] = useState()
    const [houseNum, setHouseNum] = useState()



    //אישור הוספת בנין
    // const confirm1 = () => {
    //     confirmDialog({
    //         group: 'buildingGroup',
    //         message: "קוד הבנין שלך לכניסת דיירים חדשים:"+"\n\n"+building.password,
    //         header: 'בנין נוסף בהצלחה',
    //         icon: 'pi pi-thumbs-up',
    //     });
    // };
    const confirm1 = () => {
        const copyToClipboard = () => {
            navigator.clipboard.writeText(building.password)
                .then(() => {
                    props.toast.current.show({ severity: 'success', summary: 'סיסמא הועתקה בהצלחה', life: 3000 });
                })
                .catch(err => {
                    console.error('שגיאה בהעתקת הסיסמא: ', err);
                });
        };

        confirmDialog({
            group: 'buildingGroup',
            message: (
                <div>
                    <p>:קוד הבנין שלך לכניסת דיירים חדשים</p>
                    <a style={{ fontSize: '25px', fontFamily: 'cursive' }}>{" " + building.password + " "}</a>
                    <Button title="העתקת הסיסמא" icon="pi pi-copy" size='large' rounded text severity="secondary" aria-label="Bookmark"  onClick={copyToClipboard} />
                </div>
            ),
            header: 'בנין נוסף בהצלחה',
            icon: 'pi pi-thumbs-up',
        });
    };


    //רישום הבנין
    const onSubmit = async (data) => {
        data.apartments_sum = data.apartments_sum - data.minimum_apartment_number + 1;
        if (data.apartments_sum < 1) {
            props.toast.current.show({
                severity: 'error',
                summary: 'שגיאה',
                detail: 'יש להזין מספר דירות גדול מ0',
                life: 3000,
            });
            return
        }
        try {

            const res = await axios.post('http://localhost:7000/bulding', data);
            dispatch(updateBuild(res.data.building))
            setBuilding(res.data.building)
            setHouseNum(res.data.apartmentsNull)
            // confirm1()//הצגת אישור
            // setVisible(false); // סגירת הדיאלוג

        } catch (error) {
            console.log(error);

            props.toast.current.show({
                severity: 'error',
                summary: 'שגיאה',
                detail: 'נכשל בהוספת הבנין, \n אנא נסה שוב מאוחר יותר',
                life: 3000,
            });
        }
    };

    useEffect(() => {
        if (building) {
            confirm1(); // הצגת אישור רק כאשר building מעודכן
            setVisible(false); // סגירת הדיאלוג
        }
    }, [building]);

    return (<>
        {/* כפתור לפתיחת הדיאלוג */}
        <Button
            label="רישום בנין חדש"
            icon="pi pi-building"
            onClick={() => setVisible(true)}
            severity="secondary"
            style={{ backgroundColor: 'rgb(209, 187, 155)', borderBlockColor: "black", color: "black" }}
        />
        {/* <div className="card flex justify-content-center"> */}
        <Toast ref={props.toast} position="top-center" />
        {/* הדיאלוג */}
        <Dialog
            visible={visible}
            modal
            onHide={() => setVisible(false)}
            header="פתיחת בנין חדש"
            className="card flex justify-content-center"
            style={{ width: '30vw', borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--teal-200), var(--teal-300))' }}
        >
            {/* הטופס */}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="card justify-content-center flex flex-column px-8 py-5 gap-4">
                    {/* שדה כתובת */}
                    <FloatLabel>
                        <InputText
                            id="address"
                            {...register('address', { required: true })}
                        />
                        <label htmlFor="address">כתובת הבנין</label>
                        {errors.address && (
                            <Message
                                text="יש להזין כתובת בנין"
                                severity="error"
                            />
                        )}
                    </FloatLabel>

                    {/* שדה מספר דירה נמוכה */}
                    <FloatLabel>
                        <InputText
                            type="number"
                            id="minimum_apartment_number"
                            {...register('minimum_apartment_number', {
                                required: true,
                            })}
                        />
                        <label htmlFor="minimum_apartment_number">
                            מספר הדירה הנמוכה בבנין
                        </label>
                        {errors.minimum_apartment_number && (
                            <Message
                                text="יש להזין מספר דירות מינינלי"
                                severity="error"
                            />
                        )}
                    </FloatLabel>

                    {/* שדה מספר דירה גבוהה */}
                    <FloatLabel>
                        <InputText
                            type="number"
                            id="apartments_sum"
                            {...register('apartments_sum', {
                                required: true,
                            })}
                        />
                        <label htmlFor="apartments_sum">
                            מספר הדירה הגבוה בבנין
                        </label>
                        {errors.apartments_sum && (
                            <Message
                                text="יש להזין מספר הדירה המקסימלי"
                                severity="error"
                            />
                        )}
                    </FloatLabel>

                    {/* כפתורי פעולה */}
                    <div className="flex align-items-center gap-2">
                        <Button
                            label="רישום"
                            type="submit"
                            className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-5"
                        />
                        <Button
                            label="ביטול"
                            type="button"
                            onClick={() => setVisible(false)}
                            className="p-3 w-full text-primary-60 border-1 border-white-alpha-30 hover:bg-white-alpha-1"
                        />
                    </div>
                </div>
            </form>
        </Dialog>

        {/* אישור לפתיחת בנין */}
        <ConfirmDialog
            group="buildingGroup"
            content={({ headerRef, contentRef, footerRef, hide, message }) => (
                <div className="flex flex-column align-items-center p-5 surface-overlay border-round" >
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
                                setVisLOgup(true)
                            }}
                            className="w-16rem"
                        ></Button>
                    </div>

                </div>
            )}
        />

        {/* </div> */}
        {visLogup && <Logup toat={props.toast} is_admin={true} visible={visLogup} setVisible={setVisLOgup} toast={props.toast} houseNum={houseNum} />}
    </>
    );
};


export default LogUPBuild