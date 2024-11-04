document.getElementById('menu-toggle').onclick = function() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar.style.left === '0px') {
        sidebar.style.left = '-250px'; // Sidebar ausblenden
    } else {
        sidebar.style.left = '0px'; // Sidebar einblenden
    }
};
