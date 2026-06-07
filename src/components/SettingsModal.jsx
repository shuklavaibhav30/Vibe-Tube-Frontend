import React, { useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SettingsModal = ({ onClose }) => {
    const { user, setUser } = useAuth();
    const { isDarkMode } = useTheme();
    const [fullName, setFullName] = useState(user?.fullName || '');
    const [email, setEmail] = useState(user?.email || '');
    
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [updatingAccount, setUpdatingAccount] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);

    const handleUpdateAccount = async (e) => {
        e.preventDefault();
        setUpdatingAccount(true);
        try {
            const { data } = await API.patch('/users/update-accounts', { fullName, email });
            setUser(data.data);
            alert("Account details updated!");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update account");
        } finally {
            setUpdatingAccount(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return alert("Passwords do not match!");
        }
        setUpdatingPassword(true);
        try {
            await API.post('/users/change-password', { oldPassword, newPassword });
            alert("Password changed successfully!");
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            alert(error.response?.data?.message || "Failed to change password");
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you sure to delete your account? (NOTE: THIS ACTION WILL PERMANENTLY DELETE YOUR ACCOUNT CREDENTIALS INCLUDING YOUR VIDEOS, TWEETS AND COMMENTS!)")) {
            return;
        }
        
        const confirmText = window.prompt("To confirm deletion, please type 'DELETE MY ACCOUNT' below:");
        if (confirmText !== "DELETE MY ACCOUNT") {
            return alert("Confirmation text did not match. Deletion cancelled.");
        }

        setDeletingAccount(true);
        try {
            await API.delete('/users/delete-account');
            alert("Your account and all associated data have been deleted. We're sorry to see you go :-|.");
            window.location.href = '/'; // Redirect to home/login
        } catch (error) {
            alert(error.response?.data?.message || "Failed to delete account");
            setDeletingAccount(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className={`w-full max-w-md rounded-2xl shadow-2xl border p-6 overflow-y-auto max-h-[90vh] transition-colors ${isDarkMode ? 'bg-[#1F1F1F] border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-center mb-8">
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Settings</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Account Details Form */}
                <form onSubmit={handleUpdateAccount} className={`space-y-4 mb-10 pb-10 border-b transition-colors ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                    <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Account Information</h3>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1 ml-1 font-medium">Full Name</label>
                        <input 
                            type="text" 
                            className={`w-full border rounded-xl p-3 outline-none focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-[#0F0F0F] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1 ml-1 font-medium">Email Address</label>
                        <input 
                            type="email" 
                            className={`w-full border rounded-xl p-3 outline-none focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-[#0F0F0F] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={updatingAccount}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {updatingAccount ? "Saving..." : "Update Profile"}
                    </button>
                </form>

                {/* Password Change Form */}
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <h3 className="text-gray-500 font-bold uppercase text-xs tracking-wider">Security</h3>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1 ml-1 font-medium">Current Password</label>
                        <input 
                            type="password" 
                            className={`w-full border rounded-xl p-3 outline-none focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-[#0F0F0F] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1 ml-1 font-medium">New Password</label>
                        <input 
                            type="password" 
                            className={`w-full border rounded-xl p-3 outline-none focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-[#0F0F0F] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-500 mb-1 ml-1 font-medium">Confirm New Password</label>
                        <input 
                            type="password" 
                            className={`w-full border rounded-xl p-3 outline-none focus:border-blue-500 transition-colors ${isDarkMode ? 'bg-[#0F0F0F] border-gray-700 text-white' : 'bg-gray-50 border-gray-300 text-black'}`}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={updatingPassword}
                        className={`w-full font-bold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-black'}`}
                    >
                        {updatingPassword ? "Changing..." : "Change Password"}
                    </button>
                </form>

                {/* Delete Account Section */}
                <div className="mt-10 pt-10 border-t border-red-900/30">
                    <h3 className="text-red-500 font-bold uppercase text-xs tracking-wider mb-4">Danger Zone</h3>
                    <p className="text-gray-500 text-xs mb-4">
                        Permanently delete your account and all its data. This action is irreversible.
                    </p>
                    <button 
                        onClick={handleDeleteAccount}
                        disabled={deletingAccount}
                        className="w-full bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/30 font-bold py-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                        {deletingAccount ? "Deleting Account..." : "Delete Account"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
