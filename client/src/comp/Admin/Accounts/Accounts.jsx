
import Nav from '../../Nav';
import TableExpenses from './Expenses/TableExpenses';
import TableSums from './Sums/TableSums';
import { ScrollPanel } from 'primereact/scrollpanel';


const Account = () => {
    
    return (<>
    <Nav/>
        <div className="card scrollpanel-demo">
            <div className="flex flex-column md:flex-row gap-5">
                <div className="flex-auto">
                    <ScrollPanel style={{ width: '50rem'}} className="custombar1">
                        <TableSums />
                    </ScrollPanel>
                </div>
                <div className="flex-auto">
                    <ScrollPanel style={{ width: '50rem'}} className="custombar2">
                        <TableExpenses />
                    </ScrollPanel>
                </div>
            </div>
        </div>
    </>)
}

export default Account