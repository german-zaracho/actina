import React, { useState, useEffect } from 'react';
import { getAllMultiplechoiceGroups, deleteMultiplechoiceGroup } from './services/adminService';
import ConfirmModal from './ConfirmModal';

const MultiplechoiceList = ({ onEdit, onCreate }) => {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    useEffect(() => {
        loadGroups();
    }, []);

    const loadGroups = async () => {
        try {
            const data = await getAllMultiplechoiceGroups();
            setGroups(data);
        } catch (err) {
            setError('Error al cargar los grupos');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (group) => {
        setItemToDelete(group);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteMultiplechoiceGroup(itemToDelete._id);
            setGroups(groups.filter(group => group._id !== itemToDelete._id));
            setShowDeleteModal(false);
            setItemToDelete(null);
        } catch (err) {
            alert('Error al eliminar');
            console.error(err);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    if (loading) return <div className="loading">Cargando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <>
            <div className="multiplechoice-list">
                <div className="list-header">
                    <h2>Multiple Choices</h2>
                    <button className="btn-primary" onClick={onCreate}>
                        Crear Nuevo Grupo
                    </button>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th>Clasificación</th>
                            <th>Cantidad de Preguntas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map(group => (
                            <tr key={group._id}>
                                <td>{group.subject}</td>
                                <td>{group.classification}</td>
                                <td>{group.questions?.length || 0} preguntas</td>
                                <td className="actions">
                                    <button
                                        className="btn-edit"
                                        onClick={() => onEdit(group)}
                                    >
                                        Editar
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={() => handleDeleteClick(group)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {groups.length === 0 && (
                    <p className="empty-message">No hay grupos creados aún</p>
                )}
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                title="Confirmar eliminación"
                message={`¿Estás seguro de que quieres eliminar el grupo "${itemToDelete?.subject} - ${itemToDelete?.classification}"? Esta acción no se puede deshacer.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
        </>
    );
};

export default MultiplechoiceList;