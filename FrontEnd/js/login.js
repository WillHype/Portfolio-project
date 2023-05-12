const token = localStorage.getItem('authToken');

// loginUser();
async function connectUser(email, password) {
  const url = 'http://localhost:5678/api/users/login';
    // Crée une requête POST pour se connecter à l'API
    const options = {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    };
  
    // Envoie la requête POST et attend la réponse
    const response = await fetch(url, options);
  
    // Vérifie si la réponse est ok
    if (!response.ok) {
      throw new Error('Identifiants de connexion invalides');
    }
  
    // Récupère le token d'authentification et le stocke dans le localStorage
    const data = await response.json();
    localStorage.setItem('authToken', data.token);
  
  }

const options = {
  headers: { Authorization: `Bearer ${token}` }
};
// const response = await fetch(url, options);
  

//Formulaire de connexion
async function loginUser(event) {
event.preventDefault(); // empêche la soumission du formulaire

const email = document.querySelector('input[name="email"]').value;
const password = document.querySelector('input[name="password"]').value;

    try {
      await connectUser(email, password);
      window.location.href = "index.html"; // redirige l'utilisateur vers la page d'accueil
    } catch (error) {
      document.querySelector('#error-message').textContent = error.message;
    }
    return false; // empêche la soumission du formulaire
  }

// ajouter l'écouteur d'événement sur le bouton de soumission
const submit = document.querySelector('#login-form button');
submit.addEventListener('click', loginUser);