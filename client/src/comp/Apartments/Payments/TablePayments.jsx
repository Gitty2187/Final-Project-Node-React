import { useEffect, useState } from "react";
import axios from 'axios';
import { useSelector } from "react-redux";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Dropdown } from 'primereact/dropdown';
import { FilterMatchMode } from 'primereact/api';
import ToastService from "../../Toast/ToastService";



const TablePayments = () => {
    const [payments, setpayments] = useState([]);
    const [selectedYear, setSelectedYear] = useState((new Date()).getFullYear());
    const [unique_years_to_filter, set_unique_years_to_filter] = useState([]);
    const [unique_by_to_filter, set_unique_by_to_filter] = useState([]);
    const [filteredPayments, set_filteredPayments] = useState([]);
    const ACCESS_TOKEN = useSelector((myStore) => myStore.token.token);
    const [selectedBy, setSelectedBy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        date: { value: null, matchMode: FilterMatchMode.EQUALS },
        comment: { value: null, matchMode: FilterMatchMode.EQUALS },
        sum: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const getPayments = async () => {
        try {
            const res = await axios.get('http://localhost:7000/payments', {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                }
            });

            const updatedPayments = res.data.map((a) => {
                const updateDay = new Date(a.date);
                return {
                    ...a,
                    date: `${updateDay.getDate()}/${updateDay.getMonth() + 1}/${updateDay.getFullYear()}`
                };
            });

            setpayments(updatedPayments);
        } catch (e) {
            console.log(e);
            ToastService.show('error', 'שגיאה', 'נכשל בהבאת התשלומים', 3000);
        }
    };

    useEffect(() => {
        getPayments();
        setLoading(false);
    }, []);

    useEffect(() => {
        const uniqueYears = [...new Set(payments.map((ex) => {
            const parts = ex.date.split('/');
            const year = parseInt(parts[2], 10);
            return year;
        }))].sort();
        set_unique_years_to_filter(uniqueYears);

        const uniqueBy = [...new Set(payments.map((ex) => ex.admin_last_name))];
        set_unique_by_to_filter(uniqueBy);

        const filtered = payments.filter(expense => {
            const exYear = new Date(expense.date.split('/').reverse().join('/')).getFullYear();
            const matchesYear = exYear === selectedYear;
            const matchesAdmin = selectedBy ? expense.admin_last_name === selectedBy : true;

            return matchesYear && matchesAdmin;
        });

        set_filteredPayments(filtered);
    }, [payments, selectedYear, selectedBy]);

    const sumTotal = () => {
        return filteredPayments.reduce((total, expense) => total + expense.sum, 0);
    };

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer="סך כל התשלומים:" colSpan={3} footerStyle={{ textAlign: 'right' }} />
                <Column footer={sumTotal()} footerStyle={{ textAlign: 'right' }} />
            </Row>
        </ColumnGroup>
    );

    const dateFilterElement = () => {
        return (<Dropdown value={selectedYear} emptyMessage="אין נתונים נוספים "
            onChange={(e) => setSelectedYear(e.value)} options={unique_years_to_filter.map(year => ({ label: year, value: year }))}
            editable placeholder="שנה" className="p-column-filter" style={{ width: '12' }} />)
    }

    const adminLastNameFilter = () => {
        return (
            <Dropdown
                value={selectedBy}
                options={unique_by_to_filter.map(by => ({ label: by, value: by }))}
                onChange={(e) => { setSelectedBy(e.value) }}
                placeholder="בחר"
                className="p-column-filter"
                showClear
                emptyMessage="אין נתונים להצגה"
            />
        );
    };

    const items = [
        { label: <span style={{ margin: '0.5rem' }}><i className="pi pi-table"></i> טבלה</span> },
        { label: <span style={{ margin: '0.5rem' }}><i className="pi pi-chart-line"></i> דיאגרמה</span> }
    ];

    return (
        <>
            <div>

                <DataTable value={filteredPayments} tableStyle={{ direction: "rtl" }} footerColumnGroup={footerGroup}
                    dataKey="id" filters={filters} filterDisplay="row" loading={loading} emptyMessage="אין נתונים נוספים "
                    virtualScrollerOptions={{ itemSize: 10 }} >
                    <Column style={{ textAlign: "right", width: "16rem" }} field="date" header="תאריך"
                        showFilterMenu={false} filter filterElement={dateFilterElement}></Column>
                    <Column style={{ textAlign: "right", width: "16rem" }} field="payment_method" header="אופן התשלום"></Column>
                    <Column style={{ textAlign: "right", width: "16rem" }} field="admin_last_name" header="בוצע על ידי"
                        showFilterMenu={false} filter filterElement={adminLastNameFilter} showClear></Column>
                    <Column
                        style={{ textAlign: "right", width: "16rem" }}
                        field="sum"
                        header="סכום"
                        body={(rowData) => `${rowData.sum} ש"ח`}
                    />
                    <Column style={{ textAlign: "right", width: "16rem" }} field="comment" header="הערה"></Column>

                </DataTable>
            </div>
            <br />
        </>
    );
};

export default TablePayments;
