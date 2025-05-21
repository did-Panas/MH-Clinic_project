// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";

// ===========================s=======================================================
// ===== BLOCKING SUBMIT-BTN with empty input (before validating) ===================

// const inputSubscript = document.querySelector('.subscribe-form__input');
// const btnSubmit = document.querySelector('.subscribe-form__btn');

// if (inputSubscript) {
// 	inputSubscript.addEventListener("blur", function (e) {

// 		if (inputSubscript.value.length > 0) {
// 			btnSubmit.disabled = false;
// 		} else {
// 			btnSubmit.disabled = true;
// 		}

// 	});
// }

// ===============
// ++++!!!!!!
// Валідація форм (З ВРАХУВАННЯМ ПУСТОГО ІНПУТУ + В КІНЦІ КОД БЛОКУВАННЯ BTN-SUBMIT)
// (вставити до formValidate в файл - forms.js)

// validateInput(formRequiredItem) {
// 	let error = 0;
// 	if (formRequiredItem.dataset.required === "email") {
// 		formRequiredItem.value = formRequiredItem.value.replace(" ", "");
// 		if ((this.emailTest(formRequiredItem)) && (formRequiredItem.value !== "")) {
// 			this.addError(formRequiredItem);
// 			error++;
// 		} else {
// 			this.removeError(formRequiredItem);
// 		}
// 	}
// 	else if (formRequiredItem.dataset.required === "uaphone") {
// 		formRequiredItem.value = formRequiredItem.value.replace(" ", "");
// 		if ((this.phoneTest(formRequiredItem)) && (formRequiredItem.value !== "")) {
// 			this.addError(formRequiredItem);
// 			error++;
// 		} else {
// 			this.removeError(formRequiredItem);
// 		}
// 	}
// 	else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
// 		this.addError(formRequiredItem);
// 		error++;
// 	} else {
// 		if (!formRequiredItem.value.trim()) {
// 			this.addError(formRequiredItem);
// 			error++;
// 		} else {
// 			this.removeError(formRequiredItem);
// 		}
// 	}
// 	return error;
// },

// ==========================

// ============ >>>>>>>BLOCKING SUBMIT-BTN with empty input (before validating) =====

// else if (formRequiredItem.tagName === "SELECT" && Number(formRequiredItem.value) == 1) {
// 	this.addError(formRequiredItem);
// 	error++;
// }

// ================================================================================

// ===== DROPDOWN MENU ==============================================================

let body = document.querySelector('body');
if (isMobile.any()) {
	body.classList.add('touch');
	let arrow = document.querySelectorAll('.arrow');
	for (let i = 0; i < arrow.length; i++) {
		let thisLink = arrow[i].previousElementSibling;
		let subMenu = arrow[i].nextElementSibling;
		let thisArrow = arrow[i];

		thisLink.classList.add('parent');
		arrow[i].previousElementSibling.addEventListener('click', function () {
			subMenu.classList.toggle('open');
			thisArrow.classList.toggle('active');
		});


		// Клик снаружи дропдауна. Закрыть дропдаун
		document.addEventListener('click', function (e) {
			if (e.target.classList.contains("menu__body")) {
				subMenu.classList.remove('open');
				thisArrow.classList.remove('active');
			}
		});

		// Нажатие на Tab или Escape. Закрыть дропдаун
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Tab' || e.key === 'Escape') {
				subMenu.classList.remove('open');
				thisArrow.classList.remove('active');
			}
		});



	}
} else {
	body.classList.add('mouse');
}

// =============================================== >>>>>>>>>>> DROPDOWN MENU =========

// ===== ANIMATED COUNTER (with delayed appearance of symbols) =======================

/**
 * Модуль анімації цифрових лічильників при попаданні в поле зору.
 */
