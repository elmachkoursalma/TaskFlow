// Configuration globale de l'URL Backend de l'application
const API_URL = 'http://localhost:5000/api';

// Recuperation dynamique du token depuis le localStorage (Apres connexion)
const AUTH_TOKEN = localStorage.getItem('token'); 

// Configuration automatique du token avec le format Bearer
if (AUTH_TOKEN) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`;
} else {
    console.error("Aucun token trouve, redirection vers la page de connexion...");
}

// Recuperation dynamique de l'ID du projet depuis l'URL de la page
const urlParams = new URLSearchParams(window.location.search);
const PROJECT_ID = urlParams.get('projectId'); 

const tableBody = document.getElementById('taskTableBody');
const taskForm = document.getElementById('taskForm');

/**
 * 1. [GET] Recuperer les taches du projet depuis la base de donnees
 */
async function fetchTasks() {
    if (!PROJECT_ID) {
        console.error("Aucun ID de projet trouve dans l'URL");
        return;
    }
    
    try {
        const response = await axios.get(`${API_URL}/tasks/project/${PROJECT_ID}`);
        if (response.data.success) {
            renderTasks(response.data.data); // Appeler la fonction d'affichage
        }
    } catch (error) {
        console.error("Erreur lors du chargement des taches:", error);
    }
}

/**
 * Fonction pour injecter les lignes du tableau en pur JavaScript (DOM Natif)
 */
function renderTasks(tasks) {
    tableBody.innerHTML = ''; // Nettoyer les anciennes lignes
    
    if (!tasks || tasks.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">Aucune tache enregistree pour le moment.</td></tr>`;
        return;
    }

    tasks.forEach(task => {
        const tr = document.createElement('tr');
        tr.style.backgroundColor = '#fffaf2';
        
        // Attribution de la bonne couleur de badge selon la priorite
        let badgeClass = 'bg-badge-moyenne';
        if (task.priority === 'haute') badgeClass = 'bg-badge-haute';
        if (task.priority === 'basse') badgeClass = 'bg-badge-basse';

        // Structure HTML exacte de la ligne du tableau
        tr.innerHTML = `
            <td class="px-4"><span class="fw-semibold" style="color: #5c4033;">${task.title}</span></td>
            <td><span class="badge ${badgeClass}">${task.priority}</span></td>
            <td>
                <select class="form-select form-select-sm w-auto theme-input" onchange="updateStatus('${task._id}', this.value)">
                    <option value="à faire" ${task.status === 'à faire' ? 'selected' : ''}>À faire</option>
                    <option value="en cours" ${task.status === 'en cours' ? 'selected' : ''}>En cours</option>
                    <option value="terminé" ${task.status === 'terminé' ? 'selected' : ''}>Terminé</option>
                </select>
            </td>
            <td>
                <span style="color: #5c4033; font-size: 13px;">${task.assignedTo ? task.assignedTo.fullName : '—'}
                </span>
            </td>
            <td class="text-end px-4">
                <button class="btn btn-sm btn-link p-0 border-0 fw-bold" style="color: #bd3a3a; text-decoration: none;" onclick="deleteTask('${task._id}')">Supprimer</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

/**
 * 2. [POST] Ajouter une tache lors de la soumission du formulaire
 */
taskForm.addEventListener('submit', async function(e) {
    e.preventDefault(); // Bloquer le rechargement de la page
    
    const titleInput = document.getElementById('taskTitle');
    const priorityInput = document.getElementById('taskPriority');

    if (!PROJECT_ID) {
        alert("Impossible d'ajouter une tache : ID du projet manquant.");
        return;
    }

    try {
        const response = await axios.post(`${API_URL}/tasks`, {
            title: titleInput.value,
            description: titleInput.value, // Eviter l'erreur 400 Validation du backend
            priority: priorityInput.value,
            status: "à faire", 
            project: PROJECT_ID,
            assignedTo: document.getElementById('taskAssignTo').value || undefined 
        });

        if (response.data.success) {
            fetchTasks(); // Actualiser le tableau sans recharger la page
            titleInput.value = ''; // Vider le champ de saisie
            priorityInput.value = 'moyenne'; // Reset de la priorite
            deleteDraft(PROJECT_ID);
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout de la tache:", error);
    }
});

/**
 * 3. [PATCH] Mettre a jour le statut d'une tache dans la base de donnees
 */
async function updateStatus(id, newStatus) {
    try {
        await axios.patch(`${API_URL}/tasks/${id}/status`, {
            status: newStatus
        });
        console.log("Statut de la tache mis a jour avec succes !");
    } catch (error) {
        console.error("Erreur de mise a jour du statut:", error);
    }
}

/**
 * 4. [DELETE] Supprimer une tache du backend
 */
async function deleteTask(id) {
    if (!confirm("Voulez-vous vraiment supprimer cette tache ?")) return;
    
    try {
        const response = await axios.delete(`${API_URL}/tasks/${id}`);
        if (response.data.success) {
            fetchTasks(); // Actualisation immediate du tableau
        }
    } catch (error) {
        console.error("Erreur lors de la suppression de la tache:", error);
    }
}
async function loadMembers() {
    try {
        const response = await axios.get(`${API_URL}/projects/${PROJECT_ID}/members`);
        const members = response.data;

        // Remplir le select du formulaire de création
        const assignSelect = document.getElementById('taskAssignTo');
        members.forEach(member => {
            const option = document.createElement('option');
            option.value = member._id;
            option.textContent = member.fullName;
            assignSelect.appendChild(option);
        });

    } catch (error) {
        console.error('Erreur chargement membres:', error);
    }
}
// Assigner une tâche à un membre
async function assignTask(taskId, userId) {
    if (!userId) return;
    try {
        await axios.patch(`${API_URL}/tasks/${taskId}/assign`, { userId });
        fetchTasks();
    } catch (error) {
        console.error('Erreur assignation:', error);
    }
}
// FONCTIONNALITÉ 7 — Sauvegarde automatique des brouillons
// Sauvegarder le brouillon dans localStorage
function saveDraft(projectId) {
    const data = {
        title: document.getElementById('taskTitle').value,
        priority: document.getElementById('taskPriority').value
    };
    localStorage.setItem(`draft_${projectId}`, JSON.stringify(data));
}

// Restaurer le brouillon au chargement
function restoreDraft(projectId) {
    const draft = localStorage.getItem(`draft_${projectId}`);
    if (!draft) return;

    const data = JSON.parse(draft);
    const restore = confirm('Un brouillon a été trouvé. Voulez-vous le restaurer ?');

    if (restore) {
        if (data.title) document.getElementById('taskTitle').value = data.title;
        if (data.priority) document.getElementById('taskPriority').value = data.priority;
    } else {
        localStorage.removeItem(`draft_${projectId}`);
    }
}

// Supprimer le brouillon après soumission réussie
function deleteDraft(projectId) {
    localStorage.removeItem(`draft_${projectId}`);
}

// Initialiser la sauvegarde automatique sur chaque champ
function initDraftAutoSave(projectId) {
    const fields = ['taskTitle', 'taskPriority'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', () => saveDraft(projectId));
        }
    });
}


// Lancement automatique au chargement
document.addEventListener('DOMContentLoaded', () => {
    fetchTasks();
    loadMembers();

    if (PROJECT_ID) {
        // Restaurer le brouillon si existant
        restoreDraft(PROJECT_ID);

        // Initialiser la sauvegarde automatique
        initDraftAutoSave(PROJECT_ID);
    }
});