import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import { useSelector } from 'react-redux';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import AddSums from '../Accounts/Sums/AddSums';
import SendMail from './SendMail';
import AddPayment from './AddPayment';
import Leave from './ApartmentLeave';
import { Tooltip } from 'primereact/tooltip';
import './ShowAprtment.css'


const ShowApartment = () => {
    const allApartment = useSelector((myStore) => myStore.Allapartments.Allapartments);
    const [visible, setVisible] = useState(false);
    const [visibleSum, setVisibleSum] = useState(false);
    const [visibleLeft, setVisibleLeft] = useState(false);
    const [selectedApartmentId, setSelectedApartmentId] = useState(null);
    const [selectedApartmentMail, setSelectedApartmentMail] = useState(null);
    const [selectedApartmentLastName, setSelectedApartmenLastName] = useState(null);
    const [selectedApartmentdebt, setSelectedApartmendebt] = useState(null);
    const [sendMail, setSendMail] = useState(false);
    const [sendMailAllApartmentnts, setSendMailAllApartmentnts] = useState(false);



    const getSeverity = (debt) => {
        return debt < 0 ? 'success' : 'danger';
    };

    const itemTemplate = (data) => {
        return (
            <div className="col-30" style={{marginRight:'3rem'}}>
                <div className="flex flex-row align-items-center p-4 gap-4 border-round">
                    <div className="flex flex-column gap-2">
                        <div className="text-2xl text-700" style={{ alignContent: 'center', textAlign: 'center' }}>משפחת  {data.last_name}</div>
                        <div className="flex flex-row items-center gap-2">
                            <Tooltip target=".user-minus-icon" content="דיווח דייר שעזב" position="top" />

                            <i
                                className="pi pi-user-minus user-minus-icon cursor-pointer text-xl"
                                onClick={() => {
                                    setSelectedApartmentId(data._id);
                                    setVisibleLeft(true);
                                }}
                                style={{ pointerEvents: data.is_admin ? 'none' : 'auto', opacity: data.is_admin ? 0.4 : 1 }}
                            />

                            <div className="text-xl text-500 text-center">דירה {data.number}</div>
                        </div>


                    </div>
                    <Divider layout="vertical" />

                    <div className="flex flex-column gap-2 flex-grow-8 text-right" style={{ direction: 'rtl' }}>
                        <Button
                            label="הוספת הוצאה "
                            className="p-button-success"
                            onClick={() => {
                                setSelectedApartmentId(data._id);
                                setVisible(true);
                            }}
                            // style={{ backgroundColor: 'GrayText', borderBlockColor: 'black' }}
                        />
                        <Button
                            label=" דיווח תשלום"
                            className="p-button-success"
                            onClick={() => {
                                setSelectedApartmentId(data._id);
                                setVisibleSum(true);
                            }}
                            // style={{ backgroundColor: 'GrayText', borderBlockColor: 'black' }}
                        />



                        {sendMailAllApartmentnts &&
                            <SendMail
                                sendMail={sendMailAllApartmentnts}
                                setSendMail={setSendMailAllApartmentnts}
                                selectedApartmentMail={allApartment.map(apartments => {
                                    return apartments.mail
                                })}
                            />}
                        {sendMail && <SendMail sendMail={sendMail} setSendMail={setSendMail} selectedApartmentMail={selectedApartmentMail} lastName={selectedApartmentLastName} debt={selectedApartmentdebt} />}
                        {visibleLeft && <Leave apartment_id={[selectedApartmentId]} lastName={selectedApartmentLastName} />}
                        {visible && <AddSums visible={visible} setVisible={setVisible} is_general={false} apartments_id={[selectedApartmentId]} />}
                        {visibleSum && <AddPayment visible={visibleSum} setVisible={setVisibleSum} apartment_id={[selectedApartmentId]} />}
                    </div>
                    <Divider layout="vertical" />
                    <div className="flex flex-row items-center gap-2">
                        <Tooltip target=".send-mail-icon" content="שלח מייל" position="top" />
                        <div className="flex flex-column items-center gap-2">
                            <div></div>
                            <i
                                className="pi pi-envelope send-mail-icon cursor-pointer text-4xl"
                                onClick={() => {
                                    setSelectedApartmentMail(data.mail);
                                    setSelectedApartmenLastName(data.last_name);
                                    setSelectedApartmendebt(data.debt);
                                    setSendMail(true);
                                }}
                            />
                            <div></div>
                        </div>
                        <Tag value={data.debt < 0 ? `יתרה: ${data.debt} ש"ח` : `חוב: ${Math.abs(data.debt)} ש"ח`} severity={getSeverity(data.debt)} style={{ width: '10rem', fontSize: '1.3rem' }}></Tag>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="card" style={{ width: '60rem', float: 'right' ,marginRight:'2rem'}}>
            <DataScroller
                value={allApartment}
                itemTemplate={itemTemplate}
                rows={5}
                inline
                scrollHeight="500px"
                header="רשימת הדיירים לבנין"
            />
            <br />
            <Button label="שלח מייל לכל הדיירים" text raised onClick={() => setSendMailAllApartmentnts(true)} style={{float:'left'}}/>
        </div>
    );
}

export default ShowApartment;
