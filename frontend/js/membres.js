const token = localStorage.getItem('token');

// Rediriger si pas connecté
if (!token) {
  window.location.href = '/login.html';
}

// Ajouter le token à toutes les requêtes
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Récupérer le projectId depuis l'URL
// ex: members.html?projectId=64f3a2b1c
const params = new URLSearchParams(window.location.search);
const projectId = params.get('projectId');

// Bouton déconnexion
document.getElementById('logout').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/login.html';
});

// Afficher un message
function showMessage(text, type) {
  const div = document.getElementById('message');
  div.textContent = text;
  div.className = `message ${type}`;
  div.style.display = 'block';
  setTimeout(() => { div.style.display = 'none'; }, 3000);
}

// Charger la liste des membres
async function loadMembers() {
  try {
    const { data } = await axios.get(`/api/projects/${projectId}/members`);
    const tbody = document.getElementById('membersList');
    tbody.innerHTML = '';

    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="3" style="text-align:center; color:#888;">Aucun membre pour l instant</td></tr>';
      return;
    }

    data.forEach(member => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${member.fullName}</td>
        <td>${member.email}</td>
        <td>
          <button class="btn btn-red" onclick="retirerMembre('${member._id}')">
            Retirer
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

  } catch (error) {
    console.error('Erreur chargement membres:', error);
  }
}

// Inviter un membre
async function inviterMembre() {
  const email = document.getElementById('emailInput').value.trim();

  if (!email) {
    showMessage('Veuillez entrer un email', 'error');
    return;
  }

  try {
    const { data } = await axios.post(`/api/projects/${projectId}/invite`, { email });
    showMessage(data.message, 'success');
    document.getElementById('emailInput').value = '';
    loadMembers();

  } catch (error) {
    const msg = error.response?.data?.message || 'Erreur lors de l invitation';
    showMessage(msg, 'error');
  }
}

// Retirer un membre
async function retirerMembre(memberId) {
  if (!confirm('Voulez-vous vraiment retirer ce membre ?')) return;

  try {
    const { data } = await axios.delete(`/api/projects/${projectId}/members/${memberId}`);
    showMessage(data.message, 'success');
    loadMembers();

  } catch (error) {
    const msg = error.response?.data?.message || 'Erreur lors du retrait';
    showMessage(msg, 'error');
  }
}

// Charger au démarrage
loadMembers();