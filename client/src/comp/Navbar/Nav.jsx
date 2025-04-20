import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ResidentUpdateForm from './ResidentUpdateForm';
import { updateApartment } from '../../Store/ApartmentSlice';
import { updateAllApar } from '../../Store/AllApartment';
import { setToken } from '../../Store/Token';
import { updateBuild } from '../../Store/BuildingSlice';

const Navbar = () => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const apartment = useSelector((myStore) => myStore.apartmentDetails.apartment);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const rightMenu = [
        {
            label: 'לוח מודעות',
            icon: 'pi pi-comments',
            command: () => navigate('/bulletin')
        },
        {
            label: 'דף הבית',
            icon: 'pi pi-home',
            command: () => navigate('/apartment')
        },
        apartment?.is_admin && {
            label: 'ניהול',
            icon: 'pi pi-cog',
            items: [
                {
                    label: 'ניהול הוצאות לבניין',
                    icon: 'pi pi-wallet',
                    command: () => navigate('/manager/expenses')
                },
                {
                    label: 'ניהול דיירים לבניין',
                    icon: 'pi pi-users',
                    command: () => navigate('/manager/apartments')
                }
            ]
        }
    ];

    const start = (
        <Button
            icon="pi pi-bars"
            className="p-button-text"
            onClick={() => setSidebarVisible(true)}
        />
    );

    const handleUpdateSubmit = (data) => {

        setEditDialogVisible(false);

    };

    return (
        <>
            <Menubar model={rightMenu} start={start} className="justify-content-between" />

            <Sidebar visible={sidebarVisible} position="left" onHide={() => setSidebarVisible(false)}>
                <h3>תפריט משתמש</h3>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    <li>
                        <Button
                            label="עדכון פרטי דייר"
                            icon="pi pi-user-edit"
                            className="p-button-text p-mb-2"
                            onClick={() => setEditDialogVisible(true)}
                        />
                    </li>
                    <li>
                        <Button
                            label="יציאה"
                            icon="pi pi-sign-out"
                            className="p-button-text"
                            onClick={() => {
                                dispatch(updateApartment({}));
                                // dispatch(setToken(null));
                                // dispatch(updateAllApar([]));
                                // dispatch(updateBuild({}));
                                localStorage.clear();
                                navigate('/login')
                            }
                            }
                        />
                    </li>
                </ul>
            </Sidebar>

            <ResidentUpdateForm
                visible={editDialogVisible}
                onHide={() => setEditDialogVisible(false)}
                onSubmit={handleUpdateSubmit}
                defaultValues={{
                    last_name: apartment?.last_name || '',
                    area: apartment?.area || 0,
                    floor: apartment?.floor || 0,
                    entrance: apartment?.entrance || ''
                }}
            />
        </>
    );
};

export default Navbar;
