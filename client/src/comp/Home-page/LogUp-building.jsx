import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateBuild } from '../../Store/BuildingSlice';
import axios from 'axios';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { FloatLabel } from 'primereact/floatlabel';
import { InputText } from 'primereact/inputtext';
import { useForm } from 'react-hook-form';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import Logup from './LogUp-apartment';
import ToastService from '../Toast/ToastService';
import { Message } from 'primereact/message';


const LogUPBuild = (props) => {
    const [visible, setVisible] = useState(false);
    const [visLogup, setVisLOgup] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();
    const [building, setBuilding] = useState();
    const [houseNum, setHouseNum] = useState();

    const confirm1 = () => {
        const copyToClipboard = () => {
            navigator.clipboard.writeText(building.password)
                .then(() => {
                    ToastService.show('success', 'סיסמא הועתקה בהצלחה', '', 3000); // עדכון כאן
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
                    <Button title="העתקת הסיסמא" icon="pi pi-copy" size='large' rounded text severity="secondary" aria-label="Bookmark" onClick={copyToClipboard} />
                </div>
            ),
            header: 'בנין נוסף בהצלחה',
            icon: 'pi pi-thumbs-up',
        });
    };

    const onSubmit = async (data) => {
        data.apartments_sum = data.apartments_sum - data.minimum_apartment_number + 1;
        if (data.apartments_sum < 1) {
            ToastService.show('error', 'שגיאה', 'יש להזין מספר דירות גדול מ0', 3000); // עדכון כאן
            return;
        }
        try {
            const res = await axios.post('http://localhost:7000/bulding', data);
            dispatch(updateBuild(res.data.building));
            setBuilding(res.data.building);
            setHouseNum(res.data.apartmentsNull);
        } catch (error) {
            console.log(error);
            ToastService.show('error', 'שגיאה', 'נכשל בהוספת הבנין, \n אנא נסה שוב מאוחר יותר', 3000); // עדכון כאן
        }
    };

    useEffect(() => {
        if (building) {
            confirm1(); // הצגת אישור רק כאשר building מעודכן
            setVisible(false); // סגירת הדיאלוג
        }
    }, [building]);

    return (
        <>
            <Button
                label="רישום בנין חדש"
                icon="pi pi-building"
                onClick={() => setVisible(true)}
                severity="secondary"
                style={{ backgroundColor: 'rgb(209, 187, 155)', borderBlockColor: "black", color: "black" }}
            />
            <Dialog
                visible={visible}
                modal
                onHide={() => setVisible(false)}
                header="פתיחת בנין חדש"
                className="card flex justify-content-center"
                style={{ width: '30vw', borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--teal-200), var(--teal-300))' }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="card justify-content-center flex flex-column px-8 py-5 gap-4">
                        <FloatLabel>
                            <InputText
                                id="address"
                                {...register('address', { required: true })}
                            />
                            <label htmlFor="address">כתובת הבנין</label>
                            {errors.address && (
                                <Message text="יש להזין כתובת בנין" severity="error" />
                            )}
                        </FloatLabel>

                        <FloatLabel>
                            <InputText
                                type="number"
                                id="minimum_apartment_number"
                                {...register('minimum_apartment_number', { required: true })}
                            />
                            <label htmlFor="minimum_apartment_number">מספר הדירה הנמוכה בבנין</label>
                            {errors.minimum_apartment_number && (
                                <Message text="יש להזין מספר דירות מינינלי" severity="error" />
                            )}
                        </FloatLabel>

                        <FloatLabel>
                            <InputText
                                type="number"
                                id="apartments_sum"
                                {...register('apartments_sum', { required: true })}
                            />
                            <label htmlFor="apartments_sum">מספר הדירה הגבוה בבנין</label>
                            {errors.apartments_sum && (
                                <Message text="יש להזין מספר הדירה המקסימלי" severity="error" />
                            )}
                        </FloatLabel>

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
                                    setVisLOgup(true);
                                }}
                                className="w-16rem"
                            ></Button>
                        </div>
                    </div>
                )}
            />

            {visLogup && <Logup toat={props.toast} is_admin={true} visible={visLogup} setVisible={setVisLOgup} toast={props.toast} houseNum={houseNum} header={"רישום ועד בית"} />}
        </>
    );
};

export default LogUPBuild;
// import React, { useState, useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { updateBuild } from '../../Store/BuildingSlice';
// import axios from 'axios';

// import { Button } from 'primereact/button';
// import { Dialog } from 'primereact/dialog';
// import { FloatLabel } from 'primereact/floatlabel';
// import { InputText } from 'primereact/inputtext';
// import { Dropdown } from 'primereact/dropdown';
// import { useForm } from 'react-hook-form';
// import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
// import Logup from './LogUp-apartment';
// import ToastService from '../Toast/ToastService';
// import { Message } from 'primereact/message';

// const LogUPBuild = (props) => {
//     const [visible, setVisible] = useState(false);
//     const [visLogup, setVisLOgup] = useState(false);

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//     } = useForm();
//     const dispatch = useDispatch();
//     const [building, setBuilding] = useState();
//     const [houseNum, setHouseNum] = useState();

