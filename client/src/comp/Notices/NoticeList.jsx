import { FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { Button, Card, Divider } from 'primereact';
import { FaUserCircle, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AddNotice from './AddNotice';
import EditNotice from './EditNotice';
import DeleteNotice from './DeleteNotice';
import Navbar from '../Navbar/Nav';
import './Board.css';
import PdfFormGenerator from '../Home-page/EntryDocument';

const NoticeList = () => {
    const [notices, setNotices] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [currentNotice, setCurrentNotice] = useState({}); 
    const ACCESS_TOKEN = useSelector((myStore) => myStore.token.token);
    const apartment = useSelector((myStore) => myStore.apartmentDetails.apartment);
    const building = useSelector((store) => store.buildingDetails.building);
    

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get(`http://localhost:7000/notices/`, {
                    headers: {
                        Authorization: `Bearer ${ACCESS_TOKEN}`,
                    },
                });
                setNotices(response.data);
            } catch (error) {
                console.error('Error fetching notices:', error);
            }
        };

        fetchNotices();
    }, [ACCESS_TOKEN]);

    const handleEdit = (notice) => {
        setCurrentNotice(notice);
        setShowEditDialog(true);
    };

    const handleDeleteClick = (notice) => {
        setCurrentNotice(notice);
        setShowDeleteDialog(true)
    };

    return (
        <>
            <Navbar />
            <div className="board-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 className="board-header">לוח מודעות</h1>
                    <Button
                        label="הוסף מודעה"
                        icon={<FaPlusCircle />}
                        className="p-button-success add-notice-btn"
                        style={{
                            borderRadius: '50px',
                            padding: '0.5em 1.5em',
                            fontSize: '1.1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                        }}
                        onClick={() => setShowAddDialog(true)}
                    />
                </div>

                <div className="ads-container">
                    {notices.map((ad) => (
                        <Card key={ad._id} className="ad-card p-shadow-2">
                            <div className="ad-header">
                                <FaUserCircle className="ad-icon" />
                                <span className="ad-publisher">פורסם ע"י: {ad.publisher.last_name}</span>
                                <span className="ad-date">
                                    <FaCalendarAlt /> {new Date(ad.createdAt).toLocaleDateString('he-IL')}
                                </span>
                            </div>
                            <Divider />
                            <h3 className="ad-title">{ad.title}</h3>
                            <p className="ad-content">{ad.content}</p>

                            {ad.publisher._id === apartment?._id && (
                                <div className="ad-actions">
                                    <FaEdit
                                        className="edit-icon"
                                        onClick={() => handleEdit(ad)}
                                    />
                                    <FaTrash
                                        className="delete-icon"
                                        onClick={() => handleDeleteClick(ad)}
                                    />
                                </div>
                            )}
                        </Card>
                    ))}
                </div>

                <AddNotice
                    ACCESS_TOKEN={ACCESS_TOKEN}
                    apartment={apartment}
                    setNotices={setNotices}
                    showAddDialog={showAddDialog}
                    setShowAddDialog={setShowAddDialog}
                />

                <EditNotice
                    ACCESS_TOKEN={ACCESS_TOKEN}
                    apartment={apartment}
                    setNotices={setNotices}
                    showEditDialog={showEditDialog}
                    setShowEditDialog={setShowEditDialog}
                    notice={currentNotice}
                />


                <DeleteNotice
                    noticeId={currentNotice._id}
                    setNotices={setNotices}
                    setShowDeleteDialog={setShowDeleteDialog}
                    showDeleteDialog={showDeleteDialog}
                />
            </div>
        </>
    );
};

export default NoticeList;
