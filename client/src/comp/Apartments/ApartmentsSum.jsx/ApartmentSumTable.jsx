import axios from "axios";
import { Column } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { DataTable } from "primereact/datatable";
import { Dropdown } from "primereact/dropdown";
import { Row } from "primereact/row";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ToastService from "../../Toast/ToastService";
import { FilterMatchMode } from "primereact/api";

const ApartmentSumTable = () => {
    const [sums, setsums] = useState([]);
    const [selectedYear, setSelectedYear] = useState((new Date()).getFullYear());
    const [unique_years_to_filter, set_unique_years_to_filter] = useState([]);
    const [unique_by_to_filter, set_unique_by_to_filter] = useState([]);
    const [filteredsums, set_filteredsums] = useState([]);
    const ACCESS_TOKEN = useSelector((myStore) => myStore.token.token);
    const [selectedBy, setSelectedBy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        date: { value: null, matchMode: FilterMatchMode.EQUALS },
        comment: { value: null, matchMode: FilterMatchMode.EQUALS },
        sum: { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const getsums = async () => {
        try {
            const res = await axios.get('http://localhost:7000/apartment_sum/getById', {
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                }
            });
            if (res.status == 200) {
                const updatedsums = res.data.map((a) => {
                    const updateDay = new Date(a.paymentDetails.date);
                    return {
                        ...a,
                        paymentDetails: {
                            ...a.paymentDetails,
                            date: `${updateDay.getDate()}/${updateDay.getMonth() + 1}/${updateDay.getFullYear()}`
                        }
                    };
                });

                setsums(updatedsums);
            }
        } catch (e) {
            console.log(e);
            ToastService.show('error', 'שגיאה', 'נכשל בהבאת התשלומים', 3000);
        }
    };

    useEffect(() => {
        getsums();
        setLoading(false);
    }, []);

    useEffect(() => {
        const uniqueYears = [...new Set(sums.map((ex) => {
            const parts = ex.paymentDetails.date.split('/');
            const year = parseInt(parts[2], 10);
            return year;
        }))].sort();

        set_unique_years_to_filter(uniqueYears);

        const uniqueBy = [...new Set(sums.map((ex) => ex.paymentDetails.admin_last_name))];
        set_unique_by_to_filter(uniqueBy);
        console.log(sums);
        
        const filtered = sums.filter(expense => {
            const exYear = new Date(expense.paymentDetails.date.split('/').reverse().join('/')).getFullYear();
            const matchesYear = exYear === selectedYear;
            console.log(expense.paymentDetails.admin_last_name +" "+selectedBy);
            
            const matchesAdmin = selectedBy ? expense.paymentDetails.admin_last_name === selectedBy : true;

            return matchesYear && matchesAdmin;
        });

        set_filteredsums(filtered);

    }, [sums, selectedYear, selectedBy]);

    const calculateRemainingAmount = (totalSum, amountPaid) => {
        return totalSum - amountPaid;
    };

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer=" סכום שנותר לתשלום לשנה זו:" colSpan={4} footerStyle={{ textAlign: 'right' }} />
                <Column footer={filteredsums.reduce((total, sums) => total + calculateRemainingAmount(sums.paymentDetails.sum, sums.amountPaid), 0)} footerStyle={{ textAlign: 'right' }} />
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

    return (
        <>
            <div style={{ overflowX: 'auto' }}>
                <DataTable value={filteredsums} tableStyle={{ direction: "rtl", overflowX: 'auto' }} footerColumnGroup={footerGroup}
                    dataKey="id" filters={filters} filterDisplay="row" loading={loading} emptyMessage="אין נתונים נוספים "
                    virtualScrollerOptions={{ itemSize: 10 }} >
                    <Column style={{ textAlign: "right", width: "16rem" }} field="paymentDetails.date" header="תאריך"
                        showFilterMenu={false} filter filterElement={dateFilterElement}></Column>
                    <Column style={{ textAlign: "right", width: "16rem" }} field="paymentDetails.type" header="עבור"></Column>
                    <Column style={{ textAlign: "right", width: "16rem" }} field="paymentDetails.admin_last_name" header="בוצע על ידי"
                        showFilterMenu={false} filter filterElement={adminLastNameFilter} showClear></Column>
                    <Column
                        style={{ textAlign: "right", width: "16rem" }}
                        field="paymentDetails.sum"
                        header="סכום"
                        body={(rowData) => `${rowData.paymentDetails.sum} ש"ח`}
                    />
                    <Column style={{ textAlign: "right", width: "16rem" }} header=" סכום הנותר לתשלום"
                        body={(rowData) => {
                            const remainingAmount = calculateRemainingAmount(rowData.paymentDetails.sum, rowData.amountPaid);
                            return (
                                <span style={{ color: remainingAmount > 0 ? 'red' : 'green' }}>
                                    {remainingAmount} ש"ח
                                </span>
                            );
                        }}>
                    </Column>
                    <Column style={{ textAlign: "right", width: "16rem" }} field="paymentDetails.comment" header="הערה"></Column>

                </DataTable>
            </div>
            <br />
        </>
    );
};

export default ApartmentSumTable;
