import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useAuth } from '../../context/AuthContext';
import * as Config from '../../constants/Config';
import './auth.scss';

const Login = () => {
  const history = useHistory();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') history.push(`/${Config.HOME_PAGE}/admin`);
      else history.push(`/${Config.HOME_PAGE}`);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Lỗi kết nối API');
      // debug
      console.log('LOGIN ERROR:', err?.response?.status, err?.response?.data || err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Đăng nhập</h2>

        <form onSubmit={onSubmit}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="auth-error">{error}</p>}

          <div style={{ marginTop: 12 }}>
            <Button type="submit">{busy ? 'Đang đăng nhập...' : 'Đăng nhập'}</Button>
          </div>
        </form>

        <p className="auth-footer">
          Chưa có tài khoản? <Link to={`/${Config.HOME_PAGE}/register`}>Đăng ký</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
