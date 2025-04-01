// Підключення функціоналу "Чертоги Фрілансера"
import { isMobile } from "./functions.js";
// Підключення списку активних модулів
import { flsModules } from "./modules.js";

// ==================================================================================
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

// ==================================================================================
// NUMBERS COUNTING (with smooth ending & timeout of '+', '%' appearance)

document.addEventListener("DOMContentLoaded", () => {
	const counters = document.querySelectorAll("[data-digits-counter]");
	const numbersSpan = document.querySelectorAll('.numbers__num span');

	function easeOutQuad(t) {
		return t * (2 - t); // Функція для плавного уповільнення
	}

	function animateCounter(counter) {
		const duration = parseInt(counter.dataset.digitsCounterSpeed) || 2000;
		const format = counter.dataset.digitsCounterFormat || "";
		const target = parseInt(counter.textContent.replace(/,/g, ""));
		let start = 0;
		let startTime = null;

		function updateCounter(timestamp) {
			if (!startTime) startTime = timestamp;
			const elapsed = timestamp - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const easedProgress = easeOutQuad(progress); // Використовуємо easing
			const value = Math.floor(easedProgress * target);
			counter.textContent = formatNumber(value, format);

			if (progress < 1) {
				requestAnimationFrame(updateCounter);
			}
		}
		requestAnimationFrame(updateCounter);

		setTimeout(() => {
			numbersSpan.forEach(span => {
				span.style.opacity = '1';
			});
		}, 1700);
	}

	function formatNumber(num, format) {
		return format === "," ? num.toLocaleString() : num;
	}

	function startCounters() {
		counters.forEach(counter => {
			counter.style.opacity = "1"; // Відновлення перед анімацією
			animateCounter(counter);
		});
	}

	const observer = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				startCounters();
				observer.unobserve(entry.target);
			}
		});
	}, { threshold: 0.5 });

	if (counters) {
		counters.forEach(counter => observer.observe(counter));
	}
});