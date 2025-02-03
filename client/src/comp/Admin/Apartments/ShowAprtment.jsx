import React from 'react';
import { Button } from 'primereact/button';
import { DataScroller } from 'primereact/datascroller';
import { useSelector } from 'react-redux';

const ShowApartment = (props) => {
    const allApartment = useSelector((myStore) => myStore.AllApartments.Allapartments);
    console.log(allApartment+ "ShowApartment");
    
    const itemTemplate = (data) => {
        return (
            <div className="col-12">
                <div className="flex flex-row align-items-center p-4 gap-4 border-round shadow-2">
                    <div className="flex flex-row gap-2">
                        <Button 
                            label="הוסף תשלום" 
                            className="p-button-success" 
                            onClick={() => handlePayment(data._id)} 
                        />
                        <Button 
                            label="שלח מייל" 
                            className="p-button-info" 
                            onClick={() => handleSend(data._id)} 
                        />
                    </div>
                    <div className="flex flex-column gap-2 flex-grow-1 text-right" >
                        <div className="text-2xl font-bold text-900">מספר דירה: {data.number}</div>
                        <div className="text-700">שם משפחה: {data.last_name}</div>
                        <div className="font-semibold">
                            {data.balance < 0 ? `יתרה: ${data.balance} ש"ח` : `חוב: ${Math.abs(data.balance)} ש"ח`}
                        </div>
                    </div>
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
        <div className="card" style={{width:'75rem', float: 'right' }}>
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
