import { auth, getUserRole, onAuthStateChanged, logout } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        const navSection = document.querySelector('.nav-right.desktop-only');
        if (user && navSection) {
            const role = await getUserRole(user.uid);
            
            navSection.id = 'nav-user-section';
            let navHtml = `<span style="margin-right: 15px; font-weight: 600; font-size: 0.875rem; color: var(--color-text);">${user.displayName ? user.displayName.split(' ')[0] : 'Usuario'}</span>`;
            if (role === 'agente' || role === 'admin') {
                navHtml += `<a href="agent-dashboard.html" class="btn" style="background: var(--color-primary); color: white; border: none; padding: 6px 14px; margin-right: 15px; font-size: 0.875rem; border-radius: 4px; text-decoration: none;">Mi Panel</a>`;
            }
            navHtml += `<button id="nav-logout-btn-global" class="btn" style="background: transparent; color: var(--color-text); border: 1px solid #ccc; padding: 6px 14px; font-size: 0.875rem; border-radius: 4px; cursor: pointer;">Cerrar Sesión</button>`;
            navSection.innerHTML = navHtml;

            document.getElementById('nav-logout-btn-global').addEventListener('click', async () => {
                await logout();
                window.location.reload();
            });
        }
    });
});
