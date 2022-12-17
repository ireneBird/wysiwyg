const value = document.getElementById('value');
const menu = document.getElementById('menu');

function toggleMenu() {
  menu?.classList.toggle('dropdown__menu_hide');
}

function chooseStyle(currentBtn) {
  if (value) {
    const curValue = currentBtn.getAttribute('value');
    console.log(curValue);
    value.innerHTML = curValue;
    menu?.classList.add('dropdown__menu_hide');
  }
}
