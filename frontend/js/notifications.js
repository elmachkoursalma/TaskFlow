const token = localStorage.getItem('token');

// Rediriger si pas connecté
if (!token) {
  window.location.href = '/login.html';
}

// Ajouter le token à toutes les requêtes
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Bouton déconnexion
document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
});

// ── 1. Charger les notifications depuis le serveur ──
async function loadNotifications() {
  try {
    const { data } = await axios.get('/api/notifications');

    // Récupérer les notifications lues depuis LocalStorage
    const luesLocal = JSON.parse(localStorage.getItem('notifications_lues') || '[]');

    const list = document.getElementById('notificationsList');
    const empty = document.getElementById('empty');
    const badge = document.getElementById('badge');

    list.innerHTML = '';

    if (data.length === 0) {
      empty.style.display = 'block';
      badge.style.display = 'none';
      return;
    }

    empty.style.display = 'none';

    // Compter les non lues
    const nonLues = data.filter(n => !n.lu && !luesLocal.includes(n._id));
    
    // Mettre à jour le badge
    if (nonLues.length > 0) {
      badge.style.display = 'flex';
      badge.textContent = nonLues.length;
    } else {
      badge.style.display = 'none';
    }

    // Afficher chaque notification
    data.forEach(notification => {
      const estLue = notification.lu || luesLocal.includes(notification._id);
      const date = new Date(notification.createdAt).toLocaleDateString('fr-FR');

      const div = document.createElement('div');
      div.className = `notification ${estLue ? 'lu' : ''}`;
      div.innerHTML = `
        <div>
          <p>${notification.message}</p>
          <small>${date}</small>
        </div>
        <button 
          class="btn-read" 
          onclick="marquerLue('${notification._id}')"
          ${estLue ? 'disabled' : ''}>
          ${estLue ? 'Lu' : 'Marquer comme lu'}
        </button>
      `;
      list.appendChild(div);
    });

  } catch (error) {
    console.error('Erreur chargement notifications:', error);
  }
}

// ── 2. Marquer une notification comme lue ──
async function marquerLue(id) {
  try {
    await axios.patch(`/api/notifications/${id}/read`);

    // Archiver dans LocalStorage
    const luesLocal = JSON.parse(localStorage.getItem('notifications_lues') || '[]');
    if (!luesLocal.includes(id)) {
      luesLocal.push(id);
      localStorage.setItem('notifications_lues', JSON.stringify(luesLocal));
    }

    // Recharger les notifications
    loadNotifications();

  } catch (error) {
    console.error('Erreur marquage notification:', error);
  }
}

// ── 3. Polling toutes les 30 secondes ──
loadNotifications();
setInterval(loadNotifications, 30000);