import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import UserForm from '../components/UsersStaff/UserForm';
import ConfirmationModal from '../components/common/ConfirmationModal';

const UsersStaff = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await api.request('/v1/admin/users', { method: 'GET' });
      const staffList = (response.data || response).filter(user => user.role === 'cashier');
      setStaff(staffList);
    } catch (error) {
      toast.error('Failed to load staff');
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleDelete = (user) => {
    setShowDeleteConfirm(user);
  };

  const confirmDelete = async () => {
    if (showDeleteConfirm) {
      try {
        await api.request(`/v1/admin/users/${showDeleteConfirm.id}`, { method: 'DELETE' });
        toast.success('Staff deleted');
        fetchStaff();
      } catch (err) {
        toast.error('Failed to delete staff');
      }
      setShowDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleSave = async (form) => {
    try {
      if (editingUser) {
        // Edit staff
        await api.request(`/v1/admin/users/${editingUser.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            username: form.username,
            role: form.role,
            status: form.status,
          }),
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('Staff updated');
      } else {
        // Add staff
        await api.request('/v1/admin/users', {
          method: 'POST',
          body: JSON.stringify({
            username: form.username,
            password: form.password,
            password_confirmation: form.password_confirmation, // <-- Use the confirmation field!
            role: form.role,
            status: form.status,
          }),
          headers: { 'Content-Type': 'application/json' },
        });
        toast.success('Staff added');
      }
      setShowForm(false);
      setEditingUser(null);
      fetchStaff();
    } catch (err) {
      toast.error('Failed to save staff');
    }
  };

  const filteredStaff = staff.filter(user =>
    (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.status || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-xl">
      {/* Page Header */}
      <div className="page-header mb-xl">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-sm">Users & Staff Management</h1>
          <p className="text-secondary">
            Manage staff accounts, roles, and permissions
          </p>
        </div>
        <div>
          <button className="btn btn-primary flex items-center gap-xs" onClick={handleAdd}>
            <Plus size={16} />
            Add Staff
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-filter-bar mb-md">
        <div className="search-input">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search staff..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="input input-bordered ml-xs"
          />
        </div>
      </div>

      {/* Staff Table */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.status}</td>
                <td>{user.created_at}</td>
                <td>
                  <div className="flex gap-xs">
                    <button
                      className="btn btn-sm btn-outline flex items-center gap-xxs"
                      onClick={() => handleEdit(user)}
                      title="Edit"
                    >
                      <Edit size={16} />
                      <span className="hidden md:inline">Edit</span>
                    </button>
                    <button
                      className="btn btn-sm btn-danger flex items-center gap-xxs"
                      onClick={() => handleDelete(user)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                      <span className="hidden md:inline">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Form Modal */}
      <UserForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingUser(null); }}
        onSave={handleSave}
        editingUser={editingUser}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!showDeleteConfirm}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        itemName={showDeleteConfirm?.username}
      />
    </div>
  );
};

export default UsersStaff;