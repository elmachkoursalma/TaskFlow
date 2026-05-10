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
async function createProject(title, description, deadline) {
  try {
    await axios.post(`${API}/projects`, { title, description, deadline });
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

// Charger au démarrage
loadProjects();