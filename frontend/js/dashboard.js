// Vérifier si l'utilisateur est connecté
//Si l'utilisateur n'est pas connecté → il est redirigé automatiquement vers la page de login. Il ne peut pas accéder au dashboard sans être connecté.
const token = localStorage.getItem('token');

//Rediriger si pas connecté
//if (!token) {
//window.location.href = '/frontend/login.html';
//}

// Ajouter le token à toutes les requêtes Axios , Sans ça, le serveur refuserait la connexion car la route /api/dashboard est protégée.
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Bouton déconnexion :Quand l'utilisateur clique sur Déconnexion :Le token est supprimé du LocalStorage et Il est redirigé vers le login.
document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/frontend/login.html';})
async function loadDashboard() {
  try {
    const search = document.getElementById('searchInput').value;

    const status = document.getElementById('statusFilter').value;

    const priority = document.getElementById('priorityFilter').value;

    let query = '';

    if (search) {
      query += `search=${search}&`;
    }

    if (status) {
      query += `status=${status}&`;
    }

    if (priority) {
      query += `priority=${priority}&`;
    }

    const { data } = await axios.get(`http://localhost:5000/api/tasks?${query}`);
    // Remplir les 4 cartes
    //document.getElementById('activeProjects').textContent = data.activeProjects;
    //document.getElementById('assignedTasks').textContent  = data.assignedTasks;
    //document.getElementById('doneTasks').textContent      = data.doneTasks;
    //document.getElementById('overdueTasks').textContent   = data.overdueTasks;

    // Remplir le tableau des tâches
    const tbody = document.getElementById('taskList');
    tbody.innerHTML = '';

   if (data.data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color:#888;">Aucune tâche en cours</td></tr>';
      return;
    }

    data.data.forEach(task => {
      const deadline = task.deadline
        ? new Date(task.deadline).toLocaleDateString('fr-FR')
        : '—';

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${task.title}</td>
        <td><span class="badge ${task.priority}">${task.priority}</span></td>
        <td>${task.project?.title || '—'}</td>
        <td>${deadline}</td>
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error('Erreur chargement dashboard:', error);
    alert('Erreur lors du chargement du tableau de bord.');
  }
}//Si le serveur ne répond pas ou retourne une erreur, on affiche une alerte à l'utilisateur au lieu de laisser la page vide.

loadDashboard();