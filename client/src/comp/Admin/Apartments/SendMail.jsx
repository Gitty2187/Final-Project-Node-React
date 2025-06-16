import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Editor } from "primereact/editor";
import ToastService from '../../Toast/ToastService';

const SendMail = (props) => {
    const [subject, setSubject] = useState(" ");
    const [text, setText] = useState(" ");
    const ACCESS_TOKEN = useSelector((myStore) => myStore.token.token);
    const [to, setTo] = useState(props.selectedApartmentMail);
    const [loading, setLoading] = useState(false);

    const handleSendEmail = async () => {
        setLoading(true);
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
            ToastService.show('success', 'הצלחה', 'המייל נשלח בהצלחה', 3000);
        } catch (error) {
            ToastService.show('error', 'שגיאה', 'שגיאה בשליחת המייל', 3000);
        } finally {
            setLoading(false);
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
    const fetchAndBuildText = async () => {
        if (!props.id) return;

        try {
            const res = await axios.get(`http://localhost:7000/apartment_sum/getUnpaidPayments/${props.id}`, {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                }
            });

            if (res.status === 200) {
                const updatedsums = res.data.map((a) => {
                    const updateDay = new Date(a.date);
                    return {
                        ...a,

                        date: `${updateDay.getDate()}/${updateDay.getMonth() + 1}/${updateDay.getFullYear()}`

                    };
                });

                let textBuilder = `שלום ${props.lastName},<br/><br/>`;
                textBuilder += `החוב שיש לועד הוא <b>${props.debt}</b> ש"ח.<br/><br/>`;
                textBuilder += `להלן פירוט החיובים:<br/><table border="3"><tr><td>סוג</td><td>תאריך</td><td>סכום שנותר לתשלום</td></tr>`;

                updatedsums.forEach((sum) => {
                    textBuilder += `<tr><td>${sum.type}</td><td>${sum.date}</td><td><b>${sum.amountRemaining}</b> ש"ח</td></tr>`;
                });
                textBuilder += `</table><br/>יש להעביר את התשלום בהקדם האפשרי!<br/>`;

                setText(textBuilder);

            }
        } catch (e) {
            console.log(e);
            ToastService.show('error', 'שגיאה', 'נכשל בהבאת התשלומים', 3000);
        }
    };
    useEffect(() => {
        if (props.lastName) {
            setSubject('תזכורת תשלום לחבון ועד הבית');
            fetchAndBuildText();
        }
        setTo(props.selectedApartmentMail);
    }, [props.debt, props.lastName, props.selectedApartmentMail, props.id]);

    return (
        <div>
            <Dialog
                header="שלח מייל"
                visible={props.sendMail}
                onHide={() => props.setSendMail(false)}
                style={{ direction: 'rtl' }}
            >
                <div className="email-composer flex flex-column gap-1" >
                    <label htmlFor="to" style={{ float: 'right' }}>אל</label>
                    <div className="p-inputgroup flex-1" style={{ direction: 'ltr' }}>
                        <InputText placeholder={props.selectedApartmentMail} id="to" value={to} disabled />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-user"></i>
                        </span>
                    </div>
                    <br />
                    <label htmlFor="subject" style={{ float: 'right' }}>נושא</label>
                    <div className="p-inputgroup flex-1" style={{ direction: 'ltr' }}>
                        <InputText
                            placeholder="הכנס טקסט"
                            id="subject"
                            style={{ direction: 'rtl' }}
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-pencil"></i>
                        </span>
                    </div>
                    <br />
                    <label style={{ float: 'right' }}>תוכן</label>
                    <div className="p-field" style={{ textAlign: 'right' }}>
                        <Editor
                            value={text}
                            onTextChange={(e) => setText(e.htmlValue)}
                            headerTemplate={header}
                            style={{ height: '15rem', width: '50rem', direction: 'rtl' }}
                            dir="rtl"
                        />
                    </div>

                    <br />
                    <Button
                        label={loading ? "שולח..." : "שלח מייל"}
                        icon={loading ? "pi pi-spinner pi-spin" : "pi pi-send"}
                        onClick={handleSendEmail}
                        disabled={loading}
                        style={{ float: 'right' }}
                    />
                </div>
            </Dialog>
        </div>
    );
};

export default SendMail;
