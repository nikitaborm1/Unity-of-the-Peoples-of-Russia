'use strict';

// --- 1. Управление модальными окнами (Доступность и Безопасность) ---
let lastFocusedElement;

function openModal(id) {
    lastFocusedElement = document.activeElement; // Запоминаем, откуда открыли
    const modal = document.getElementById(id);
    if (!modal) return;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Блокируем скролл
    
    // Фокус на первое поле ввода или кнопку закрытия (для скринридеров)
    const focusable = modal.querySelector('input, button, iframe');
    if (focusable) focusable.focus();
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Возвращаем скролл
    
    // Возвращаем фокус обратно
    if (lastFocusedElement) lastFocusedElement.focus();
}

// Закрытие по клику вне окна и по клавише Escape
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target.id);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) closeModal(activeModal.id);
    }
});


// --- 2. Валидация формы (Безопасность и UX) ---
function validateForm(event) {
    event.preventDefault(); // Отменяем стандартную отправку
    
    const fio = document.getElementById('fio');
    const dob = document.getElementById('dob');
    const address = document.getElementById('address');
    
    let isValid = true;

    // Сброс предыдущих ошибок
    document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
    
    // Валидация ФИО (только буквы, пробелы и дефисы, минимум 2 слова)
    const fioRegex = /^[A-Za-zА-Яа-яЁё\s\-]+$/;
    if (!fioRegex.test(fio.value.trim()) || fio.value.trim().split(' ').length < 2) {
        showError('fio', 'Введите корректное ФИО (Фамилия Имя).');
        isValid = false;
    }
    
    // Валидация даты рождения (не в будущем и не старше 100 лет)
    const dobDate = new Date(dob.value);
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
    if (dobDate > today || dobDate < minDate || isNaN(dobDate.getTime())) {
        showError('dob', 'Введите корректную дату рождения.');
        isValid = false;
    }

    // Валидация адреса
    if (address.value.trim().length < 5) {
        showError('address', 'Введите полный почтовый адрес.');
        isValid = false;
    }

    if (isValid) {
        // Имитация безопасной отправки (XSS-фильтрация на клиенте)
        const safeFio = fio.value.replace(/[<>]/g, ''); 
        alert(`Спасибо, ${safeFio}! Вы успешно зарегистрированы.`);
        
        document.getElementById('regForm').reset();
        closeModal('regModal');
    }
    
    return false;
}

function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const errorEl = document.getElementById(inputId + 'Error');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
    input.setAttribute('aria-invalid', 'true');
}


// --- 3. Слайдер с авторотацией ---
let currentSlide = 0;
const slider = document.getElementById('slider');
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
let slideInterval;

function nextSlide() {
    if (totalSlides === 0) return;
    currentSlide = (currentSlide + 1) % totalSlides;
    // Так как width у слайдера 300%, а у слайда 100%, сдвиг на 33.333% за слайд
    slider.style.transform = `translateX(-${currentSlide * (100 / totalSlides)}%)`;
}

function startSlider() {
    slideInterval = setInterval(nextSlide, 4000); // Ротация каждые 4 секунды
}

function stopSlider() {
    clearInterval(slideInterval);
}

// Пауза при наведении (UX)
if (slider) {
    slider.parentElement.addEventListener('mouseenter', stopSlider);
    slider.parentElement.addEventListener('mouseleave', startSlider);
    startSlider();
}


// --- 4. Мобильное меню (UX) ---
const menuBtn = document.getElementById('menuBtn');
const mainNav = document.getElementById('mainNav');

menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    mainNav.classList.toggle('active');
});


// --- 5. Кнопка "Вверх" ---
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
