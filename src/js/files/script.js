/* ######################################################## IMPORT OF FUNCIONALITY ######################################################## */

// import { isMobile } from "./functions.js";
import { _slideUp } from "./functions.js";
import { _slideDown } from "./functions.js";
import { _slideToggle } from "./functions.js";

/* ######################################################## MENU SORT ######################################################## */
const sortMenu = document.getElementById('sort');
const iconSort = document.getElementById('icon-sort');
const sortItems = document.querySelectorAll('.sort__item');

sortMenu.addEventListener('click', function(event){
    const target = event.target;
    const list = this.querySelector('.sort__list');
    const sortItem = this.querySelector('.sort__type');

    if (target.closest('.sort__btn')){
        list.classList.toggle('_open');
    }

    if (target.closest('.sort__item')){
        list.classList.remove('_open');
        sortItem.innerHTML = target.textContent;
        target.classList.add('_current-select');

        sortItems.forEach(el => {
            if (el !== target && el.classList.contains('_current-select')){
                el.classList.remove('_current-select');
            }
        });

        if (target.dataset.sort === 'ascending' && iconSort.classList.contains('_descending')){
            iconSort.classList.add('_ascending');
            iconSort.classList.remove('_descending');
        } else if (target.dataset.sort === 'descending' && iconSort.classList.contains('_ascending')) {
            iconSort.classList.remove('_ascending');
            iconSort.classList.add('_descending');
        }
    }
});

/* ######################################################## MENU SELECT ######################################################## */
const selectMenu = document.querySelectorAll('.select-menu');

selectMenu.forEach(el => {
	el.dataset.open = false;
	
    el.addEventListener('click', function(event){
        const target = event.target;
        const nav = this.querySelector('.select-menu__nav span');
        const list = this.querySelector('.select-menu__list');

		if (el.dataset.open === 'false'){
			el.classList.add('_open');
			_slideDown(list, 500);
			setTimeout(function(){
				el.dataset.open = true;
			}, 500);
		}

		if (el.dataset.open === 'true'){
			el.classList.remove('_open');
			if (target.closest('.select-menu__item')){
				el.classList.add('_selected');
				nav.innerHTML = target.textContent;
			}
			_slideUp(list, 500);
			setTimeout(function(){
				el.dataset.open = false;
			}, 500);
		}
    });
});

document.body.addEventListener('click', (event) => {
	const target = event.target;

	if (!target.closest('.selections-offers__wrapper')){
		selectMenu.forEach(el => {
			if (el.dataset.open === 'true'){
				const list = el.querySelector('.select-menu__list');
				el.classList.remove('_open');
				el.dataset.open = false;
				_slideUp(list, 500);
			}
		});
	}
});

/* ######################################################## EMAIL FIELD ######################################################## */
const subscriptWrapper = document.querySelector('.subscription__wrapper');
const subscriptInput = document.querySelector('.subscription__input');

subscriptInput.addEventListener('blur', function(event){
    const target = event.target;

    setTimeout(function(){
        if (!subscriptInput.classList.contains('_error')){
            subscriptWrapper.classList.add('_success');
        }
    }, 0);
});

/* ######################################################## ACCORDION ######################################################## */
const spollersItems = document.querySelectorAll('.spollers__item');

for (let i = 0; i < spollersItems.length; i++){
	spollersItems[i].addEventListener('click', function(event){
        const target = event.currentTarget;
		const _target = event.target;
		const body = spollersItems[i].querySelector('.spollers__body');

		if (_target.closest('.spollers__body')) {
			return;
		}

        spollersItems.forEach(el => {
            if (el !== target && el.classList.contains('_active')){
                el.classList.remove('_active')
            }
        });

        spollersItems[i].classList.toggle('_active');
    });
}