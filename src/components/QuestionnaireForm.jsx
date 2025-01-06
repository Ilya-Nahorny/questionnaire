import { useForm } from 'react-hook-form';
import { ref, set } from 'firebase/database';
import firebase from '../firebase'; // Подключаем настройки Firebase
import 'bootstrap/dist/css/bootstrap.min.css'; // Подключаем Bootstrap

const QuestionnaireForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      // Создаем уникальный ключ, заменяя пробелы в имени и фамилии на подчеркивания
      const driverKey = data.fullName.replace(/\s+/g, '_');  // Заменяем пробелы на подчеркивания
      const driverData = {
        fullName: data.fullName,
        address: data.address,
        phoneNumber: data.phoneNumber,
        pesel: data.pesel,
        childrenInfo: data.childrenInfo,
        education: data.education,
        bankAccount: data.bankAccount,
        experience: data.experience,  // Добавляем опыт работы
        emergencyContact: {
          name: data.emergencyContactName,
          phone: data.emergencyContactPhone,
        },
      };

      // Сохраняем данные водителя по имени в базе данных
      const newDriverRef = ref(firebase.driversBase, `drivers/${driverKey}`);
      await set(newDriverRef, driverData);

      alert('Анкета успешно отправлена!');
    } catch (error) {
      console.error('Ошибка при отправке анкеты:', error);
    }
  };

  return (
    <section className="container py-4">
      <h1 className="text-center mb-4">Заполните анкету</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="row g-3">

        <div className="col-12">
          <label htmlFor="fullName" className="form-label">Имя и фамилия</label>
          <input
            {...register('fullName', {
              required: 'Поле "Имя и фамилия" обязательно для заполнения.',
              pattern: {
                value: /^[a-zA-Z\s\-]+$/,
                message: 'Имя и фамилия могут содержать только латинские буквы и пробелы.',
              },
            })}
            id="fullName"
            placeholder="Имя и фамилия"
            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
          />
          {errors.fullName && <div className="invalid-feedback">{errors.fullName.message}</div>}
        </div>

        <div className="col-12">
          <label htmlFor="address" className="form-label">Адрес в родной стране</label>
          <input
            {...register('address', {
              required: 'Поле "Адрес" обязательно для заполнения.',
              pattern: {
                value: /^[a-zA-Z0-9\s,\.]+$/,
                message: 'Адрес может содержать только латинские буквы, цифры, пробелы, запятые и точки.',
              },
            })}
            id="address"
            placeholder="Адрес в родной стране"
            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
          />
          {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="phoneNumber" className="form-label">Телефон</label>
          <input
            {...register('phoneNumber', {
              required: 'Номер телефона обязателен.',
              pattern: {
                value: /^\+?[0-9]{10,15}$/,
                message: 'Номер телефона должен быть в правильном формате (например, +79991234567).',
              },
            })}
            id="phoneNumber"
            placeholder="Телефон"
            className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
          />
          {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber.message}</div>}
        </div>

        <div className="col-12 col-md-6">
          <label htmlFor="pesel" className="form-label">PESEL</label>
          <input
            {...register('pesel', {
              required: 'Поле "PESEL" обязательно для заполнения.',
              pattern: {
                value: /^[0-9]{11}$/,
                message: 'PESEL должен состоять из 11 цифр.',
              },
            })}
            id="pesel"
            maxLength={11}
            placeholder="PESEL"
            className={`form-control ${errors.pesel ? 'is-invalid' : ''}`}
          />
          {errors.pesel && <div className="invalid-feedback">{errors.pesel.message}</div>}
        </div>

        <div className="col-12">
          <label htmlFor="childrenInfo" className="form-label">Информация о детях и родственниках</label>
          <textarea
            {...register('childrenInfo')}
            id="childrenInfo"
            placeholder="Информация о детях и родственниках"
            className="form-control"
          />
        </div>

        <div className="col-12">
          <label htmlFor="education" className="form-label">Образование и опыт работы</label>
          <textarea
            {...register('education')}
            id="education"
            placeholder="Образование и опыт работы"
            className="form-control"
          />
        </div>

        <div className="col-12">
          <label htmlFor="bankAccount" className="form-label">Номер банковского счёта</label>
          <input
            {...register('bankAccount', {
              required: 'Поле "Номер банковского счёта" обязательно для заполнения.',
              pattern: {
                value: /^[0-9]{20}$/,
                message: 'Номер банковского счёта должен состоять из 20 цифр.',
              },
            })}
            id="bankAccount"
            placeholder="Номер банковского счёта"
            className={`form-control ${errors.bankAccount ? 'is-invalid' : ''}`}
          />
          {errors.bankAccount && <div className="invalid-feedback">{errors.bankAccount.message}</div>}
        </div>

        <div className="col-12">
          <label htmlFor="experience" className="form-label">Опыт работы водителем E + C в Европе (от 0 до 35 лет)</label>
          <input
            {...register('experience', {
              required: 'Поле "Опыт работы" обязательно для заполнения.',
              validate: (value) => {
                // Проверка, что введено число
                if (!/^[0-9]+$/.test(value)) {
                  return 'Опыт работы должен быть числовым значением.';
                }
                // Проверка, что опыт работы от 0 до 35 лет
                if (value < 0 || value > 35) {
                  return 'Опыт работы должен быть от 0 до 35 лет.';
                }
                return true; // Валидация прошла успешно
              },
            })}
            id="experience"
            placeholder="Опыт работы в годах"
            className={`form-control ${errors.experience ? 'is-invalid' : ''}`}
          />
          {errors.experience && <div className="invalid-feedback">{errors.experience.message}</div>}
        </div>

        <div className="col-12">
          <label htmlFor="emergencyContactName" className="form-label">Имя экстренного контакта</label>
          <input
            {...register('emergencyContactName', {
              required: 'Поле "Имя экстренного контакта" обязательно для заполнения.',
              pattern: {
                value: /^[a-zA-Z\s\-]+$/,
                message: 'Имя экстренного контакта может содержать только латинские буквы и пробелы.',
              },
            })}
            id="emergencyContactName"
            placeholder="Имя экстренного контакта"
            className={`form-control ${errors.emergencyContactName ? 'is-invalid' : ''}`}
          />
          {errors.emergencyContactName && <div className="invalid-feedback">{errors.emergencyContactName.message}</div>}
        </div>

        <div className="col-12">
          <label htmlFor="emergencyContactPhone" className="form-label">Телефон экстренного контакта</label>
          <input
            {...register('emergencyContactPhone', {
              required: 'Телефон экстренного контакта обязателен.',
              pattern: {
                value: /^\+?[0-9]{10,15}$/,
                message: 'Телефон экстренного контакта должен быть в правильном формате.',
              },
            })}
            id="emergencyContactPhone"
            placeholder="Телефон экстренного контакта"
            className={`form-control ${errors.emergencyContactPhone ? 'is-invalid' : ''}`}
          />
          {errors.emergencyContactPhone && <div className="invalid-feedback">{errors.emergencyContactPhone.message}</div>}
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100">Отправить</button>
        </div>

      </form>
    </section>
  );
};

export default QuestionnaireForm;
