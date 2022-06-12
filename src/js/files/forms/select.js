//----- Импорт зависимостей ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
import { isMobile, _slideUp, _slideDown, _slideToggle } from "../functions.js";

// Подключение файла стилей
// Базовые стили поключаются в src/scss/forms.scss
// Файл базовых стилей src/scss/forms/select.scss

/*
Документация:
Снипет (HTML): sel
*/
/*
// Настройки
Для селекта (select):
class="имя класса" - модификатор к конкретному селекту
multiple - мультивыбор
data-tags - режим тегов, только для (только для multiple)
data-scroll - включит прокрутку для выпадающего списка, дополнительно можно подключить кастомный скролл simplebar в app.js. Указанное число для атрибута ограничит высоту
data-checkbox - стилизация элементов по checkbox (только для multiple)
data-show-selected - отключает скрытие выбранного элемента
data-search - позволяет искать по выпадающему списку
data-open - селект открыт сразу

Для плейсхолдера (Плейсхолдер - это option с value=""):
data-label для плейсхолдера, добавляет label к селекту
data-show для плейсхолдера, показывает его в списке (только для единичного выбора)

Для элемента (option):
data-class="имя класса" - добавляет класс
data-asset="путь к картинке или текст" - добавляет структуру 2х колонок и данными
*/

/*
// Возможные доработки:
попап на мобилке
*/

