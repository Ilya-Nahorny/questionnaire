import React, { useEffect, useState } from 'react';
import { onValue, ref } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import firebase from '../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';

const DriverRealtimeList = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDriver, setExpandedDriver] = useState(null);
  const [selectedDrivers, setSelectedDrivers] = useState(new Set());

  const [user, loadingUser] = useAuthState(firebase.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const driversRef = ref(firebase.driversBase, 'drivers');
    const unsubscribe = onValue(driversRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const driverList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setDrivers(driverList);
      } else {
        setDrivers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleDriverClick = (driverId) => {
    setExpandedDriver(expandedDriver === driverId ? null : driverId);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLogout = async () => {
    try {
      await signOut(firebase.auth);
      navigate('/login');
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    }
  };

  const handleSelectDriver = (driverId) => {
    setSelectedDrivers((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(driverId)) {
        newSelected.delete(driverId);
      } else {
        newSelected.add(driverId);
      }
      return newSelected;
    });
  };

  const handleSelectAll = () => {
    if (selectedDrivers.size === drivers.length) {
      setSelectedDrivers(new Set());
    } else {
      setSelectedDrivers(new Set(drivers.map(driver => driver.id)));
    }
  };

  const handleDeleteSelected = () => {
    selectedDrivers.forEach(driverId => {
      const driverRef = ref(firebase.driversBase, `drivers/${driverId}`);
      firebase.database().ref(driverRef).remove();
    });
    setSelectedDrivers(new Set()); // Сбрасываем выбор
  };

  const generateTextFile = (driver) => {
    const content = `Информация о водителе:\n\n` +
      `Имя и фамилия: ${driver.fullName}\n` +
      `Адрес: ${driver.address}\n` +
      `Телефон: ${driver.phoneNumber}\n` +
      `PESEL: ${driver.pesel}\n` +
      `Дети: ${driver.childrenInfo || 'Не указано'}\n` +
      `Образование: ${driver.education || 'Не указано'}\n` +
      `Банковский счёт: ${driver.bankAccount || 'Не указано'}\n` +
      `Экстренный контакт: ${driver.emergencyContact?.name || 'Не указано'} (${driver.emergencyContact?.phone || 'Нет телефона'})\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${driver.fullName.replace(/\s+/g, '_')}_details.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateTextFilesForSelected = () => {
    selectedDrivers.forEach(driverId => {
      const driver = drivers.find(driver => driver.id === driverId);
      if (driver) {
        generateTextFile(driver);
      }
    });
  };

  const filteredDrivers = drivers.filter((driver) =>
    driver.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loadingUser) {
    return <p>Загрузка данных...</p>;
  }

  return (
    <div className="container-fluid py-4 d-flex justify-content-center drivers-list">
      <div className="w-100" style={{ maxWidth: '1200px' }}>
        <h1 className="text-center mb-4">Список водителей</h1>

        {user && (
          <button onClick={handleLogout} className="btn btn-danger mb-4">
            Выйти
          </button>
        )}

        <div className="mb-4">
          <div className="input-group">
            <input
              type="text"
              placeholder="Поиск по имени"
              value={searchQuery}
              onChange={handleSearchChange}
              className="form-control"
            />
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
          </div>
        </div>

        <div className="mb-4">
          <button
            onClick={handleSelectAll}
            className="btn btn-outline-primary me-2"
          >
            {selectedDrivers.size === drivers.length ? 'Отменить выбор' : 'Выбрать всех'}
          </button>
          <button
            onClick={handleDeleteSelected}
            className="btn btn-danger me-2"
          >
            Удалить выбранных
          </button>
          <button
            onClick={generateTextFilesForSelected}
            className="btn btn-success"
          >
            Скачать TXT для выбранных
          </button>
        </div>

        <ul className="list-group">
          {(filteredDrivers.length > 0 || searchQuery === "") ? (
            filteredDrivers.map((driver) => (
              <li key={driver.id} className="list-group-item mb-3">
                <div className="d-flex align-items-center">
                  <input
                    type="checkbox"
                    checked={selectedDrivers.has(driver.id)}
                    onChange={() => handleSelectDriver(driver.id)}
                    className="form-check-input me-2"
                  />
                  <div
                    className="driver-name text-primary cursor-pointer"
                    onClick={() => handleDriverClick(driver.id)}
                  >
                    <strong>{driver.fullName}</strong>
                  </div>
                  <div className="ms-auto">
                    <button
                      className={`btn btn-sm me-2 ${expandedDriver === driver.id ? 'btn-secondary' : 'btn-outline-secondary'}`}
                      onClick={() => handleDriverClick(driver.id)}
                    >
                      {expandedDriver === driver.id ? 'Скрыть' : 'Показать'}
                    </button>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => generateTextFile(driver)}
                    >
                      Скачать TXT
                    </button>
                  </div>
                </div>

                {expandedDriver === driver.id && (
                  <div className="driver-details mt-3">
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <p><strong>Адрес:</strong> {driver.address}</p>
                        <p><strong>Телефон:</strong> {driver.phoneNumber}</p>
                      </div>
                      <div className="col-12 col-md-6">
                        <p><strong>PESEL:</strong> {driver.pesel}</p>
                        <p><strong>Дети:</strong> {driver.childrenInfo || 'Не указано'}</p>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 col-md-6">
                        <p><strong>Образование:</strong> {driver.education || 'Не указано'}</p>
                      </div>
                      <div className="col-12 col-md-6">
                        <p><strong>Банковский счёт:</strong> {driver.bankAccount || 'Не указано'}</p>
                      </div>
                    </div>
                    <p><strong>Экстренный контакт:</strong> {driver.emergencyContact?.name || 'Не указано'}{' '}
                      ({driver.emergencyContact?.phone || 'Нет телефона'})
                    </p>
                  </div>
                )}
              </li>
            ))
          ) : (
            <p>Результатов не найдено. Попробуйте изменить запрос.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DriverRealtimeList;
