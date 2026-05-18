const API = 'http://localhost:5000/api';

// Configurer Axios avec le token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// CHARGER LES PROJETS
async function loadProjects(page = 1) {
  try {
    const response = await axios.get(`${API}/projects?page=${page}&limit=10`);
    const { data, total, totalPages } = response.data;

    const container = document.getElementById('projects-list');
    container.innerHTML = '';

    data.forEach(project => {
      container.innerHTML += `
        <div class="project-card">
          <h3>${project.title}</h3>
          <p>${project.description || ''}</p>
          <span class="status">${project.status}</span>
          <button onclick="openEditModal(
            '${project._id}',
            '${project.title}',
            '${project.description || ''}',
            '${project.deadline || ''}',
            '${project.status}'
          )">Modifier</button>
          <button class="btn-tasks" onclick="goToTasks('${project._id}')">Voir les tâches</button>
          <button onclick="deleteProject('${project._id}')">Supprimer</button>
        </div>
      `;
    });

    renderPagination(page, totalPages);

  } catch (error) {
    console.error('Erreur chargement projets:', error);
  }
}

// CRÉER UN PROJET
async function createProject() {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const deadline = document.getElementById('deadline').value;

  if (!title) {
    alert('Le titre est obligatoire');
    return;
  }

  try {
    await axios.post(`${API}/projects`, { title, description, deadline });
    // Vider les champs après création
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('deadline').value = '';
    loadProjects();
  } catch (error) {
    console.error('Erreur création projet:', error);
  }
}

// SUPPRIMER UN PROJET

async function deleteProject(id) {
  if (!confirm('Supprimer ce projet et toutes ses tâches ?')) return;
  try {
    await axios.delete(`${API}/projects/${id}`);
    loadProjects();
  } catch (error) {
    console.error('Erreur suppression projet:', error);
  }
}


let currentProjectId = null;
// Ouvrir le modal
function openEditModal(id, title, description, deadline, status) {
  currentProjectId = id;
  document.getElementById('edit-title').value = title;
  document.getElementById('edit-description').value = description || '';
  document.getElementById('edit-deadline').value = deadline ? deadline.split('T')[0] : '';
  document.getElementById('edit-status').value = status;
  document.getElementById('modal').classList.remove('hidden');
}

// Fermer le modal
function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  currentProjectId = null;
}

// Sauvegarder la modification
async function saveEdit() {
  const title = document.getElementById('edit-title').value;
  const description = document.getElementById('edit-description').value;
  const deadline = document.getElementById('edit-deadline').value;
  const status = document.getElementById('edit-status').value;

  try {
    await axios.put(`${API}/projects/${currentProjectId}`, {
      title, description, deadline, status
    });
    closeModal();
    loadProjects();
  } catch (error) {
    console.error('Erreur modification projet:', error);
  }
}

// PAGINATION
function renderPagination(currentPage, totalPages) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  for (let i = 1; i <= totalPages; i++) {
    pagination.innerHTML += `
      <button onclick="loadProjects(${i})" 
        ${i === currentPage ? 'disabled' : ''}>
        ${i}
      </button>
    `;
  }
}
function goToTasks(projectId) {
  window.location.href =`tasks.html?projectId=${projectId}`;
}

// Charger au démarrage
loadProjects();