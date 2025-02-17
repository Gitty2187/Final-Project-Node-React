import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import { Editor } from "primereact/editor";

const SendMail = (props) => {
    const [subject, setSubject] = useState('תזכורת לתשלום חשבון ועד הבית');
    const [text, setText] = useState(`שלום ${props.lastName}, חובך לועד הוא ${props.balance} ש"ח. נא לשלם בהקדם.`);
    const ACCESS_TOKEN = useSelector((myStore) => myStore.token.token);
    const [to, setTo] = useState(props.selectedApartmentMail);

    const handleSendEmail = async () => {
        try {
            const response = await axios.post('http://localhost:7000/apartment/send-email', {
                to: props.selectedApartmentMail,
                subject,
                text
            }, {
                headers: {
                    Authorization: "Bearer " + ACCESS_TOKEN
                }
            });

            if (response.status === 200) {
                console.log('המייל נשלח בהצלחה!');
            } else {
                console.error('שגיאה בשליחת המייל');
            }
        } catch (error) {
            console.error('שגיאה בשליחת המייל:', error);
        }
    }
    return (<div>
        <Dialog header="שלח מייל" visible={props.sendMail} onHide={() => props.setSendMail(false)}>
            <div className="email-composer">
                <div className="p-field">
                    <label htmlFor="to">To</label>
                    <InputText id="to" value={to} onChange={(e) => setTo(e.target.value)} />
                </div>
                <div className="p-field">
                    <label htmlFor="subject">Subject</label>
                    <InputText id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                <div className="p-field">
                    <label>Body</label>
                    {/* <ReactQuill value={text} onChange={setText} /> */}
                    <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '320px' }} />
                </div>
                <Button label="Send Message" icon="pi pi-paper-plane" onClick={handleSendEmail} />
            </div>
            {/* <div className="p-field">
                <label htmlFor="subject">נושא:</label>
                <InputText id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="p-field">
                <label htmlFor="text">תוכן:</label>
                <InputTextarea id="text" value={text} onChange={(e) => setText(e.target.value)} rows={5} />
            </div>
            <div className="p-dialog-footer">
                {/* <Button label="שלח" icon="pi pi-check" onClick={handleSendEmail} /> */}
            {/* <Button label="סגור" icon="pi pi-times" onClick={() => props.setSendMail(false)} /> */}
    {/* </div> */} 
        </Dialog >
    </div >
    )
}
export default SendMail;