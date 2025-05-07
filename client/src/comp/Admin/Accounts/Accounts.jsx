import Nav from '../../Navbar/Nav';
import TableExpenses from './Expenses/TableExpenses';
import TableSums from './Sums/TableSums';
import './Accounts.css'
import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';

const Account = () => {
    const building = useSelector((store) => store.buildingDetails.building);

    return (
        <>
            <Nav />
            <div className="card scrollpanel-demo">
                <Button
                    className={`custom-balance-button ${building?.balance < 0 ? 'negative' : 'positive'}`}
                    style={{
                        width: '100%',
                        marginBottom: '2rem',
                        height: '3rem',
                        fontSize: '1.5rem',
                        fontFamily: 'inherit',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <span>
                        {building?.balance < 0 ? '❌ חוב' : '✅ יתרה'}: {building?.balance} ₪
                    </span>
                </Button>



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