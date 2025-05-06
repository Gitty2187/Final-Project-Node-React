import TableExpenses from "../Admin/Accounts/Expenses/TableExpenses"
import Nav from '../Navbar/Nav';
import TablePayments from "./Payments/TablePayments";
import ApartmentSumTable from "./ApartmentsSum.jsx/ApartmentSumTable";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useSelector } from "react-redux";


const Home = () => {
    const apartment = useSelector((myStore) => myStore.apartmentDetails.apartment);

    return (<>
        <Nav />
        <div className="card scrollpanel-demo">
            <Accordion multiple activeIndex={[0]}>
                <AccordionTab header={`פירוט חיובים - סכום הנותר לתשלום: ${apartment?.debt} ש"ח`}>
                    <div className="m-0">
                        <ApartmentSumTable />
                    </div>
                </AccordionTab>
                <AccordionTab header="תשלומים לוועד">
                    <div className="m-0">
                        <TablePayments />
                    </div>
                </AccordionTab>
                <AccordionTab header="רישום הוצאות">
                    <div className="m-0">
                        <TableExpenses />
                    </div>
                </AccordionTab>
            </Accordion>
        </div>
    </>)
}

export default Home
