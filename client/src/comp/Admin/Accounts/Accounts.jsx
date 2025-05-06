import Nav from '../../Navbar/Nav';
import TableExpenses from './Expenses/TableExpenses';
import TableSums from './Sums/TableSums';
import './Accounts.css'

const Account = () => {
    return (
        <>
            <Nav />
            <div className="card scrollpanel-demo">
                <div className="flex flex-column md:flex-row gap-5">
                    <div className="table-container">
                        <h2>חיובים</h2>
                        <div className="table-wrapper">
                            <TableSums />
                        </div>
                    </div>
                    <div className="table-container">
                        <h2>הוצאות</h2>
                        <div className="table-wrapper">
                            <TableExpenses />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Account;