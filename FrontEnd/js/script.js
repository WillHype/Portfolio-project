let works = [];
const worksSection = document.querySelector(".gallery");
const worksInGallery = document.querySelector(".content-management");
const token = localStorage.getItem('authToken');
const loginLink = document.querySelector('#login-link');

/** Conditions de connexion */
if (token) {
  loginLink.textContent = 'logout';
  loginLink.href = '#';
  loginLink.addEventListener('click', logoutUser);
} else {
  loginLink.textContent = 'login';
}

function logoutUser() {
  localStorage.removeItem('authToken');
  window.location.href = "login.html";
}

const editBar = document.getElementById('edit-bar');

if (token) {
  editBar.style.display = 'flex';
} else {
  editBar.style.display = 'none';
}

/** Récupération des travaux depuis le back-end */
async function loadWorks() {
  return (await fetch("http://localhost:5678/api/works")).json();
}

/** Récupération des catégories depuis le back-end */
async function loadCategories() {
	return (await fetch("http://localhost:5678/api/categories")).json();
}

document.addEventListener("DOMContentLoaded", async () => {
    // Charger les travaux et afficher une erreur en cas d'échec
  try { 
    works = await loadWorks();
  } catch (error) {
    console.error("Erreur lors du chargement des travaux :", error);
  }
  console.log(works);
  displayWorks(works);
});

/** Déclaration de la constante du filtre */
const filterButtons = document.querySelectorAll(".filter-button");

/** Fonction de filtrage */
function filterWorks(category) {
  const filteredWorks = works.filter((work) => work.category.name === category);
  displayWorks(filteredWorks);
}


/** Affichage des projets avec filtrage */
function displayWorks(wks) {
  worksSection.innerHTML = "";
  wks.forEach((work) => {
    const figureBloc = document.createElement("figure");
    worksSection.appendChild(figureBloc);

    const worksImg = document.createElement("img");
    worksImg.src = work.imageUrl;
    worksImg.alt = work.title;
    figureBloc.appendChild(worksImg);

    const figcaption = document.createElement("figcaption");
    figcaption.innerHTML = work.title;
    figureBloc.appendChild(figcaption);
  });
}
/** Création de la fonction pour la galerie dans la modale */
function displayWorksInGallery(wks) {
  worksInGallery.innerHTML = "";
  wks.forEach((work) => {
    const figureBloc = document.createElement("figure");
    worksInGallery.appendChild(figureBloc);

    const worksImg = document.createElement("img");
    worksImg.src = work.imageUrl;
    worksImg.alt = work.title;
    figureBloc.appendChild(worksImg);

    const editSpan = document.createElement("span");
    editSpan.innerText = "éditer";
    figureBloc.appendChild(editSpan);

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fa-solid fa-trash-can delete-icon";
    figureBloc.appendChild(deleteIcon);
    deleteIcon.addEventListener('click', function() {
      // Vérifie si l'utilisateur est connecté
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        alert("Vous devez être connecté pour supprimer une photo.");
        return;
      }
      const confirmDelete = confirm("Voulez-vous vraiment supprimer cette photo ?");
      if (confirmDelete) {
        const workId = work.id; // l'ID de l'élément 
        fetch(`http://localhost:5678/api/works/${workId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`,
          }
        }).then(response => {
          if (response.ok) {
            figureBloc.remove(); // Supprime l'élément du DOM si la suppression est réussie
          } else {
            alert("Une erreur est survenue lors de la suppression.");
          }
        }).catch(error => {
          console.error(error);
          alert("Une erreur est survenue lors de la suppression.");
        });
      }
    });
  });
}

/** Gestionnaire d'événements pour les boutons de filtre */
filterButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    // Ajouter la classe active au bouton cliqué et la supprimer des autres boutons
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    // Récupérer la catégorie du bouton cliqué
    const category = button.dataset.filter;

     // Récupérer les travaux depuis l'API et les filtrer en fonction de la catégorie
    try {
      works = await loadWorks();
    } catch (error) {
      console.error("Erreur lors du chargement des travaux :", error);
      return;
    }
    if (category === "all") {
      displayWorks(works);
    } else {
      filterWorks(category);
    }
  });
});

