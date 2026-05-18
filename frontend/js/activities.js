const token = localStorage.getItem('token');
const projectId = new URLSearchParams(window.location.search).get('id');

async function loadActivities() {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/projects/${projectId}/activities`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const activities = response.data;
    const list = document.getElementById('activityList');
    list.innerHTML = '';

    if (activities.length === 0) {
      list.innerHTML = '<li>Aucune activité pour ce projet.</li>';
      return;
    }

    activities.forEach(act => {
      const li = document.createElement('li');
      li.textContent = formatActivity(act);
      list.appendChild(li);
    });

  } catch (err) {
    console.error('Erreur chargement activités:', err);
  }
}

function formatActivity(act) {
  const name = act.user?.fullName || 'Quelqu\'un';
  const time = timeAgo(new Date(act.createdAt));

  switch (act.type) {
    case 'task_created':
      return `${name} a créé la tâche "${act.meta?.taskTitle}" — ${time}`;
    case 'task_deleted':
      return `${name} a supprimé la tâche "${act.meta?.taskTitle}" — ${time}`;
    case 'status_changed':
      return `${name} a changé le statut de "${act.meta?.taskTitle}" : ${act.meta?.oldStatus} → ${act.meta?.newStatus} — ${time}`;
    case 'member_added':
      return `${name} a ajouté ${act.meta?.memberEmail} au projet — ${time}`;
    case 'member_removed':
      return `${name} a retiré ${act.meta?.memberEmail} du projet — ${time}`;
    case 'project_updated':
      return `${name} a modifié le projet — ${time}`;
    default:
      return `Action inconnue — ${time}`;
  }
}

function timeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  if (seconds < 60) return 'à l\'instant';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days} jour(s)`;
}

loadActivities();