import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import { useDispatch, useSelector } from 'react-redux';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import AddSums from '../Accounts/Sums/AddSums';
import SendMail from './SendMail';
import AddPayment from './AddPayment';
import Leave from './ApartmentLeave';
// import AddApartmentPayment from './AddApartmentPayment';


const ShowApartment = () => {
    const allApartment = useSelector((myStore) => myStore.Allapartments.Allapartments);
    const [visible, setVisible] = useState(false);
    const [visibleSum, setVisibleSum] = useState(false);
    const [visibleLeft, setVisibleLeft] = useState(false);
    const [selectedApartmentId, setSelectedApartmentId] = useState(null);
    const [selectedApartmentMail, setSelectedApartmentMail] = useState(null);
    const [selectedApartmentLastName, setSelectedApartmenLastName] = useState(null);
    const [selectedApartmentBalance, setSelectedApartmenBalance] = useState(null);
    const [sendMail, setSendMail] = useState(false);
    const [sendMailAllApartmentnts, setSendMailAllApartmentnts] = useState(false);



    const getSeverity = (balance) => {
        return balance < 0 ? 'success' : 'danger';
    };

    const itemTemplate = (data) => {
        return (
            <div className="col-12">
                <div className="flex flex-row align-items-center p-4 gap-4 border-round shadow-2">
                    <div className="flex flex-column gap-2">
                        <div className="font-semibold">
                            <Tag value={data.balance < 0 ? `יתרה: ${data.balance} ש"ח` : `חוב: ${Math.abs(data.balance)} ש"ח`} severity={getSeverity(data.balance)} style={{ width: '10rem', fontSize: '1rem' }}></Tag>
                        </div>
                        <Button
                            label="שלח מייל"
                            className="p-button-info"
                            onClick={() => { setSelectedApartmentMail(data.mail); setSelectedApartmenLastName(data.last_name); setSelectedApartmenBalance(data.balance); setSendMail(true) }}
                            icon='pi pi-envelope'
                        />
                    </div>

                    <div className="flex flex-row gap-2 flex-grow-1 text-right" style={{ direction: 'rtl' }}>
                        <div className="text-2xl text-700" style={{ alignContent: 'center', width: '5rem' }}> דירה {data.number}</div>
                        <Divider layout="vertical" />
                        <div className="text-2xl font-bold text-700" style={{ alignContent: 'center', width: '10rem', textAlign: 'center' }}> {data.last_name}</div>
                        <Divider layout="vertical" />
                        <Button
                            label="הוספת הוצאת מחיר לדירה "
                            className="p-button-success"
                            onClick={() => {
                                setSelectedApartmentId(data._id);
                                setVisible(true);
                            }}
                            style={{ backgroundColor: 'GrayText', borderBlockColor: 'black' }}
                        />
                        <Button
                            label=" דיווח תשלום לדירה"
                            className="p-button-success"
                            onClick={() => {
                                setSelectedApartmentId(data._id);
                                setVisibleSum(true);
                            }}
                            style={{ backgroundColor: 'GrayText', borderBlockColor: 'black' }}
                        />
                        <Button
                            label="דייר עזב"
                            icon="pi pi-user-minus"
                            onClick={() => {
                                setSelectedApartmentId(data._id); 
                                setVisibleLeft(true);           
                            }}
                            style={{ float: 'right' }}
                            disabled={data.is_admin} 
                            title={data.is_admin ? "לא ניתן למחוק את ועד הבית" : "מחיקת נתוני הדייר"}
                        />


                        {sendMailAllApartmentnts &&
                            <SendMail
                                sendMail={sendMailAllApartmentnts}
                                setSendMail={setSendMailAllApartmentnts}
                                selectedApartmentMail={allApartment.map(apartments => {
                                    return apartments.mail
                                })}
                            />}
                        {sendMail && <SendMail sendMail={sendMail} setSendMail={setSendMail} selectedApartmentMail={selectedApartmentMail} lastName={selectedApartmentLastName} balance={selectedApartmentBalance} />}
                        {visibleLeft && <Leave apartment_id={[selectedApartmentId]} lastName={selectedApartmentLastName} />}
                        {visible && <AddSums visible={visible} setVisible={setVisible} is_general={false} apartments_id={[selectedApartmentId]} />}
                        {visibleSum && <AddPayment visible={visibleSum} setVisible={setVisibleSum} apartment_id={[selectedApartmentId]} />}
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="card" style={{ width: '75rem', float: 'right' }}>
            <DataScroller
                value={allApartment}
                itemTemplate={itemTemplate}
                rows={5}
                inline
                scrollHeight="500px"
                header="רשימת הדיירים לבנין"
            />
            <Button label="שלח מייל לכל הדיירים" text raised onClick={() => setSendMailAllApartmentnts(true)} />
        </div>
    );
}

export default ShowApartment;
