import React from 'react';

// נוודא שמייבאים את ה־pdfMake שנמצא ב-CDN
const PdfFormGenerator = () => {
  const generatePdf = () => {
    const docDefinition = {
      content: [
        { text: 'טופס פתיחת בניין', style: 'header', alignment: 'right' },
        { text: 'שם הבניין: מגדל התקווה', alignment: 'right' },
        { text: 'כתובת: רחוב התקווה 5, תל אביב', alignment: 'right' },
        { text: 'שם הנציג: יעקב לוי', alignment: 'right' },
        { text: 'תאריך פתיחה: 23/04/2025', alignment: 'right' },
        {
          text: '\nהצהרה:\nאני מאשר/ת את פתיחת הבניין ומתחייב/ת לפעול לפי הנהלים.',
          alignment: 'right'
        }
      ],
      defaultStyle: {
        alignment: 'right',
        font: 'Assistant' // שמנו את הפונט עברי כאן
      },
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          marginBottom: 10
        }
      },
      pageSize: 'A4'
    };

    window.pdfMake.createPdf(docDefinition).download('טופס_פתיחת_בניין.pdf');
  };

  return (
    <div style={{ direction: 'rtl', textAlign: 'right', marginTop: '2rem' }}>
      <button onClick={generatePdf} style={{ padding: '10px 20px', fontSize: '16px' }}>
        הורד טופס PDF
      </button>
    </div>
  );
};

export default PdfFormGenerator;
