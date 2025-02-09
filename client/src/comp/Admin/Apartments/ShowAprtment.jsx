import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import { useSelector } from 'react-redux';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import AddSums from '../Accounts/Sums/AddSums';


const ShowApartment = (props) => {
    const allApartment = useSelector((myStore) => myStore.Allapartments.Allapartments);
    const [visible, setVisible] = useState(false);

    const getSeverity = (balance) => {
        console.log(balance);
        if (balance < 0)
            return 'success';
        else
            return 'danger';
    };

    const itemTemplate = (data) => {

        return (
            <div className="col-12">
                <div className="flex flex-row align-items-center p-4 gap-4 border-round shadow-2">
                    <div className="flex flex-column gap-2">

                        <div className="font-semibold" >
                            <Tag value={data.balance < 0 ? `יתרה: ${data.balance} ש"ח` : `חוב: ${Math.abs(data.balance)} ש"ח`} severity={getSeverity(data.balance)} style={{ width: '10rem', fontSize: '1rem' }}></Tag>
                        </div>
                        <Button
                            label="שלח מייל"
                            className="p-button-info"
                            onClick={() => handleSend(data._id)}
                            icon='pi pi-envelope'
                        />
                    </div>

                    {/* <div className="flex flex-row gap-2 flex-grow-1 text-right" style={{direction:'rtl'}}> */}
                    <div className="flex flex-row gap-2 flex-grow-1 text-right" style={{ direction: 'rtl' }}>
                        <div className="text-2xl text-700" style={{ alignContent: 'center',width:'5rem'  }}> דירה {data.number}</div>
                        <Divider layout="vertical" />
                        <div className="text-2xl font-bold text-700" style={{ alignContent: 'center',width:'10rem',textAlign:'center' }}> {data.last_name}</div>
                        <Divider layout="vertical" />
                        <Button
                            label="הוספת תשלום לדירה "
                            className="p-button-success"
                            onClick={() => {setVisible(true)}}
                            style={{backgroundColor: 'GrayText',borderBlockColor:'black'}}
                        />
                        
                         {visible && <AddSums visible={visible} setVisible={setVisible} is_general={false} apartments_id={[data._id]}/>}
                    </div>
                    {/* </div> */}
                </div>
            </div>
        );
    };

    const handlePayment = (id) => {

    };

    const handleSend = (id) => {
        // לוגיקה לשליחת מייך לדירה עם ה-ID הנתון
        console.log(`שליחת מייך לדירה עם ID: ${id}`);
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
        
        </div>
        
    );
}

export default ShowApartment;
