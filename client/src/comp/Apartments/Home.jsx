import TableExpenses from "../Admin/Accounts/Expenses/TableExpenses"
import Nav from '../Nav';
import { ScrollPanel } from 'primereact/scrollpanel';
import TablePayments from "./Payments/TablePayments";

const Home = () => {
    return (<>
        <Nav />
        <div className="card scrollpanel-demo">
            <div className="flex flex-column md:flex-row gap-5">
                <div className="flex-auto">
                    <ScrollPanel style={{ width: '50rem' }} className="custombar1">
                        <ScrollPanel style={{ width: '50rem' }} className="custombar2">
                            <TableExpenses />
                        </ScrollPanel>
                        <ScrollPanel style={{ width: '50rem' }} className="custombar2">
                            <TablePayments />
                        </ScrollPanel>
                    </ScrollPanel>
                </div>
                <div className="flex-auto">
                    <ScrollPanel style={{ width: '50rem' }} className="custombar2">
                        <TablePayments />
                    </ScrollPanel>
                </div>
            </div>
        </div>
    </>)
}

export default Home