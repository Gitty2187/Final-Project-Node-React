import React from 'react'; 
import { Menubar } from 'primereact/menubar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Nav =()=>{
    const navigate = useNavigate();
    const apartment = useSelector((myStore) => myStore.apartmentDetails.apartment)

    const items = [
        {
            label: ' בית',
            icon: 'pi pi-home',
            command: () => navigate('/apartment')
        },
        apartment.is_admin &&
        {
            label: ' ועד בית',
            icon: 'pi pi-id-card',
            items: [
                {
                    label: ' הוצאות',
                    icon: 'pi pi-calculator',
                    command: () => {navigate('/manager/expenses')}
                },
                {
                    label: '  ניהול דיירים ',
                    icon: 'pi pi-users',
                    command: () => {navigate('/manager')}
                },
            ]
        }
    ];

    return (
        <div className="card" style={{padding:0, direction:"rtl"}}>
            <Menubar model={items}/>
        </div>
    )
}

export default Nav