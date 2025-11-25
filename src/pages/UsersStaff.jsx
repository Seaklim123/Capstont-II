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
  const [roleFilter, setRoleFilter] = useState('all'); // Add role filter
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      // Use getUsers() to get all users instead of just cashiers
      const response = await api.getUsers();
      setStaff(response || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
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
        await api.deleteUser(showDeleteConfirm.id);
        toast.success('Staff member deleted successfully');
        fetchStaff();
      } catch (error) {
        console.error('Error deleting staff:', error);
        toast.error('Failed to delete staff member');
      }
      setShowDeleteConfirm(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(null);
  };

  const handleSave = async (formData) => {
    try {
      if (editingUser) {
        // Edit staff - prepare data for update
        const updateData = {
          username: formData.username,
          email: formData.email,
          primary_phone: formData.primary_phone,
          secondary_phone: formData.secondary_phone,
          role: formData.role,
          status: formData.status,
        };

        // Only include password if it's provided
        if (formData.password && formData.password.trim()) {
          updateData.password = formData.password;
        }

        await api.updateUser(editingUser.id, updateData);
        toast.success('Staff member updated successfully');
      } else {
        // Add new staff - use cashier endpoint
        const newUserData = {
          username: formData.username,
          email: formData.email,
          primary_phone: formData.primary_phone,
          secondary_phone: formData.secondary_phone,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
          role: formData.role,
          status: formData.status,
        };

        await api.createCashier(newUserData);
        toast.success('Staff member added successfully');
      }
      setShowForm(false);
      setEditingUser(null);
      fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      const errorMessage = error.message || 'Failed to save staff member';
      toast.error(errorMessage);
    }
  };

  const filteredStaff = staff.filter(user => {
    // Filter by search term
    const matchesSearch = 
      (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.status || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.primary_phone || '').includes(searchTerm);

    // Filter by role
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="p-xl">
      {/* Page Header */}
      <div className="page-header mb-xl">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-sm">Users & Staff Management</h1>
          <p className="text-secondary">
            Manage all user accounts, roles, and permissions ({staff.length} total users)
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
        <div className="filter-controls">
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="input input-bordered"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="cashier">Cashier</option>
          </select>
        </div>
      </div>

      {/* Staff Table */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Primary Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  Loading staff members...
                </td>
              </tr>
            ) : filteredStaff.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                  {staff.length === 0 ? 'No staff members found.' : 'No staff members match your search.'}
                </td>
              </tr>
            ) : (
              filteredStaff.map(user => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email || 'N/A'}</td>
                  <td>{user.primary_phone || 'N/A'}</td>
                  <td>
                    <span className={`badge ${
                      user.role === 'admin' ? 'badge-danger' :
                      user.role === 'cashier' ? 'badge-primary' : 
                      'badge-secondary'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Cashier'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
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
              ))
            )}
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