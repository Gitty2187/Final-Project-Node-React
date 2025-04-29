import React, { useState, useRef } from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ResidentUpdateForm from './ResidentUpdateForm';
import { updateApartment } from '../../Store/ApartmentSlice';
import './Navbar.css';
import { updateAllApar } from '../../Store/AllApartment';
import { updateBuild } from '../../Store/BuildingSlice';
import { setToken } from '../../Store/Token';

const Navbar = () => {
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const menuRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const apartment = useSelector((state) => state.apartmentDetails.apartment);
    const admin = apartment ? apartment.is_admin : false;
    const userMenu = [
        {
            label: 'עדכון פרטי דייר',
            icon: 'pi pi-user-edit',
            command: () => setEditDialogVisible(true),
        },
        {
            label: 'יציאה',
            icon: 'pi pi-sign-out',
            command: () => {
                // window.location.href = "/login"
                dispatch(updateApartment(null));
                dispatch(updateAllApar(null));
                dispatch(updateBuild(null));
                dispatch(setToken(null));
                navigate('/login');
                
            },
        },
    ];
    
    const rightMenu = [
        {
            label: 'לוח מודעות',
            icon: 'pi pi-comments',
            command: () => navigate('/apartment/bulletin'),
        },
        {
            label: 'דף הבית',
            icon: 'pi pi-home',
            command: () => navigate('/apartment'),
        },
        
        admin && {
            label: 'ניהול',
            icon: 'pi pi-cog',
            items: [
                {
                    label: 'ניהול הוצאות לבניין',
                    icon: 'pi pi-wallet',
                    command: () => navigate('/manager/expenses'),
                },
                {
                    label: 'ניהול דיירים לבניין',
                    icon: 'pi pi-users',
                    command: () => navigate('/manager/apartments'),
                },
            ],
        },
    ];

    const start = (
        <>
            <div className="user-avatar-button" onClick={(e) => menuRef.current.toggle(e)}>
                <div className="user-icon">
                    <i className="pi pi-user"></i>
                </div>
                <span>{apartment?.last_name || 'משתמש'}</span>
            </div>
            <Menu model={userMenu} popup ref={menuRef} id="popup_menu" />
        </>
    );

    return (
        <div style={{marginBottom:'1.5rem',marginTop:'1.5rem'}}>
            <Menubar model={rightMenu} start={start} className="custom-navbar" style={{height:'5rem'}}/>
            <ResidentUpdateForm
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                onSubmit={() => setEditDialogVisible(false)}
                defaultValues={{
                    last_name: apartment?.last_name || '',
                    area: apartment?.area || 0,
                    floor: apartment?.floor || 0,
                    entrance: apartment?.entrance || '',
                }}
            />
        </div>
    );
};

export default Navbar;
