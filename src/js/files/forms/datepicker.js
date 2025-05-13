/* Календар */

// Підключення функціоналу "Чертоги Фрілансера"
// Підключення списку активних модулів
import { flsModules } from "../modules.js";

// Підключення модуля
import datepicker from 'js-datepicker';

const today = new Date();
const todayMonth = today.getMonth();
const todayYear = today.getFullYear();

if (document.querySelector('[data-datepicker]')) {
	const picker = datepicker('[data-datepicker]', {
		startDay: 0,
		//dateSelected: today,
		minDate: today,
		// disableMobile: true,
		noWeekends: true,
		// Додаємо обробник події після створення календаря
		onShow: function (instance) {
			// Дезактивуємо інпут (неможливо введення/редагування)
			instance.el.readOnly = true;
			// Перевіряємо поточний місяць та рік у календарі
			updateLeftArrowState(instance);
		},
		// Використовуємо хук "onHide" щоб розблокувати інпут якщо потрібно
		onHide: function (instance) {
			// instance.el.readOnly = false; // Розкоментуйте, якщо хочете дозволити редагування після закриття
		},

		// Додаємо обробник зміни місяця для підтримки стану disabled
		onMonthChange: function (instance) {
			// Оновлюємо стан стрілки при зміні місяця
			updateLeftArrowState(instance);
		},
		customDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
		customMonths: [
			'January', 'February', 'March', 'April',
			'May', 'June', 'July', 'August',
			'September', 'October', 'November', 'December'
		],
		customOverlayMonths: [
			'Jan', 'Feb', 'Mar', 'Apr',
			'May', 'Jun', 'Jul', 'Aug',
			'Sep', 'Oct', 'Nov', 'Dec'
		],
		overlayButton: 'Confirm',
		overlayPlaceholder: 'Enter year',
		formatter: (input, date, instance) => {
			const value = date.toLocaleDateString()
			input.value = value
		},
		onSelect: function (input, instance, date) {

		},

	});

	// Функція для оновлення стану стрілки "назад"
	function updateLeftArrowState(instance) {
		// Знаходимо стрілку "назад"
		const leftArrow = document.querySelector('.qs-arrow.qs-left');
		if (!leftArrow) return;

		// Отримуємо поточний місяць та рік з інстансу датапікера
		// У різних версіях js-datepicker це може бути по-різному
		let currentMonth, currentYear;

		// Спробуємо різні способи отримання поточного місяця/року
		if (instance.currentMonth !== undefined && instance.currentYear !== undefined) {
			// Прямий доступ до властивостей
			currentMonth = instance.currentMonth;
			currentYear = instance.currentYear;
		} else if (instance.currentMonthName && instance.currentYear) {
			// Спробуємо отримати місяць за назвою
			const monthNames = [
				'January', 'February', 'March', 'April', 'May', 'June',
				'July', 'August', 'September', 'October', 'November', 'December'
			];
			currentMonth = monthNames.indexOf(instance.currentMonthName);
			currentYear = instance.currentYear;
		} else if (typeof instance.getDate === 'function') {
			// Спробуємо отримати дату через метод
			const date = instance.getDate();
			currentMonth = date.getMonth();
			currentYear = date.getFullYear();
		} else {
			// Використовуємо поточний місяць як запасний варіант
			console.warn('Не вдалося визначити поточний місяць/рік з екземпляра datepicker');
			currentMonth = todayMonth;
			currentYear = todayYear;
		}

		// Перевіряємо, чи поточний місяць у датапікері є поточним місяцем системи або раніший
		if ((currentYear === todayYear && currentMonth <= todayMonth) ||
			(currentYear < todayYear)) {
			leftArrow.classList.add('disabled');
		} else {
			leftArrow.classList.remove('disabled');
		}

		// Виводимо дані для налагодження
		console.log('Current datepicker month/year:', currentMonth, currentYear);
		console.log('Today month/year:', todayMonth, todayYear);
	}

	// Додаємо CSS для відображення стану disabled
	const style = document.createElement('style');
	style.textContent = `
	.qs-arrow.qs-left.disabled {
	  color: #9CA3AF;
	  cursor: not-allowed;
	  pointer-events: none;
	}
 `;
	document.head.appendChild(style);

	// Додаємо додатковий глобальний обробник для заміни поведінки стрілки
	document.addEventListener('click', function (e) {
		if (e.target.classList.contains('qs-arrow') &&
			e.target.classList.contains('qs-left') &&
			e.target.classList.contains('disabled')) {
			e.preventDefault();
			e.stopPropagation();
			return false;
		}
	}, true);


	flsModules.datepicker = picker;


}

// document.addEventListener("DOMContentLoaded", function (e) {
// 	const inputDate = document.querySelector('[data-datepicker]');

// 	if (document.body.classList.contains('touch')) {
// 		inputDate.type = 'date';
// 	}
// });