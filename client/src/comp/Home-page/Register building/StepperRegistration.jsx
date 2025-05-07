import React, { useEffect, useState } from "react";
import { Steps } from "primereact/steps";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./Stepper.css";
import RegisterBuilding from "./Register";
import RegisterPage from "../RegisterPage";
import ToastService from "../../Toast/ToastService";
import { useNavigate } from "react-router-dom";
import PdfFormGenerator from "../EntryDocument";

const StepperRegistration = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [approvedInstructions, setApprovedInstructions] = useState(false);
  const [buildingData, setBuildingData] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    console.log(buildingData);

    if (buildingData) {
      nextStep();
    }
  }, [buildingData]);

  const handleBuildingSuccess = (building) => {
    setBuildingData(building);
  };

  const steps = [
    { label: "אישור הוראות" },
    { label: "רישום בניין" },
    { label: "רישום ועד הבית" },
    { label: "סיום" },
  ];

  const isBuildingValid = () => !!buildingData;

  const canProceed = () => {
    if (activeIndex === 0) return approvedInstructions;
    if (activeIndex === 1) return isBuildingValid();
    if (activeIndex === 2) return true;
    return false;
  };

  const nextStep = () => {
    if (!canProceed()) return;
    setActiveIndex((prev) => prev + 1);
  };

  const prevStep = () => {
    if (activeIndex > 0) setActiveIndex((prev) => prev - 1);
  };

  const copyToClipboard = () => {

    navigator.clipboard.writeText(buildingData.building?.password)
      .then(() => {
        ToastService.show('success', 'הסיסמה הועתקה בהצלחה', '', 3000);
      })
      .catch(err => {
        console.error('שגיאה בהעתקת הסיסמה: ', err);
      });
  };

  const renderStepContent = () => {
    switch (activeIndex) {
      case 0:
        return (
          <div>
            <h2>הוראות שימוש באתר לניהול ועד בית</h2>
            <p>ברוך הבא לאתר לניהול ועד הבית. כאן תוכל לנהל את כל ענייני הוועד בצורה נוחה ויעילה. אנא עקוב אחר ההוראות הבאות:</p>
            <ol>
              <li>
                <strong>הרשמה:</strong>
                <p>אם עדיין אין לך חשבון, לחץ על כפתור <strong>"הרשמה"</strong> בפינה העליונה ומלא את פרטי ההרשמה הנדרשים.</p>
              </li>
              <li>
                <strong>כניסה לחשבון:</strong>
                <p>לאחר ההרשמה, היכנס לחשבון שלך באמצעות כתובת הדוא"ל והסיסמה שהגדרת.</p>
              </li>
              <li>
                <strong>הוספת בניין:</strong>
                <p>לאחר הכניסה, תוכל להוסיף את פרטי הבניין שלך, כולל כתובת, מספר דירות ושמות הדיירים.</p>
              </li>
              <li>
                <strong>ניהול תשלומים:</strong>
                <p>תוכל לעקוב אחר תשלומי הדיירים, להפיק קבלות ולשלוח תזכורות בצורה אוטומטית.</p>
              </li>
              <li>
                <strong>מעקב אחר תחזוקה:</strong>
                <p>נהל את כל פרטי התחזוקה של הבניין, כולל תקלות, פניות לספקים ודיווחים מהדיירים.</p>
              </li>
              <li>
                <strong>תקשורת עם הדיירים:</strong>
                <p>השתמש בפלטפורמה לשליחת הודעות ועדכונים לדיירים בצורה מהירה ומרוכזת.</p>
              </li>
            </ol>
            <p><strong>טיפ:</strong> הקפד לעדכן את פרטי החשבון שלך ואת נתוני הבניין כדי להבטיח שהמידע תמיד יהיה עדכני.</p>
            <p>במידה ונתקלת בבעיות או שאלות, ניתן לפנות לתמיכה דרך עמוד <strong>"צור קשר"</strong>.</p>
            <div className="p-field-checkbox mt-3">
              <label>
                <input
                  type="checkbox"
                  checked={approvedInstructions}
                  onChange={(e) => setApprovedInstructions(e.target.checked)}
                />{" "}
                קראתי ואני מאשר את תנאי ההרשמה
              </label>
            </div>
            {!approvedInstructions && (
              <Message severity="warn" text="יש לאשר את התנאים כדי להמשיך." />
            )}
          </div>
        );
      case 1:
        return <RegisterBuilding onSuccess={handleBuildingSuccess} />;
      case 2:
        return (
          <RegisterPage houseNum={buildingData.apartmentsNull} is_admin={true} header={"רישום ועד בית"} onSuccess={nextStep} />
        );
      case 3:
        return submitted ? (
          <Message severity="success" text="ההרשמה הושלמה בהצלחה!" />
        ) : (
          <div>
            <div className="dialog-copy-container">
              <p className="dialog-copy-label">קוד הבניין שלך לכניסת דיירים חדשים:</p>
              <div className="dialog-copy-row" style={{textAlign:'center'}}>
                <Button
                  icon="pi pi-copy"
                  severity="info"
                  rounded
                  text
                  className="dialog-copy-btn"
                  onClick={copyToClipboard}
                />
                <span className="dialog-copy-code">{buildingData.building?.password}</span>
                <br/>
                <PdfFormGenerator building={buildingData.building}/>
              </div>
              <br /><br /><br />
              
              <Button
                label="מעבר לאתר"
                onClick={() => navigate('/apartment')}
                className="w-12rem"
                icon="pi pi-angle-double-left"
                iconPos="right"
                style={{float:'left'}}
              />
              <br/>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="stepper-container p-4">
      <Steps model={steps} activeIndex={activeIndex} />
      <Card className="mt-4">{renderStepContent()}</Card>

      <div className="stepper-buttons mt-4">
        {activeIndex > 0 && activeIndex < 2 ? (
          <Button
            label="הקודם"
            icon="pi pi-angle-right"
            onClick={prevStep}
            className="p-button-secondary"
          />
        ) : (
          <span /> 
        )}

        {activeIndex === 0 ? (
          <Button
            label="הבא"
            icon="pi pi-angle-left"
            iconPos="right"
            onClick={nextStep}
            className="p-button-primary"
            disabled={!canProceed()}
          />
        ) : (
          <span />
        )}
      </div>


    </div>
  );
};

export default StepperRegistration;
