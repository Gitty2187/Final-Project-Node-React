import React, { useState, useRef, useEffect } from 'react';
import { Menubar } from 'primereact/menubar';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ResidentUpdateForm from './ResidentUpdateForm';
import { updateApartment } from '../../Store/ApartmentSlice';
import './Navbar.css';
import { updateAllApar } from '../../Store/AllApartment';
import { updateBuild } from '../../Store/BuildingSlice';
import { setToken } from '../../Store/Token';
import { Divider } from 'primereact/divider';

const Navbar = () => {
    const [editDialogVisible, setEditDialogVisible] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const apartment = useSelector((state) => state.apartmentDetails.apartment);
    const building = useSelector((store) => store.buildingDetails.building);
    const admin = apartment ? apartment.is_admin : false;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.user-dropdown-container')) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        dispatch(updateApartment(null));
        dispatch(updateAllApar(null));
        dispatch(updateBuild(null));
        dispatch(setToken(null));
        navigate('/login');
    };


    const start = (
        <div className="user-dropdown-container" style={{ position: 'relative' }}>
            <div className="user-avatar-button" onClick={() => setDropdownOpen((prev) => !prev)}>
                <div className="user-icon">
                    <i className="pi pi-sort-down"></i>
                </div>
                <span>{apartment?.last_name || 'משתמש'}</span>
            </div>

            {dropdownOpen && (
                <div className="dropdown-panel">
                    <div className="info-section">
                        {building?.address && (
                            <div className="info-row">
                                <span className="label">בניין:</span>
                                <span className="value">{building.address}</span>
                            </div>
                        )}
                        {apartment?.entrance && (
                            <div className="info-row">
                                <span className="label">כניסה:</span>
                                <span className="value">{apartment.entrance}</span>
                            </div>
                        )}
                        {apartment?.floor && (
                            <div className="info-row">
                                <span className="label">קומה:</span>
                                <span className="value">{apartment.floor}</span>
                            </div>
                        )}
                        {apartment?.number && (
                            <div className="info-row">
                                <span className="label">דירה:</span>
                                <span className="value">{apartment.number}</span>
                            </div>
                        )}

                    </div>

                    <Divider className="custom-divider" />

                    <div className="actions">
                        <button onClick={() => { setEditDialogVisible(true); setDropdownOpen(false); }} className="action-button">
                            <i className="pi pi-user-edit"></i> עדכון פרטי דייר
                        </button>
                        <button onClick={handleLogout} className="action-button logout">
                            <i className="pi pi-sign-out"></i> יציאה
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

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
        {
            label: 'צור קשר',
            icon: 'pi pi-comments',
            command: () => navigate('/Contact-us'),
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

    return (
        <div style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
            <Menubar model={rightMenu} start={start} className="custom-navbar" style={{ height: '5rem' }} />
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
