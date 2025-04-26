import React, { useState, useEffect } from 'react';
import { Button, Card, Divider } from 'primereact';
import { FaUserCircle, FaCalendarAlt, FaPen, FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';
import AddNotice from './AddNotice';
import EditNotice from './EditNotice';
import DeleteNotice from './DeleteNotice';

const NoticeList = () => {
    const [notices, setNotices] = useState([]);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [currentNotice, setCurrentNotice] = useState({});
    const ACCESS_TOKEN = useSelector((myStore) => myStore.token.token);
    const apartment = useSelector((myStore) => myStore.apartmentDetails.apartment);

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

    return (
        <div className="notice-list">
            {notices.length === 0 ? (
                <p className="no-notices">אין הודעות זמינות כרגע</p>
            ) : (
                notices.map((notice) => (
                    <div className="notice-card-container" key={notice._id}>
                        <Card className="notice-card">
                            <div className="notice-header">
                                <FaUserCircle className="notice-icon" />
                                <h3>{notice.title}</h3>
                            </div>
                            <p className="notice-info">
                                <FaCalendarAlt className="notice-info-icon" />
                                {new Date(notice.createdAt).toLocaleDateString()}
                            </p>
                            <Divider />
                            <p>{notice.content}</p>
                            {notice.publisher._id === apartment._id && (
                                <div className="notice-actions">
                                    <Button
                                        label="עריכה"
                                        icon={<FaPen />}
                                        className="p-button-warning"
                                        onClick={() => handleEdit(notice)}
                                    />
                                    <DeleteNotice
                                        ACCESS_TOKEN={ACCESS_TOKEN}
                                        apartment={apartment}
                                        setNotices={setNotices}
                                        noticeId={notice._id}
                                    />
                                </div>
                            )}
                        </Card>
                    </div>
                ))
            )}

            <Button
                label="הוסף מודעה"
                icon="pi pi-plus"
                className="p-button-success add-notice-btn"
                onClick={() => setShowAddDialog(true)}
            />

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
        </div>
    );
};

export default NoticeList;
