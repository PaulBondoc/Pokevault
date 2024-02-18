let profileIcon = document.querySelectorAll('.profile-icon');
let currentIcon = document.getElementById('current-icon');
let headerIcon = document.getElementById('header-icon');

profileIcon.forEach(icon => {
    icon.addEventListener('click', () => {
        currentIcon.getAttribute('src');
        currentIcon.src = icon.getAttribute('src');
        headerIcon.src = icon.getAttribute('src');
    })
})