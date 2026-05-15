import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, UserPlus, Shield, Mail, Edit2, Trash2, X } from 'lucide-react';
import api from '../services/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'Viewer', department: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'Viewer', department: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, department: user.department });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Error deleting user');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingUser) {
        const res = await api.put(`/users/${editingUser.id}`, formData);
        setUsers(users.map(u => u.id === editingUser.id ? res.data : u));
      } else {
        const res = await api.post('/users', formData);
        setUsers([...users, res.data]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save user:', err);
      alert('Error saving user');
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="text-muted flex items-center justify-center h-full">Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">User Management</h1>
          <p className="text-muted text-sm mt-1">Manage enterprise access and roles</p>
        </div>
        <button 
          onClick={openAddModal}
          className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </button>
      </div>

      <div className="glass-panel overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name, email or role..." 
              className="w-full bg-background border border-border rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-background/50 border-b border-border text-sm text-muted">
                <th className="py-3 px-6 font-medium">User</th>
                <th className="py-3 px-6 font-medium">Contact</th>
                <th className="py-3 px-6 font-medium">Role</th>
                <th className="py-3 px-6 font-medium">Department</th>
                <th className="py-3 px-6 font-medium">Status</th>
                <th className="py-3 px-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-muted">No users found</td>
                </tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={`https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-10 h-10 rounded-full border border-border" />
                      <span className="font-medium text-text">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center text-sm text-muted">
                      <Mail className="w-4 h-4 mr-2" />
                      {user.email}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-muted">{user.department}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        user.status === 'Active' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' :
                        user.status === 'Suspended' ? 'bg-red-500' : 'bg-gray-500'
                      }`} />
                      <span className="text-sm text-muted">{user.status}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEditModal(user)} className="p-1.5 text-muted hover:text-primary transition-colors rounded-md hover:bg-primary/10">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-1.5 text-muted hover:text-red-500 transition-colors rounded-md hover:bg-red-500/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-bold">{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-text">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted">Full Name</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted">Email</label>
                <input 
                  type="email" required
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted">Role</label>
                  <select 
                    value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary"
                  >
                    <option>Viewer</option>
                    <option>Editor</option>
                    <option>Admin</option>
                    <option>Super Admin</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted">Department</label>
                  <input 
                    type="text" required
                    value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-background border border-border rounded-lg text-sm font-medium hover:bg-white/5">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-70">
                  {saving ? 'Saving...' : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
