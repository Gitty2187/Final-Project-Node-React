import { useEffect, useState } from "react"
import axios from 'axios'
import { useSelector } from "react-redux";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Dropdown } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import AddExpenses from "./AddExpenses"
import { MultiSelect } from "primereact/multiselect";


const Table = () => {
    const [expenses, setExpenses] = useState([]);
    const [selectedYear, setSelectedYear] = useState((new Date()).getFullYear());
    const [visible, setVisible] = useState(false);
    const [unique_years_to_filter, set_unique_years_to_filter] = useState([]);
    const [unique_by_to_filter, set_unique_by_to_filter] = useState([]);
    const [filteredExpenses, set_filteredExpenses] = useState([]);
    const apartment = useSelector((myStore) => myStore.apartmentDetails.apartment);
    const [selectedBy, setSelectedBy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        date: { value: null, matchMode: FilterMatchMode.EQUALS },
        comment: { value: null, matchMode: FilterMatchMode.EQUALS },
        sum: { value: null, matchMode: FilterMatchMode.EQUALS },
        date: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    const getExpenses = async () => {
        try {
            const res = await axios.get('http://localhost:7000/expenses?id='+apartment.building_id);

            const updatedExpenses = res.data.map((a) => {
                const updateDay = new Date(a.date);
                return {
                    ...a,
                    date: `${updateDay.getDate()}/${updateDay.getMonth() + 1}/${updateDay.getFullYear()}`
                };
            });

            setExpenses(updatedExpenses);
            // const uniqueYears = [...new Set(res.data.map((ex) => new Date(ex.date).getFullYear()))].sort();
            // set_unique_years_to_filter(uniqueYears);
            // const uniqueBy = [...new Set(res.data.map((ex) => ex.admin_last_name))].sort();
            // set_unique_by_to_filter(uniqueBy);
        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        getExpenses();
        setLoading(false);
    }, [])

    useEffect(() => {
        const filtered = expenses.filter(expense => {
            const exYear = new Date(expense.date.split('/').reverse().join('/')).getFullYear();
            const matchesYear = exYear === selectedYear;
            const matchesAdmin = selectedBy ? expense.admin_last_name === selectedBy : true;
        
            return matchesYear && matchesAdmin;
        });


        set_filteredExpenses(filtered);

        const uniqueYears = [...new Set(expenses.map((ex) => new Date(ex.date).getFullYear()))].sort();
        set_unique_years_to_filter(uniqueYears);

        const uniqueBy = [...new Set(expenses.map((ex) => ex.admin_last_name))].sort();
        set_unique_by_to_filter(uniqueBy);

    }, [expenses, selectedYear, selectedBy]);

    const sumTotal = () => {
        return filteredExpenses.reduce((total, expense) => total + expense.sum, 0)
    };

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer="סך כל ההוצאות:" colSpan={4} footerStyle={{ textAlign: 'right' }} />
                <Column footer={sumTotal()} footerStyle={{ textAlign: 'right' }} />
            </Row>
        </ColumnGroup>
    );

    const dateFilterElement = () => {
        return (<Dropdown value={selectedYear} emptyMessage="אין נתונים נוספים "
            onChange={(e) => setSelectedYear(e.value)} options={unique_years_to_filter.map(year => ({ label: year, value: year }))}
             editable placeholder="שנה" className="p-column-filter" style={{ width:'12' }} />)
    }

    const adminLastNameFilter = (options) => {
            return (
                // <MultiSelect
                //     value={selectedBy}
                //     options={unique_by_to_filter.map(by => ({ label: by, value: by }))}
                //     onChange={(e) => setSelectedBy(e.value)}
                //     placeholder="בחר"
                //     className="p-column-filter"
                //     maxSelectedLabels={1}
                //     style={{width:'10rem' }}
                //     display="chip"
                // />
                <Dropdown 
                    value={selectedBy} 
                    options={unique_by_to_filter.map(by => ({ label: by, value: by }))} 
                    onChange={(e) => {setSelectedBy(e.value)} }
                    placeholder="בחר" 
                    className="p-column-filter" 
                    showClear 
                    style={{ width: '10rem'}} />
            );
        };


    return (
        <>
            <Accordion activeIndex={0} style={{ textAlign: "right" }}>
                <AccordionTab header="טבלת הוצאות לבנין">
                    <DataTable value={filteredExpenses} tableStyle={{ maxWidth: '50rem', direction: "rtl" }} footerColumnGroup={footerGroup}
                     dataKey="id" filters={filters} filterDisplay="row" loading={loading} emptyMessage="אין נתונים נוספים "
                     scrollable scrollHeight="400px" virtualScrollerOptions={{ itemSize: 10}} >
                        <Column style={{ textAlign: "right" , minWidth: '12rem',width:"6rem"}} field="date" header="תאריך"
                         showFilterMenu={false} filter filterElement={dateFilterElement} ></Column>
                        <Column style={{ textAlign: "right" }} field="type" header="סוג"></Column>
                        <Column style={{ textAlign: "right" }} field="comment" header="הערה"></Column>
                        <Column style={{ textAlign: "right" , minWidth: '12rem',width:"6rem"}} field="admin_last_name" header="בוצע על ידי"
                        showFilterMenu={false} filter filterElement={adminLastNameFilter} showClear></Column>
                        <Column style={{ textAlign: "right" }} field="sum" header="סכום"></Column>
                    </DataTable>
                </AccordionTab>
            </Accordion>
            <br />

            {apartment.is_admin && <Button label="הוספת הוצאה" rounded style={{ marginLeft: '15px' }} icon="pi pi-plus" onClick={() => { setVisible(true) }} />}
            {visible && <AddExpenses visible={visible} setVisible={setVisible} setExpenses={setExpenses} />}
        </>
    );
};

export default Table;
