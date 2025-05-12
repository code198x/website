document.querySelector('.hamburger')?.addEventListener('click', () => {
    document.querySelector('header > nav')?.toggleAttribute('open');
});
