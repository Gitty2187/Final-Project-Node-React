import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const ConfirmDialog = ({ visible, message, onHide }) => {
    const navigate = useNavigate();

    return (
        <div className={`confirm-dialog ${visible ? 'visible' : ''}`}>
            <div className="flex flex-column align-items-center p-5 surface-overlay border-round gap-1">
                <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
                    <i className="pi pi-check-circle" style={{ fontSize: '2.5rem' }}></i>
                </div>
                <span className="font-bold text-2xl block mb-2 mt-4">
                    {message.header}
                </span>
                <p className="mb-0">
                    {message.message}
                </p>
                <div className="flex align-items-center gap-2 mt-4">
                    <Button
                        label="מעבר לאתר"
                        onClick={() => {
                            onHide();  
                            navigate('/apartment')
                        }}
                        className="w-16rem"
                    />
                    <Button
                        label="חזרה"
                        onClick={() => {
                            onHide();  
                            navigate('/login')
                        }}
                        className="w-16rem"
                    />
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