function animatedCounters() {

	const ANIMATION_DURATION = 4000; // Фіксована тривалість анімації - 4 секунди

	/**
	 * Форматує число згідно з вказаним форматом (зараз підтримує тільки кому як роздільник тисяч).
	 * @param {number} value - Число для форматування.
	 * @param {string} format - Символ форматування (напр., ',').
	 * @returns {string} - Форматоване число.
	 */
	function formatNumber(value, format) {
		if (format === ',') {
			// Додає кому як роздільник тисяч
			return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
		// Повертаємо як є, якщо формат не вказано або не підтримується
		return value.toString();
	}

	/**
	 * Анімує один лічильник від 0 до цільового значення.
	 * @param {HTMLElement} counterElement - HTML елемент лічильника ([data-digits-counter]).
	 * @param {number} duration - Тривалість анімації в мілісекундах.
	 * @returns {Promise<void>} - Проміс, що вирішується після завершення анімації.
	 */
	function animateSingleCounter(counterElement, duration) {
		return new Promise((resolve, reject) => {
			const targetValueStr = counterElement.dataset.digitsCounterTarget;
			const targetValue = parseFloat(targetValueStr.replace(/,/g, '')); // Видаляємо коми для розрахунків
			const format = counterElement.dataset.digitsCounterFormat || ''; // Отримуємо формат

			// Перевірка, чи цільове значення є дійсним числом
			if (isNaN(targetValue)) {
				console.error("Неправильне цільове значення лічильника:", targetValueStr, "для елемента:", counterElement);
				counterElement.innerHTML = targetValueStr; // Показуємо початкове значення як є
				return resolve(); // Вирішуємо Проміс, щоб не блокувати Promise.all
			}

			let startTimestamp = null;

			const step = (timestamp) => {
				if (!startTimestamp) startTimestamp = timestamp;

				const progress = Math.min((timestamp - startTimestamp) / duration, 1);
				const currentValue = Math.floor(progress * targetValue); // Розрахунок поточного значення

				// Оновлення HTML з форматуванням
				counterElement.innerHTML = formatNumber(currentValue, format);

				if (progress < 1) {
					window.requestAnimationFrame(step); // Продовжуємо анімацію
				} else {
					// Переконуємося, що кінцеве значення точно встановлено (на випадок похибок float)
					counterElement.innerHTML = formatNumber(targetValue, format);
					resolve(); // Анімація завершена!
				}
			};

			// Запускаємо перший кадр анімації
			window.requestAnimationFrame(step);
		});
	}

	/**
	 * Ініціалізує та запускає анімацію для всіх лічильників всередині вказаного контейнера.
	 * @param {HTMLElement} container - Контейнер, в якому шукати лічильники (напр., блок, що з'явився на екрані).
	 */
	function initAndAnimateCounters(container) {
		const counters = container.querySelectorAll("[data-digits-counter]");
		const spans = container.querySelectorAll(".numbers__num span");

		if (!counters.length) {
			return; // Немає лічильників у цьому контейнері
		}

		const animationPromises = [];

		// Підготовка: зберігаємо цільове значення та обнуляємо
		counters.forEach(counter => {
			if (!counter.dataset.digitsCounterTarget) { // Запускаємо лише якщо ще не анімовано
				const originalValue = counter.innerHTML;
				counter.dataset.digitsCounterTarget = originalValue; // Зберігаємо ціль
				counter.innerHTML = '0'; // Починаємо з нуля
				// Додаємо Проміс анімації до масиву
				animationPromises.push(animateSingleCounter(counter, ANIMATION_DURATION));
			}
		});


		// Якщо ми почали якісь анімації
		if (animationPromises.length > 0) {
			// Чекаємо завершення ВСІХ анімацій у цьому контейнері
			Promise.all(animationPromises)
				.then(() => {
					console.log("Анімація лічильників у контейнері завершена.");
					// Робимо видимими ВСІ span'и всередині цього контейнера
					spans.forEach(span => {
						span.style.opacity = '1';
					});
				})
				.catch(error => {
					console.error("Помилка під час анімації лічильників:", error);
				});
		}
	}

	/**
	 * Обробник події від "спостерігача" (наприклад, IntersectionObserver).
	 * Ця функція викликається, коли елемент з data-watch з'являється на екрані.
	 * @param {CustomEvent} e - Подія, що містить деталі від спостерігача.
	 */
	function handleWatcherCallback(e) {
		if (!e.detail || !e.detail.entry || !e.detail.entry.target) {
			console.warn("Подія watcherCallback не містить необхідних даних.");
			return;
		}

		const targetElement = e.detail.entry.target; // Елемент, що з'явився (у вашому випадку .numbers)

		// Перевіряємо, чи елемент справді видимий (важливо для IntersectionObserver)
		if (e.detail.entry.isIntersecting) {
			// Шукаємо лічильники ТІЛЬКИ всередині елемента, що з'явився
			initAndAnimateCounters(targetElement);
		}
	}

	// Припускаємо, що у вас є зовнішній скрипт ("спостерігач"), який
	// знаходить елементи з атрибутом `data-watch` і генерує подію "watcherCallback",
	// коли вони з'являються на екрані.
	// Якщо такого скрипта немає, вам потрібно буде реалізувати IntersectionObserver
	// самостійно, щоб викликати `initAndAnimateCounters` у потрібний момент.

	// Слухаємо кастомну подію від "спостерігача"
	document.addEventListener("watcherCallback", handleWatcherCallback);

	// На випадок, якщо елемент вже видимий при завантаженні сторінки
	// (якщо ваш спостерігач не обробляє це), можна додати перевірку:
	// document.querySelectorAll("[data-watch]").forEach(watchedElement => {
	//    // Тут потрібна логіка перевірки початкової видимості,
	//    // що виходить за рамки простої анімації лічильника.
	//    // Зазвичай це робить сам скрипт "спостерігача".
	// });

}

// Запускаємо налаштування анімованих лічильників
// Краще викликати після завантаження DOM
document.addEventListener('DOMContentLoaded', animatedCounters);

// ===== PHONE INPUT MASK (IMASK) =================================================

import IMask from 'imask';

const elementMask = document.getElementById('phone-mask');

if (elementMask) {
	const maskOptions = {
		mask: '+{972} 00 000 0000'
	};
	const mask = IMask(elementMask, maskOptions);
}


// ================================================================================

// ===== TIME SELECTION (APPOINTMENT BOOKING) =====================================

const timeInput = document.querySelector('#time-input');
const selectPnl = document.querySelector('.date-step__time-list');
const timeContainer = document.querySelector('.date-step__time');
const timeInpItems = document.querySelectorAll('.date-step__time-option.available');

if (timeInput) {
	timeInput.addEventListener("focus", function (e) {
		// show selection panel
		selectPnl.classList.remove('inactive');

		// selecting of time-element
		timeInpItems.forEach(element => {
			element.addEventListener("click", function (e) {
				timeInput.value = element.innerHTML;

				selectPnl.classList.add('inactive');
			});
		});

		// close sel panel after clicking out of panel
		handleClickOutside(timeContainer, () => {
			selectPnl.classList.add('inactive');
		});
	});
}

// Функція для перевірки кліку поза елементом
function handleClickOutside(element, callback) {
	document.addEventListener('click', (event) => {
		if (!element.contains(event.target)) {
			callback();
		}
	});
}

// ================================================================================

// ===== PAGE-FORM (APPOINT-BOOKING) ==============================================

function initStepForm() {
	const form = document.querySelector('.page-form__body');
	const steps = document.querySelectorAll('.page-form__step');
	const prevBtn = document.querySelector('.page-form__prev');
	const nextBtn = document.querySelector('.page-form__next');
	const btnsBlock = document.querySelector('.page-form__btns');
	const finishBlock = document.querySelector('.appoint-finish');
	const stepIndicators = document.querySelectorAll('.indic-panel__step');
	const progressLines = document.querySelectorAll('.indic-panel__progr-line');
	const inputDate = document.querySelector('.input-date');
	const inputTime = document.querySelector('.input-time');
	const inputPhone = document.querySelector('.input-phone');

	form.addEventListener("submit", (e => e.preventDefault()));

	let formStepIndex = 0;

	prevBtn.addEventListener("click", () => {
		if (formStepIndex < stepIndicators.length) {
			stepIndicators[formStepIndex].classList.remove('complete');
		}
		if (formStepIndex > 0 && (formStepIndex - 1) < progressLines.length) {
			progressLines[formStepIndex - 1].classList.remove('animate');
		}

		formStepIndex--;
		updateFormSteps();
	});

	// ЄДИНИЙ ОБРОБНИК для nextBtn
	nextBtn.addEventListener("click", () => {
		if (formStepIndex < (steps.length - 1)) {
			if (steps[formStepIndex].classList.contains('date-step')) {
				if (inputDate.value.length > 0 && inputTime.value.length > 0) {
					inputTime.classList.remove('_error');
					inputDate.classList.remove('_error');
					makeNextStep();
				} else {
					inputTime.classList.add('_error');
					inputDate.classList.add('_error');
				}
			} else {
				makeNextStep();
			}
		}

		else if (formStepIndex === (steps.length - 1) && inputPhone.value.length > 0) {

			if (formStepIndex < stepIndicators.length) {
				stepIndicators[formStepIndex].classList.add('complete');
			}

			finishBlock.style.display = "grid";
			if (steps[formStepIndex]) {
				steps[formStepIndex].classList.remove("active");
			}
			btnsBlock.style.display = "none";

		}
	});

	function updateFormSteps() {
		steps.forEach(step => {
			step.classList.contains("active") && step.classList.remove("active");
		});

		if (steps[formStepIndex]) {
			steps[formStepIndex].classList.add("active");
		}


		if (formStepIndex === 0) {
			prevBtn.style.display = "none";
		} else {
			prevBtn.style.display = "block";
		}

		if (formStepIndex === steps.length - 1) {
			nextBtn.innerHTML = "Submit";
		} else {
			nextBtn.innerHTML = "Next";
		}

	}

	function makeNextStep() {
		// Позначаємо поточний крок як завершений перед переходом
		if (formStepIndex < stepIndicators.length) { // Перевірка меж
			stepIndicators[formStepIndex].classList.add('complete');
		}
		if (formStepIndex < progressLines.length) { // Перевірка меж для progressLines
			progressLines[formStepIndex].classList.add('animate');
		}

		formStepIndex++;
		updateFormSteps();
	}

	updateFormSteps();
}

if (document.querySelector(".page-form__body")) {
	initStepForm();
}

// ================================================================================