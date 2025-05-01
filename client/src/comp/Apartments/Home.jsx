import TableExpenses from "../Admin/Accounts/Expenses/TableExpenses"
 import Nav from '../Navbar/Nav';
import TablePayments from "./Payments/TablePayments";
import ApartmentSumTable from "./ApartmentsSum.jsx/ApartmentSumTable";
import { Accordion, AccordionTab } from 'primereact/accordion';


const Home = () => {
    return (<>
        <Nav/>
        <div className="card scrollpanel-demo">
        <Accordion multiple activeIndex={[0]}>
                <AccordionTab header="תשלומים">
                    <div className="m-0">
                        <ApartmentSumTable/>
                    </div>
                </AccordionTab>
                <AccordionTab header="היסטורית תשלומים">
                    <div className="m-0">
                        <TablePayments/>
                    </div>
                </AccordionTab>
                <AccordionTab header="הוצאות בנין">
                    <div className="m-0">
                        <TableExpenses/>
                    </div>
                </AccordionTab>
            </Accordion>
        </div>
    </>)
}

export default Home
// HomePage.tsx
// Home.tsx
// import React from "react";
// import { Card } from "primereact/card";
// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
// import "primereact/resources/themes/lara-light-indigo/theme.css";
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";
// import "./Home.css";

// const expenses = [
//   { date: "01/03/2025", description: "חשמל", amount: 350 },
//   { date: "05/03/2025", description: "ניקיון", amount: 600 },
//   // ... טבלה יכולה להתארך
// ];

// const paymentsHistory = [
//   { date: "10/03/2025", apartment: "5", amount: 450 },
//   { date: "12/03/2025", apartment: "8", amount: 500 },
// ];

// const paymentsDue = [
//   { apartment: "1", dueDate: "20/04/2025", amount: 450 },
//   { apartment: "3", dueDate: "22/04/2025", amount: 450 },
// ];

// const Home = () => {
//   return (
//     <div className="home-container">
//         <Nav/>
//       <div className="card-grid">
//         <Card title="💡 הוצאות הבניין" className="table-card">
//           <div className="table-wrapper">
//             <DataTable value={expenses} scrollable scrollHeight="300px" stripedRows>
//               <Column field="date" header="תאריך" />
//               <Column field="description" header="תיאור" />
//               <Column field="amount" header="סכום (₪)" />
//             </DataTable>
//           </div>
//         </Card>

//         <Card title="📜 היסטוריית תשלומים" className="table-card">
//           <div className="table-wrapper">
//             <DataTable value={paymentsHistory} scrollable scrollHeight="300px" stripedRows>
//               <Column field="date" header="תאריך" />
//               <Column field="apartment" header="דירה" />
//               <Column field="amount" header="סכום (₪)" />
//             </DataTable>
//           </div>
//         </Card>

//         <Card title="📅 תשלומים צפויים" className="table-card">
//           <div className="table-wrapper">
//             <DataTable value={paymentsDue} scrollable scrollHeight="300px" stripedRows>
//               <Column field="apartment" header="דירה" />
//               <Column field="dueDate" header="תאריך יעד" />
//               <Column field="amount" header="סכום (₪)" />
//             </DataTable>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default Home;
