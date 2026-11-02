import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Input from '../../components/input/Input';
import Button from '../../components/button/Button';
import { useAuth } from '../../context/AuthContext';
import * as Config from '../../constants/Config';
import './auth.scss';

const Register = () => {
  const history = useHistory();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await register(name, email, password);
      history.push(`/${Config.HOME_PAGE}`);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Lỗi kết nối API');
      // debug
      console.log('REGISTER ERROR:', err?.response?.status, err?.response?.data || err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Đăng ký</h2>

        <form onSubmit={onSubmit}>
          <Input
            placeholder="Họ tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            <Button type="submit">{busy ? 'Đang tạo...' : 'Tạo tài khoản'}</Button>
          </div>
        </form>

        <p className="auth-footer">
          Đã có tài khoản? <Link to={`/${Config.HOME_PAGE}/login`}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
