// import React from 'react';
// import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

// // הפעלת הפונטים
// pdfMake.vfs = pdfFonts.pdfMake.vfs;

// const PdfFormGenerator = () => {
//   const generatePdf = () => {
//     const docDefinition = {
//       content: [
        
//         {
//           text: '\nהצהרה:\nאני מאשר/ת את פתיחת הבניין ומתחייב/ת לפעול לפי הנהלים.',
//           alignment: 'right'
//         }
//       ],
//       defaultStyle: {
//         alignment: 'right',
//         font: 'Roboto'
//       },
//       styles: {
//         header: {
//           fontSize: 18,
//           bold: true,
//           marginBottom: 10
//         }
//       },
//       pageSize: 'A4'
//     };

//     window.pdfMake.createPdf(docDefinition).download('טופס_פתיחת_בניין.pdf');
//   };

//   return (
//     <div style={{ direction: 'rtl', textAlign: 'right', marginTop: '2rem' }}>
//       <button onClick={generatePdf} style={{ padding: '10px 20px', fontSize: '16px' }}>
//         הורד טופס PDF
//       </button>
//     </div>
//   );
// };

// export default PdfFormGenerator;