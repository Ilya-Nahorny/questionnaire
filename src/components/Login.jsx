import { useState } from 'react';
import firebase from "../firebase";
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';

const { auth } = firebase;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({}); // Объект для хранения ошибок
  const [generalError, setGeneralError] = useState(null); // Общая ошибка
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    
    // Проверка email
    if (!email) {
      newErrors.email = 'Введите email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Введите корректный email.';
    }

    // Проверка пароля
    if (!password) {
      newErrors.password = 'Введите пароль.';
    } else if (password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов.';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Пароль должен содержать хотя бы одну заглавную букву.';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Пароль должен содержать хотя бы одну цифру.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setGeneralError(null);

    if (!validate()) {
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/drivers');
    } catch (error) {
      setGeneralError('Ошибка входа: ' + error.message);
    }
  };

  return (
    <section className="d-flex align-items-center justify-content-center min-vh-100 bg-light login-form">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="text-center mb-4">Вход</h1>
        <form onSubmit={handleLogin}>
          {/* Поле Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>

          {/* Поле Пароль */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Пароль</label>
            <input
              id="password"
              name="password"
              type="password"
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              placeholder="Введите ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          {/* Общая ошибка */}
          {generalError && (
            <div className="alert alert-danger text-center" role="alert">
              {generalError}
            </div>
          )}

          {/* Кнопка входа */}
          <button type="submit" className="btn btn-primary w-100">Войти</button>
        </form>
      </div>
    </section>
  );
};

export default Login;
