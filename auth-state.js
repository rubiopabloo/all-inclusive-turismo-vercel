import { auth, getUserRole, onAuthStateChanged, logout } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, async (user) => {
        const navSection = document.querySelector('.nav-right.desktop-only');
        if (user && navSection) {
            const role = await getUserRole(user.uid);
            
            navSection.id = 'nav-user-section';
            let navHtml = `<div style="display:flex; align-items:center;">
                <span class="nav-user-name">${user.displayName ? user.displayName.split(' ')[0] : 'Usuario'}</span>`;
            if (role === 'agente' || role === 'admin') {
                navHtml += `<a href="agent-dashboard.html" class="btn btn-primary" style="padding: 8px 16px; font-size: 0.875rem; margin-right: 12px; border-radius: 6px;">Mi Panel</a>`;
            }
            navHtml += `<button id="nav-logout-btn-global" class="btn btn-outline nav-logout-btn" style="padding: 8px 16px; font-size: 0.875rem; border-radius: 6px;">Cerrar Sesión</button>
            </div>`;
            navSection.innerHTML = navHtml;

            document.getElementById('nav-logout-btn-global').addEventListener('click', async () => {
                await logout();
                window.location.reload();
            });
        }
    });
});