/** Style pour les liens actifs de navigation */
// Sélectionne tous les liens de navigation
const navLinks = document.querySelectorAll('nav a');
navLinks.forEach(link => {
  link.addEventListener('click', function() {
    
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
    // Ajoute la classe "active" au lien de navigation actuel
    this.classList.add('active');
  });
});


/** Gestionnaire du mode édition */
function isLoggedIn() {
  const token = localStorage.getItem('authToken');
  return !!token; // renvoie true si token est défini, false sinon
}

function init() {
  // Afficher la barre d'édition si l'utilisateur est authentifié
  const editBar = document.querySelector('#edit-bar');
  const editPicIco = document.querySelectorAll(".modifer");
  if (isLoggedIn()) {
    editBar.classList.add('visible');
    editPicIco.forEach(function(editPicIco) {
      editPicIco.classList.add('visible');
    });
  }
}

init();

/** Gestion de la modale */
const editButton = document.querySelectorAll(".modifer");
const modal = document.querySelector('.modal');
const closeButton = document.querySelector('.close-btn');
const modalStep1 = document.getElementById("modal-step-1");
const modalStep2 = document.getElementById("modal-step-2");
const modalConfirm = document.getElementById("modal-confirm");
const modalReturn = document.querySelector("#modal-step-2 .cancel-btn");

// Ajouter un événement au bouton "modifier"
editButton.forEach(function(editButton) {
  editButton.addEventListener('click', function() {
    modal.style.display = 'block';
  });
});

// Ajouter un événement au bouton "X" pour fermer la modale
closeButton.addEventListener('click', function() {
  modal.style.display = 'none';
});

// Ajouter un événement à la fenêtre pour fermer la modale en cliquant en dehors
window.addEventListener('click', function(event) {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

editButton.forEach(function(editButton) {
  editButton.addEventListener('click', async function() {
    modal.style.display = 'block';
    const works = await loadWorks();
    displayWorksInGallery(works);
  });
});

//TEST

// Fonction pour afficher l'étape 2
function showStep2() {
  modalStep1.classList.add("hidden");
  modalStep2.classList.remove("hidden");
}

// Fonction pour cacher l'étape 2 et afficher l'étape 1
function hideStep2() {
  modalStep2.classList.add("hidden");
  modalStep1.classList.remove("hidden");
}

// Événement de clic sur le bouton "Ajouter une photo"
modalConfirm.addEventListener("click", showStep2);


// Événement de clic sur le bouton "Retour"
modalReturn.addEventListener("click", hideStep2);

/** Soumission du formulaire depuis la modale */

const form = document.querySelector('#modal-step-2 form');
form.addEventListener('submit', handleSubmit);

async function handleSubmit(e) {
  e.preventDefault();

  // Récupération des valeurs des champs du formulaire
  const title = document.querySelector('#photo-title').value;
  const category = document.querySelector('#photo-category').value;
  const image = document.querySelector('#photo-upload').files[0];
  // const file = fileInput.files[0];

  // Validation des données du formulaire
  if (!title || !category || !image) {
    alert('Merci de remplir tous les champs du formulaire.');
    return;
  }

  // Création d'un objet FormData pour envoyer les données du formulaire
  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  formData.append('image', image);
  console.log(formData)

  // Envoi des données du formulaire au serveur
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch("http://localhost:5678/api/works", {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();
    console.log('Réponse de l\'API :', data);

    // Recharge la galerie de travaux pour afficher le nouveau travail
    const works = await loadWorks();
    displayWorks(works);

    // Ferme la modale
    closeModal();
  } catch (error) {
    console.error(error);
    alert('Une erreur est survenue lors de l\'envoi du formulaire.');
  }
}

