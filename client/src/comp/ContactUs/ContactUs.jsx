import React, { useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Navbar from '../Navbar/Nav';

const ContactUsForm = () => {
    const [subject, setSubject] = useState('');
    const [text, setText] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const ACCESS_TOKEN = useSelector((myStore) => myStore.token.token);

    const handleSendEmail = async () => {
        if (!subject || !text || !email) {
            toast.current.show({
                severity: 'warn',
                summary: 'שגיאה',
                detail: 'נא למלא את כל השדות',
                life: 3000
            });
            return;
        }

        const fullMessage = `${text}\n\nכתובת מייל לחזרה: ${email}`;

        setLoading(true);
        try {
            await axios.post('http://localhost:7000/apartment/send-email', {
                to: "yourhomecontrol2025@gmail.com",
                subject,
                text: fullMessage
            }, {
                headers: {
                    Authorization: "Bearer " + ACCESS_TOKEN
                }
            });

            toast.current.show({
                severity: 'success',
                summary: 'הצלחה',
                detail: 'המייל נשלח בהצלחה',
                life: 3000
            });

            setSubject('');
            setText('');
            setEmail('');
        } catch (error) {
            toast.current.show({
                severity: 'error',
                summary: 'שגיאה',
                detail: 'שגיאה בשליחת המייל',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center px-4 sm:px-8 rounded-xl" dir="rtl"  >
                <div className="w-full max-w-sm surface-card shadow-3 rounded-8xl p-5">
                    <Toast ref={toast} />
                    <h2 className="text-2xl mb-4 text-center">צור קשר</h2>

                    <div className="mb-3">
                        <label htmlFor="subject" className="block mb-2">נושא</label>
                        <InputText id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full" />
                    </div>
                    <br/><br/>
                    <div className="mb-3">
                        <label htmlFor="text" className="block mb-2">תוכן הבקשה</label>
                        <InputTextarea id="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full" rows={5} autoResize />
                    </div>
                    <br/><br/>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">כתובת מייל לחזרה</label>
                        <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full" />
                    </div>
                    <br/><br/>
                    <Button label="שלח" icon="pi pi-send" onClick={handleSendEmail} loading={loading} className="w-full" />
                </div>
            </div>
        </>
    );
};

export default ContactUsForm;
