// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";  // Импорт для Realtime Database
import { getStorage } from "firebase/storage";  // Импорт для Firebase Storage

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsgZsVdugSxaPJj-8VnSqmmjGfaVcI7_U",
  authDomain: "drivers-questionnaire.firebaseapp.com",
  databaseURL: "https://drivers-questionnaire-default-rtdb.firebaseio.com/",
  projectId: "drivers-questionnaire",
  storageBucket: "drivers-questionnaire.appspot.com",  // Измените на правильный путь к хранилищу
  messagingSenderId: "321432155998",
  appId: "1:321432155998:web:77708e3f2f4aefb8b941cf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const driversBase = getDatabase(app);  // Инициализация базы данных
const storage = getStorage(app);  // Инициализация Firebase Storage

// Экспортируем аутентификацию, базу данных и хранилище
const firebase = { auth, driversBase, storage };

export default firebase;