//     const [cities, setCities] = useState([]);
//     const [selectedCity, setSelectedCity] = useState(null);
//     const [neighborhoods, setNeighborhoods] = useState([]);
//     const [selectedNeighborhood, setSelectedNeighborhood] = useState(null);
//     const [streets, setStreets] = useState([]);
//     const [selectedStreet, setSelectedStreet] = useState(null);

//     const confirm1 = () => {
//         const copyToClipboard = () => {
//             navigator.clipboard.writeText(building.password)
//                 .then(() => {
//                     ToastService.show('success', 'סיסמא הועתקה בהצלחה', '', 3000);
//                 })
//                 .catch(err => {
//                     console.error('שגיאה בהעתקת הסיסמא: ', err);
//                 });
//         };

//         confirmDialog({
//             group: 'buildingGroup',
//             message: (
//                 <div>
//                     <p>:קוד הבנין שלך לכניסת דיירים חדשים</p>
//                     <a style={{ fontSize: '25px', fontFamily: 'cursive' }}> {building.password} </a>
//                     <Button title="העתקת הסיסמא" icon="pi pi-copy" size='large' rounded text severity="secondary" onClick={copyToClipboard} />
//                 </div>
//             ),
//             header: 'בנין נוסף בהצלחה',
//             icon: 'pi pi-thumbs-up',
//         });
//     };

    

//     const onSubmit = async (data) => {
//         data.apartments_sum = data.apartments_sum - data.minimum_apartment_number + 1;
//         if (data.apartments_sum < 1) {
//             ToastService.show('error', 'שגיאה', 'יש להזין מספר דירות גדול מ0', 3000);
//             return;
//         }
//         data.address = `${selectedStreet?.name || ''}, ${selectedNeighborhood?.name || ''}, ${selectedCity?.name || ''}`;

//         try {
//             const res = await axios.post('http://localhost:7000/bulding', data);
//             dispatch(updateBuild(res.data.building));
//             setBuilding(res.data.building);
//             setHouseNum(res.data.apartmentsNull);
//         } catch (error) {
//             console.log(error);
//             ToastService.show('error', 'שגיאה', 'נכשל בהוספת הבנין, אנא נסה שוב מאוחר יותר', 3000);
//         }
//     };

//     useEffect(() => {
//         if (building) {
//             confirm1();
//             setVisible(false);
//         }
//     }, [building]);

//     return (
//         <>
//             <Button
//                 label="רישום בנין חדש"
//                 icon="pi pi-building"
//                 onClick={() => { setVisible(true); fetchCities(); }}
//                 severity="secondary"
//                 style={{ backgroundColor: 'rgb(209, 187, 155)', borderBlockColor: "black", color: "black" }}
//             />

//             <Dialog
//                 visible={visible}
//                 modal
//                 onHide={() => setVisible(false)}
//                 header="פתיחת בנין חדש"
//                 className="card flex justify-content-center"
//                 style={{ width: '30vw', borderRadius: '12px', backgroundImage: 'radial-gradient(circle at left top, var(--teal-200), var(--teal-300))' }}
//             >
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <div className="card justify-content-center flex flex-column px-8 py-5 gap-4">
                       
//                         <FloatLabel>
//                             <InputText type="number" id="minimum_apartment_number" {...register('minimum_apartment_number', { required: true })} />
//                             <label htmlFor="minimum_apartment_number">מספר הדירה הנמוכה בבנין</label>
//                             {errors.minimum_apartment_number && <Message text="יש להזין מספר דירה מינימלי" severity="error" />}
//                         </FloatLabel>

//                         <FloatLabel>
//                             <InputText type="number" id="apartments_sum" {...register('apartments_sum', { required: true })} />
//                             <label htmlFor="apartments_sum">מספר הדירה הגבוה בבנין</label>
//                             {errors.apartments_sum && <Message text="יש להזין מספר דירה מקסימלי" severity="error" />}
//                         </FloatLabel>

//                         <div className="flex align-items-center gap-2">
//                             <Button label="רישום" type="submit" className="p-3 w-full text-primary-50 border-1 border-white-alpha-30 hover:bg-white-alpha-5" />
//                             <Button label="ביטול" type="button" onClick={() => setVisible(false)} className="p-3 w-full text-primary-60 border-1 border-white-alpha-30 hover:bg-white-alpha-1" />
//                         </div>
//                     </div>
//                 </form>
//             </Dialog>

//             <ConfirmDialog
//                 group="buildingGroup"
//                 content={({ headerRef, contentRef, footerRef, hide, message }) => (
//                     <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
//                         <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
//                             <i className="pi pi-thumbs-up-fill" style={{ fontSize: '2.5rem' }}></i>
//                         </div>
//                         <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>{message.header}</span>
//                         <p className="mb-0" ref={contentRef}>{message.message}</p>
//                         <div className="flex align-items-center gap-2 mt-4" ref={footerRef}>
//                             <Button label="מעבר לרישום ועד הבית" onClick={(event) => { hide(event); setVisLOgup(true); }} className="w-16rem" />
//                         </div>
//                     </div>
//                 )}
//             />

//             {visLogup && <Logup toat={props.toast} is_admin={true} visible={visLogup} setVisible={setVisLOgup} toast={props.toast} houseNum={houseNum} header={"רישום ועד בית"} />}
//         </>
//     );
// };

// export default LogUPBuild;

