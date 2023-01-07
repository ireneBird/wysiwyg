// let menu;
//
// function toggleMenu(idDropdown) {
//   menu = idDropdown;
//   menu?.classList.toggle('dropdown__menu_hide');
// }
//
// function selectOption(currentBtn) {
//   const parent = currentBtn.parentNode.parentNode.parentNode;
//
//   parent.childNodes[0].innerHTML = currentBtn.getAttribute('value');
//   menu?.classList.add('dropdown__menu_hide');
// }
//
// window.onclick = function (event) {
//   if (!event.target.matches('.dropdown__btn')) {
//     const dropdowns = document.getElementsByClassName('dropdown__menu');
//
//     for (let i = 0; i < dropdowns.length; i++) {
//       const openDropdown = dropdowns[i];
//       if (!openDropdown.classList.contains('dropdown__menu_hide')) {
//         openDropdown.classList.add('dropdown__menu_hide');
//       }
//     }
//   }
// };
