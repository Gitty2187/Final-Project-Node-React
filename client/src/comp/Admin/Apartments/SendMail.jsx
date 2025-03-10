import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import { useSelector } from 'react-redux';

import { Editor } from "primereact/editor";
import ToastService from '../../Toast/ToastService';

const SendMail = (props) => {
    const [subject, setSubject] = useState('תזכורת לתשלום חשבון ועד הבית');
    const [text, setText] = useState(`שלום ${props.lastName}<br/>חובך לועד הוא <b>${props.balance}</b>  ש"ח נא להעביר את התשלום בהקדם`);
    const ACCESS_TOKEN = useSelector((myStore) => myStore.token.token);
    const [to, setTo] = useState(props.selectedApartmentMail);

    const handleSendEmail = async () => {
        try {
            await axios.post('http://localhost:7000/apartment/send-email', {
                to: props.selectedApartmentMail,
                subject,
                text
            }, {
                headers: {
                    Authorization: "Bearer " + ACCESS_TOKEN
                }
            });
            props.setSendMail(false);
            ToastService.show('success', 'הצלחה', 'המייל נשלח בהצלחה', 3000); // עדכון כאן

        } catch (error) {
            ToastService.show('error', 'שגיאה', 'שגיאה בשליחת המייל', 3000); // עדכון כאן
        }
    }
    
    const renderHeader = () => {
        return (
            <span className="ql-formats">
                <button className="ql-bold" aria-label="Bold"></button>
                <button className="ql-italic" aria-label="Italic"></button>
                <button className="ql-underline" aria-label="Underline"></button>
                <button className="ql-align" value="right" aria-label="Align Right"></button>
            </span>
        );
    };

    const header = renderHeader();

    return (
        <div>
            <Dialog header="שלח מייל" visible={props.sendMail} onHide={() => props.setSendMail(false)} style={{ float: 'right' }}>
                <div className="email-composer">

                    <label htmlFor="to" style={{ float: 'right' }}>אל</label>
                    <div className="p-inputgroup flex-1">
                        <InputText placeholder={props.selectedApartmentMail} style={{ direction: 'rtl' }} id="to" value={to} onChange={(e) => setTo(e.target.value)} disabled />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                    </div>
                    <label htmlFor="subject" style={{ float: 'right' }}>נושא</label>
                    <div className="p-inputgroup flex-1">
                        <InputText placeholder="תזכורת תשלום לדירה" id="subject" style={{ direction: 'rtl' }} value={subject} onChange={(e) => setSubject(e.target.value)} />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-pencil"></i>
                        </span>
                    </div>

                    <label style={{ float: 'right' }}>תוכן</label>

                    <br />
                    <div className="p-field">
                        <Editor
                            value={text}
                            onTextChange={(e) => setText(e.htmlValue)}
                            headerTemplate={header} 
                            style={{ height: '15rem', width: '50rem'}} 
                            dir="rtl"
                        />
                    </div>
                    <br />
                    <Button label="שלח מייל" icon="pi pi-send" onClick={handleSendEmail} style={{ float: 'right' }} />
                </div>
            </Dialog>
        </div>
    )
}

export default SendMail;
