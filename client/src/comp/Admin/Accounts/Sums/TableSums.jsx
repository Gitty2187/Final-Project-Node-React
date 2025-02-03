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
import AddSums from "./AddSums"
import { MultiSelect } from 'primereact/multiselect';

const Table = () => {
    const [sums, setSums] = useState([]);
    const [selectedYear, setSelectedYear] = useState((new Date()).getFullYear());
    const [visible, setVisible] = useState(false);
    const [unique_years_to_filter, set_unique_years_to_filter] = useState([]);
    const [unique_by_to_filter, set_unique_by_to_filter] = useState([]);
    const [filteredSums, set_filteredSums] = useState([]);
    const apartment = useSelector((myStore) => myStore.apartmentDetails.apartment);
    const building = useSelector((myStore) => myStore.buildingDetails.building)
    const [selectedBy, setSelectedBy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        date: { value: null, matchMode: FilterMatchMode.EQUALS },
        comment: { value: null, matchMode: FilterMatchMode.EQUALS },
        sum: { value: null, matchMode: FilterMatchMode.EQUALS },
        date: { value: null, matchMode: FilterMatchMode.EQUALS }
    });

    const getSums = async () => {
        try {
            const res = await axios.get('http://localhost:7000/apartment_sum?building_id=' + building._id);
            console.log(res.data.all);

            const updatedSums = res.data.all.map((a) => {
                const updateDay = new Date(a.date);
                return {
                    ...a,
                    date: `${updateDay.getDate()}/${updateDay.getMonth() + 1}/${updateDay.getFullYear()}`
                };
            });

            setSums(updatedSums);

        } catch (e) {
            console.log(e)
        }
    };

    useEffect(() => {
        getSums();
        setLoading(false);
    }, [])

    useEffect(() => {
        const filtered = sums.filter(sum => {
            const exYear = new Date(sum.date.split('/').reverse().join('/')).getFullYear();
            const matchesYear = exYear === selectedYear;
            const matchesAdmin = selectedBy ? sum.admin_last_name === selectedBy : true;
        
            return matchesYear && matchesAdmin;
        });


        set_filteredSums(filtered);

        const uniqueYears = [...new Set(sums.map((ex) => new Date(ex.date).getFullYear()))].sort();
        set_unique_years_to_filter(uniqueYears);
        const uniqueBy = [...new Set(sums.map((ex) => ex.admin_last_name))].sort();
        set_unique_by_to_filter(uniqueBy);
    }, [sums, selectedYear, selectedBy]);

    const sumTotal = () => {
        return filteredSums.reduce((total, sums) => total + sums.sum, 0)
    };

    const footerGroup = (
        <ColumnGroup>
            <Row>
                <Column footer="סך כל התשלומים:" colSpan={4} footerStyle={{ textAlign: 'right' }} />
                <Column footer={sumTotal()} footerStyle={{ textAlign: 'right' }} />
            </Row>
        </ColumnGroup>
    );

    const dateFilterElement = () => {
        return (
        <Dropdown 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.value)} 
            options={unique_years_to_filter.map(year => ({ label: year, value: year }))}
            editable 
            placeholder="שנה" 
            className="p-column-filter" 
            style={{ width: '12', direction: 'rtl' }} 
            emptyMessage="אין נתונים נוספים " />)
    }


    const adminLastNameFilter = (options) => {
        return (
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
                <AccordionTab header="טבלת תשלומים לבנין">
                    <DataTable value={filteredSums} tableStyle={{ maxWidth: '50rem', direction: "rtl" }} footerColumnGroup={footerGroup}
                        dataKey="id" filters={filters} filterDisplay="row" loading={loading} emptyMessage="אין נתונים זמינים להציג">
                        <Column style={{ textAlign: "right", minWidth: '12rem', width: "6rem" }} field="date" header="תאריך"
                            showFilterMenu={false} filter filterElement={dateFilterElement} ></Column>
                        <Column style={{ textAlign: "right" }} field="type" header="סוג"></Column>
                        <Column style={{ textAlign: "right" }} field="comment" header="הערה"></Column>
                        <Column style={{ textAlign: "right", minWidth: '12rem', width: "6rem" }} field="admin_last_name" header="בוצע על ידי"
                            showFilterMenu={false} filter filterElement={adminLastNameFilter} ></Column>
                        <Column style={{ textAlign: "right" }} field="sum" header="סכום"></Column>
                    </DataTable>
                </AccordionTab>
            </Accordion>
            <br />

            {apartment.is_admin && <Button label="הוספת תשלום לכל הדיירים" rounded style={{ marginLeft: '15px' }} icon="pi pi-plus" onClick={() => { setVisible(true) }} />}
            {visible && <AddSums visible={visible} setVisible={setVisible} setSums={setSums} />}
        </>
    );
};

export default Table;