// Получение всех select на странице
const selectItems = document.querySelectorAll('select');
// Объект построения Select
export const selectModule = {
	// CSS классы модуля
	selectClasses: {
		classSelect: "select", // Главный блок
		classSelectBody: "select__body", // Тело селекта
		classSelectTitle: "select__title", // Заголовок
		classSelectValue: "select__value", // Значение в заголовке
		classSelectLabel: "select__label", // Лабел
		classSelectInput: "select__input", // Поле ввода
		classSelectText: "select__text", // Оболочка текстовых данных
		classSelectOptions: "select__options", // Выпадающий список
		classSelectOptionsScroll: "select__scroll", // Оболочка при скролле
		classSelectOption: "select__option", // Пункт
		classSelectContent: "select__content", // Оболочка контента в заголовке
		classSelectRow: "select__row", // Ряд
		classSelectData: "select__asset", // Дополнительные данные
		classSelectDisabled: "_select-disabled", // Запрешен
		classSelectTag: "_select-tag", // Класс тега
		classSelectOpen: "_select-open", // Список открыт
		classSelectActive: "_select-active", // Список выбран
		classSelectFocus: "_select-focus", // Список в фокусе
		classSelectMultiple: "_select-multiple", // Мультивыбор
		classSelectCheckBox: "_select-checkbox", // Стиль чекбокса
		classSelectOptionSelected: "_select-selected", // Выбранный пункт
	},
	// Конструктор CSS класса
	getSelectClass(className) {
		return `.${className}`;
	},
	// Геттер элементов псевдоселекта
	getSelectElement(selectItem, className) {
		return {
			originalSelect: selectItem.querySelector('select'),
			selectElement: selectItem.querySelector(selectModule.getSelectClass(className)),
		}
	},
	// Функция инициализации всех селектов
	selectsInit(selectItems) {
		selectItems.forEach((originalSelect, index) => {
			originalSelect.dataset.id = index;
			selectModule.selectInit(originalSelect);
		});
		// Обработчики событий...
		// ...при клике
		document.addEventListener('click', selectModule.selectsActions);
		// ...при нажатии клавиши
		document.addEventListener('keydown', selectModule.selectsActions);
		// ...при фокусе
		document.addEventListener('focusin', selectModule.selectsActions);
		// ...при потере фокуса
		document.addEventListener('focusout', selectModule.selectsActions);
	},
	// Функция инициализации конкретного селекта
	selectInit(originalSelect) {
		// Создаем оболочку
		let selectItem = document.createElement("div");
		selectItem.classList.add(selectModule.selectClasses.classSelect);
		// Выводим оболочку перед оригинальным селектом
		originalSelect.parentNode.insertBefore(selectItem, originalSelect);
		// Помещаем оригинальный селект в оболочку
		selectItem.appendChild(originalSelect);
		// Скрываем оригинальный селект
		originalSelect.hidden = true;

		// Конструктор косновных элементов
		selectItem.insertAdjacentHTML('beforeend', `<div class="${selectModule.selectClasses.classSelectBody}"><div hidden class="${selectModule.selectClasses.classSelectOptions}"></div></div>`);
		// Запускаем конструктор псевдоселекта
		selectModule.selectBuild(originalSelect);

		// Работа с плейсхолдером
		if (selectModule.getSelectPlaceholder(originalSelect)) {
			// Запоминаем плейсхолдер
			originalSelect.dataset.placeholder = selectModule.getSelectPlaceholder(originalSelect).value;
			// Если включен режим label
			if (selectModule.getSelectPlaceholder(originalSelect).label.show) {
				const selectItemTitle = selectModule.getSelectElement(selectItem, selectModule.selectClasses.classSelectTitle).selectElement;
				selectItemTitle.insertAdjacentHTML('afterbegin', `<span class="${selectModule.selectClasses.classSelectLabel}">${selectModule.getSelectPlaceholder(originalSelect).label.text ? selectModule.getSelectPlaceholder(originalSelect).label.text : selectModule.getSelectPlaceholder(originalSelect).value}</span>`);
			}
		}
		// Запоминаем скорость
		originalSelect.dataset.speed = originalSelect.dataset.speed ? originalSelect.dataset.speed : "150";
		// Событие при изменении оригинального select
		originalSelect.addEventListener('change', selectModule.selectChange);
	},
	// Конструктор псевдоселекта
	selectBuild(originalSelect) {
		const selectItem = originalSelect.parentElement;
		// Добавляем ID селекта
		selectItem.dataset.id = originalSelect.dataset.id;
		// Получаем класс оригинального селекта, создаем модификатор и добавляем его
		selectItem.classList.add(originalSelect.getAttribute('class') ? `select_${originalSelect.getAttribute('class')}` : "");
		// Если множественный выбор, добавляем класс
		originalSelect.multiple ? selectItem.classList.add(selectModule.selectClasses.classSelectMultiple) : selectItem.classList.remove(selectModule.selectClasses.classSelectMultiple);
		// Cтилизация элементов под checkbox (только для multiple)
		originalSelect.hasAttribute('data-checkbox') && originalSelect.multiple ? selectItem.classList.add(selectModule.selectClasses.classSelectCheckBox) : selectItem.classList.remove(selectModule.selectClasses.classSelectCheckBox);
		// Сеттер значения заголовка селекта
		selectModule.setSelectTitleValue(selectItem, originalSelect);
		// Сеттер элементов списка (options)
		selectModule.setOptions(selectItem, originalSelect);
		// Если включена опция поиска data-search, запускаем обработчик
		originalSelect.hasAttribute('data-search') ? selectModule.searchActions(selectItem) : null;
		// Если указана настройка data-open, открываем селект
		originalSelect.hasAttribute('data-open') ? selectModule.selectAction(selectItem) : null;
		// Обработчик disabled
		selectModule.selectDisabled(selectItem, originalSelect);
	},
	// Функция реакций на события
	selectsActions(e) {
		const targetElement = e.target;
		const targetType = e.type;
		if (targetElement.closest(selectModule.getSelectClass(selectModule.selectClasses.classSelect)) || targetElement.closest(selectModule.getSelectClass(selectModule.selectClasses.classSelectTag))) {
			const selectItem = targetElement.closest('.select') ? targetElement.closest('.select') : document.querySelector(`.${selectModule.selectClasses.classSelect}[data-id="${targetElement.closest(selectModule.getSelectClass(selectModule.selectClasses.classSelectTag)).dataset.selectId}"]`);
			const originalSelect = selectModule.getSelectElement(selectItem).originalSelect;
			if (targetType === 'click') {
				if (!originalSelect.disabled) {
					if (targetElement.closest(selectModule.getSelectClass(selectModule.selectClasses.classSelectTag))) {
						// Обработка клика на тег
						const targetTag = targetElement.closest(selectModule.getSelectClass(selectModule.selectClasses.classSelectTag));
						const optionItem = document.querySelector(`.${selectModule.selectClasses.classSelect}[data-id="${targetTag.dataset.selectId}"] .select__option[data-value="${targetTag.dataset.value}"]`);
						selectModule.optionAction(selectItem, originalSelect, optionItem);
					} else if (targetElement.closest(selectModule.getSelectClass(selectModule.selectClasses.classSelectTitle))) {
						// Обработка клика на заголовок селекта
						selectModule.selectAction(selectItem);
					} else if (targetElement.closest(selectModule.getSelectClass(selectModule.selectClasses.classSelectOption))) {
						// Обработка клика на элемент селекта
						const optionItem = targetElement.closest(selectModule.getSelectClass(selectModule.selectClasses.classSelectOption));
						selectModule.optionAction(selectItem, originalSelect, optionItem);
					}
				}
			} else if (targetType === 'focusin' || targetType === 'focusout') {
				if (targetElement.closest(selectModule.getSelectClass(selectModule.selectClasses.classSelect))) {
					targetType === 'focusin' ? selectItem.classList.add(selectModule.selectClasses.classSelectFocus) : selectItem.classList.remove(selectModule.selectClasses.classSelectFocus);
				}
			} else if (targetType === 'keydown' && e.code === 'Escape') {
				selectModule.selectsСlose();
			}
		} else {
			selectModule.selectsСlose();
		}
	},
	// Функция закрытия всех селектов
	selectsСlose() {
		const selectActiveItems = document.querySelectorAll(`${selectModule.getSelectClass(selectModule.selectClasses.classSelect)}${selectModule.getSelectClass(selectModule.selectClasses.classSelectOpen)}`);
		if (selectActiveItems.length) {
			selectActiveItems.forEach(selectActiveItem => {
				selectModule.selectAction(selectActiveItem);
			});
		}
	},
	// Функция открытия/закрытия конкретного селекта
	selectAction(selectItem) {
		const originalSelect = selectModule.getSelectElement(selectItem).originalSelect;
		const selectOptions = selectModule.getSelectElement(selectItem, selectModule.selectClasses.classSelectOptions).selectElement;
		if (!selectOptions.classList.contains('_slide')) {
			selectItem.classList.toggle(selectModule.selectClasses.classSelectOpen);
			_slideToggle(selectOptions, originalSelect.dataset.speed);
		}
	},
	// Сеттер значения заголовка селекта
	setSelectTitleValue(selectItem, originalSelect) {
		const selectItemBody = selectModule.getSelectElement(selectItem, selectModule.selectClasses.classSelectBody).selectElement;
		const selectItemTitle = selectModule.getSelectElement(selectItem, selectModule.selectClasses.classSelectTitle).selectElement;
		if (selectItemTitle) selectItemTitle.remove();
		selectItemBody.insertAdjacentHTML("afterbegin", selectModule.getSelectTitleValue(selectItem, originalSelect));
	},
	// Конструктор значения заголовка
	getSelectTitleValue(selectItem, originalSelect) {
		// Получаем выбранные текстовые значения
		let selectTitleValue = selectModule.getSelectedOptionsData(originalSelect, 2).html;
		// Обработка значений мультивыбора
		// Если включен режим тегов (указана настройка data-tags)
		if (originalSelect.multiple && originalSelect.hasAttribute('data-tags')) {
			selectTitleValue = selectModule.getSelectedOptionsData(originalSelect).elements.map(option => `<span role="button" data-select-id="${selectItem.dataset.id}" data-value="${option.value}" class="_select-tag">${selectModule.getSelectElementContent(option)}</span>`).join('');
			// Если вывод тегов во внешний блок
			if (originalSelect.dataset.tags && document.querySelector(originalSelect.dataset.tags)) {
				document.querySelector(originalSelect.dataset.tags).innerHTML = selectTitleValue;
				if (originalSelect.hasAttribute('data-search')) selectTitleValue = false;
			}
		}
		// Значение(я) или плейсхолдер
		selectTitleValue = selectTitleValue.length ? selectTitleValue : originalSelect.dataset.placeholder;
		// Если есть значение, добавляем класс
		selectModule.getSelectedOptionsData(originalSelect).values.length ? selectItem.classList.add(selectModule.selectClasses.classSelectActive) : selectItem.classList.remove(selectModule.selectClasses.classSelectActive);
		// Возвращаем поле ввода для поиска или текст
		if (originalSelect.hasAttribute('data-search')) {
			// Выводим поле ввода для поиска

			return `<div class="${selectModule.selectClasses.classSelectTitle}"><span class="${selectModule.selectClasses.classSelectValue}"><input autocomplete="off" type="text" placeholder="${selectTitleValue}" data-placeholder="${selectTitleValue}" class="${selectModule.selectClasses.classSelectInput}"></span></div>`;
		} else {
			// Если выбран элемент со своим классом
			const customClass = selectModule.getSelectedOptionsData(originalSelect).elements.length && selectModule.getSelectedOptionsData(originalSelect).elements[0].dataset.class ? ` ${selectModule.getSelectedOptionsData(originalSelect).elements[0].dataset.class}` : '';
			// Выводим текстовое значение
			return `<button type="button" class="${selectModule.selectClasses.classSelectTitle}"><span class="${selectModule.selectClasses.classSelectValue}"><span class="${selectModule.selectClasses.classSelectContent}${customClass}">${selectTitleValue}</span></span></button>`;
		}
	},
	// Конструктор данных для значения заголовка
	getSelectElementContent(selectOption) {
		// Если для элемента указан вывод картинки или текста, перестраиваем конструкцию
		const selectOptionData = selectOption.dataset.asset ? `${selectOption.dataset.asset}` : '';
		const selectOptionDataHTML = selectOptionData.indexOf('img') >= 0 ? `<img src="${selectOptionData}" alt="">` : selectOptionData;
		let selectOptionContentHTML = ``;
		selectOptionContentHTML += selectOptionData ? `<span class="${selectModule.selectClasses.classSelectRow}">` : '';
		selectOptionContentHTML += selectOptionData ? `<span class="${selectModule.selectClasses.classSelectData}">` : '';
		selectOptionContentHTML += selectOptionData ? selectOptionDataHTML : '';
		selectOptionContentHTML += selectOptionData ? `</span>` : '';
		selectOptionContentHTML += selectOptionData ? `<span class="${selectModule.selectClasses.classSelectText}">` : '';
		selectOptionContentHTML += selectOption.textContent;
		selectOptionContentHTML += selectOptionData ? `</span>` : '';
		selectOptionContentHTML += selectOptionData ? `</span>` : '';
		return selectOptionContentHTML;
	},
	// Получение данных плейсхолдера
	getSelectPlaceholder(originalSelect) {
		const selectPlaceholder = Array.from(originalSelect.options).find(option => !option.value);
		if (selectPlaceholder) {
			return {
				value: selectPlaceholder.textContent,
				show: selectPlaceholder.hasAttribute("data-show"),
				label: {
					show: selectPlaceholder.hasAttribute("data-label"),
					text: selectPlaceholder.dataset.label
				}
			}
		}
	},
	// Получение данных из выбранных элементов
	getSelectedOptionsData(originalSelect, type) {
		// Получаем все выбранные объекты из select
		let selectedOptions = [];
		if (originalSelect.multiple) {
			// Если мультивыбор
			// Убираем плейсхолдер, получаем остальные выбранные элементы
			selectedOptions = Array.from(originalSelect.options).filter(option => option.value).filter(option => option.selected);
		} else {
			// Если единичный выбор
			selectedOptions.push(originalSelect.options[originalSelect.selectedIndex]);
		}
		return {
			elements: selectedOptions.map(option => option),
			values: selectedOptions.filter(option => option.value).map(option => option.value),
			html: selectedOptions.map(option => selectModule.getSelectElementContent(option))
		}
	},
	// Конструктор элементов списка
	getOptions(originalSelect) {
		// Настрока скролла элементов
		let selectOptionsScroll = originalSelect.hasAttribute('data-scroll') ? `data-simplebar` : '';
		let selectOptionsScrollHeight = originalSelect.dataset.scroll ? `style="max-height:${originalSelect.dataset.scroll}px"` : '';
		// Получаем элементы списка
		let selectOptions = Array.from(originalSelect.options);
		if (selectOptions.length > 0) {
			let selectOptionsHTML = ``;
			// Если указана настройка data-show, показываем плейсхолдер в списке
			if ((selectModule.getSelectPlaceholder(originalSelect) && !selectModule.getSelectPlaceholder(originalSelect).show) || originalSelect.multiple) {
				selectOptions = selectOptions.filter(option => option.value);
			}
			// Строим и выводим основную конструкцию
			selectOptionsHTML += selectOptionsScroll ? `<div ${selectOptionsScroll} ${selectOptionsScrollHeight} class="${selectModule.selectClasses.classSelectOptionsScroll}">` : '';
			selectOptions.forEach(selectOption => {
				// Получаем конструкцию конкретного элемента списка
				selectOptionsHTML += selectModule.getOption(selectOption, originalSelect);
			});
			selectOptionsHTML += selectOptionsScroll ? `</div>` : '';
			return selectOptionsHTML;
		}
	},
	// Конструктор конкретного элемента списка
	getOption(selectOption, originalSelect) {
		// Если элемент выбран и включен режим мультивыбора, добавляем класс
		const selectOptionSelected = selectOption.selected && originalSelect.multiple ? ` ${selectModule.selectClasses.classSelectOptionSelected}` : '';
		// Если элемент выбрани нет настройки data-show-selected, скрываем элемент
		const selectOptionHide = selectOption.selected && !originalSelect.hasAttribute('data-show-selected') ? `hidden` : ``;
		// Если для элемента указан класс добавляем
		const selectOptionClass = selectOption.dataset.class ? ` ${selectOption.dataset.class}` : '';
		// Строим и возвращаем конструкцию элемента
		let selectOptionHTML = ``;
		selectOptionHTML += `<button ${selectOptionHide} class="${selectModule.selectClasses.classSelectOption}${selectOptionClass}${selectOptionSelected}" data-value="${selectOption.value}" type="button">`;
		selectOptionHTML += selectModule.getSelectElementContent(selectOption);
		selectOptionHTML += `</button>`;
		return selectOptionHTML;
	},
	// Сеттер элементов списка (options)
	setOptions(selectItem, originalSelect) {
		// Получаем объект тела псевдоселекта
		const selectItemOptions = selectModule.getSelectElement(selectItem, selectModule.selectClasses.classSelectOptions).selectElement;
		// Запускаем конструктор элементов списка (options) и добавляем в тело псевдоселекта
		selectItemOptions.innerHTML = selectModule.getOptions(originalSelect);
	},
	// Обработчик клика на элемент списка
	optionAction(selectItem, originalSelect, optionItem) {
		if (originalSelect.multiple) { // Если мультивыбор
			// Выделяем классом элемент
			optionItem.classList.toggle(selectModule.selectClasses.classSelectOptionSelected);
			// Очищаем выбранные элементы 
			const originalSelectSelectedItems = selectModule.getSelectedOptionsData(originalSelect).elements;
			originalSelectSelectedItems.forEach(originalSelectSelectedItem => {
				originalSelectSelectedItem.removeAttribute('selected');
			});
			// Выбираем элементы 
			const selectSelectedItems = selectItem.querySelectorAll(selectModule.getSelectClass(selectModule.selectClasses.classSelectOptionSelected));
			selectSelectedItems.forEach(selectSelectedItems => {
				originalSelect.querySelector(`option[value="${selectSelectedItems.dataset.value}"]`).setAttribute('selected', 'selected');
			});
		} else { // Если единичный выбор
			// Если не указана настройка data-show-selected, скрываем выбранный элемент
			if (!originalSelect.hasAttribute('data-show-selected')) {
				// Сначала все показать
				if (selectItem.querySelector(`${selectModule.getSelectClass(selectModule.selectClasses.classSelectOption)}[hidden]`)) {
					selectItem.querySelector(`${selectModule.getSelectClass(selectModule.selectClasses.classSelectOption)}[hidden]`).hidden = false;
				}
				// Скрываем выбранную
				optionItem.hidden = true;
			}
			originalSelect.value = optionItem.hasAttribute('data-value') ? optionItem.dataset.value : optionItem.textContent;
			selectModule.selectAction(selectItem);
		}
		// Обновляем заголовок селекта
		selectModule.setSelectTitleValue(selectItem, originalSelect);
		// Вызываем реакцию на изменение селекта
		selectModule.setSelectChange(originalSelect);
	},
	// Реакция на измененение оригинального select
	selectChange(e) {
		selectModule.selectBuild(e.target);
		selectModule.setSelectChange(e.target);
	},
	// Обработчик изменения в селекте
	setSelectChange(originalSelect) {
		const selectItem = originalSelect.parentElement;
		// Вызов коллбэк функции
		selectModule.selectCallback(selectItem, originalSelect);
	},
	// Обработчик disabled
	selectDisabled(selectItem, originalSelect) {
		if (originalSelect.disabled) {
			selectItem.classList.add(selectModule.selectClasses.classSelectDisabled);
			selectModule.getSelectElement(selectItem, selectModule.selectClasses.classSelectTitle).selectElement.disabled = true;
		} else {
			selectItem.classList.remove(selectModule.selectClasses.classSelectDisabled);
			selectModule.getSelectElement(selectItem, selectModule.selectClasses.classSelectTitle).selectElement.disabled = false;
		}
	},
	// Обработчик поиска по элементам списка
	searchActions(selectItem) {
		const originalSelect = selectModule.getSelectElement(selectItem).originalSelect;
		const selectInput = selectModule.getSelectElement(selectItem, selectModule.selectClasses.classSelectInput).selectElement;
		const selectOptions = selectModule.getSelectElement(selectItem, selectModule.selectClasses.classSelectOptions).selectElement;
		const selectOptionsItems = selectOptions.querySelectorAll(`.${selectModule.selectClasses.classSelectOption}`);
		selectInput.addEventListener("input", function (e) {
			selectOptionsItems.forEach(selectOptionsItem => {
				if (selectOptionsItem.textContent.toUpperCase().indexOf(selectInput.value.toUpperCase()) >= 0) {
					selectOptionsItem.hidden = false;
				} else {
					selectOptionsItem.hidden = true;
				}
			});
			// Если список закрыт открываем
			selectOptions.hidden === true ? selectModule.selectAction(selectItem) : null;
		});
	},
	// Коллбэк функция
	selectCallback(selectItem, originalSelect) { },
	// Логгинг в консоль
	setLogging(message) {
		console.log(`[select - info] ${message} `);
	}
}
// Запуск инициализации
selectItems.length ? selectModule.selectsInit(selectItems) : selectModule.setLogging('Нет ни одного select, модуль можно отключить');