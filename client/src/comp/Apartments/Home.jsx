import TableExpenses from "../Admin/Accounts/Expenses/TableExpenses"
 import Nav from '../Navbar/Nav';
import { ScrollPanel } from 'primereact/scrollpanel';
import TablePayments from "./Payments/TablePayments";
import ApartmentSumTable from "./ApartmentsSum.jsx/ApartmentSumTable";

const Home = () => {
    return (<>
        <Nav/>
        <div className="card scrollpanel-demo">
            <div className="flex flex-column md:flex-row gap-5">
                <div className="flex-auto">
                    <ScrollPanel style={{ width: '50rem' }} className="custombar1">
                        <div className="flex flex-column md:flex-row gap-5">
                            <div className="flex-auto">
                                <ScrollPanel style={{ width: '25rem' }} className="custombar1">
                                    <TableExpenses />
                                </ScrollPanel>
                            </div>
                            <div className="flex-auto">
                                <ScrollPanel style={{ width: '25rem' }} className="custombar2">
                                    <TablePayments />
                                </ScrollPanel>
                            </div>
                        </div>
                    </ScrollPanel>
                </div>
                <div className="flex-auto">
                    <ScrollPanel style={{ width: '50rem' }} className="custombar2">
                        <ApartmentSumTable />
                    </ScrollPanel>
                </div>
            </div>
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
