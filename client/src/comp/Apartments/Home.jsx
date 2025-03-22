import TableExpenses from "../Admin/Accounts/Expenses/TableExpenses"
import Nav from '../Nav';
import { ScrollPanel } from 'primereact/scrollpanel';
import TablePayments from "./Payments/TablePayments";
import ApartmentSumTable from "./ApartmentsSum.jsx/ApartmentSumTable";

const Home = () => {
    return (<>
        <Nav />
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