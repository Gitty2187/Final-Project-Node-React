import TableExpenses from "../Admin/Accounts/Expenses/TableExpenses"
import Nav from '../Nav';
import { ScrollPanel } from 'primereact/scrollpanel';

const Home = () =>{
    return(<>
        <Nav/>
        <div className="card scrollpanel-demo">
            <div className="flex flex-column md:flex-row gap-5">
                <div className="flex-auto">
                    <ScrollPanel style={{ width: '100%'}} className="custombar1">
                        <TableExpenses />
                    </ScrollPanel>
                </div>
                <div className="flex-auto">
                    <ScrollPanel style={{ width: '100%'}} className="custombar2">
                    </ScrollPanel>
                </div>
            </div>
        </div>
    </>)
}

export default Home