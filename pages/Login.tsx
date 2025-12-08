import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogIn, Users } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const { login, getAllUsers } = useAuth();
  const navigate = useNavigate();
  const users = getAllUsers();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = username.trim() || selectedUser;
    if (user) {
      login(user);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mb-4">
            <User className="text-white" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Fitness AI Coach</h1>
          <p className="text-slate-500">Entre ou crie sua conta</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Nova Conta</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome de usuário"
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none"
            />
          </div>

          {users.length > 0 && (
            <>
              <div className="flex items-center gap-2 text-slate-400">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs">OU</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Users size={16} /> Contas Existentes
                </label>
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-pink-500 outline-none"
                >
                  <option value="">Selecione uma conta</option>
                  {users.map((user) => (
                    <option key={user} value={user}>{user}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={!username.trim() && !selectedUser}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-pink-700 hover:to-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <LogIn size={20} /> Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
