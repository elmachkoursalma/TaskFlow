# TaskFlow - Application de Gestion de Projets
TaskFlow est une application web fullstack permettant la gestion de projets collaboratifs et de tâches. Ce projet a été réalisé en respectant les contraintes techniques de Docker, MongoDB et l'authentification JWT.
## Distribution de l'équipe et des fonctionnalités

| Membre | Fonctionnalités (Tasks) | Branches Git |
| :--- | :--- | :--- |
| **Imane El Khamal** | **F1:** Authentification <br> **F6:** Filtrage, recherche et pagination | `feature/authentification` <br> `feature/filtrage` |
| **Salma El Machkour** | **F2:** Gestion des projets <br> **F7:** Sauvegarde auto des brouillons <br> **F9:** Historique des activités | `feature/projets` <br> `feature/brouillons` <br> `feature/activites` |
| **Aya Amalal** | **F3:** Gestion des tâches <br> **F4:** Assignation des tâches | `feature/taches` <br> `feature/assignation` |
| **Malak El Alami** | **F5:** Dashboard personnel <br> **F8:** Gestion des membres <br> **F10:** Notifications | `feature/dashboard` <br> `feature/membres` <br> `feature/notifications` |

## Stack Technique
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Dockerisée)
* **Auth:** JWT (JSON Web Tokens)
* **Infrastructure:** Docker, Docker Compose
## Installation et Lancement
1. Renommer le fichier `.env.example` en `.env` et configurer les variables.
2. Lancer l'application avec Docker :
```bash
docker-compose up --build