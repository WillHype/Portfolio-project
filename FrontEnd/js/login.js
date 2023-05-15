const token = localStorage.getItem('authToken');
const alreadyLoggedError = document.querySelector('.alreadyLogged_error'); 


// Si l'utilisateur est déjà connecté, on supprime le token
function alreadyLogged() {
  if (localStorage.getItem('authToken')) {
    localStorage.removeItem('authToken');

    const p = document.createElement('p');
    p.innerHTML = 'Vous avez été déconnecté, veuillez vous reconnecter';
    alreadyLoggedError.appendChild(p);
  }
}
// // Exporte la fonction
// export { alreadyLogged };

// Appelle la fonction
alreadyLogged();

async function connectUser(email, password) {
  const url = 'http://localhost:5678/api/users/login';
    // Crée une requête POST pour se connecter à l'API
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      
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
  
  };

//Formulaire de connexion
async function loginUser(event) {
  event.preventDefault(); // empêche la soumission du formulaire

  const email = document.querySelector('input[name="email"]').value;
  const password = document.querySelector('input[name="password"]').value;

  try {
    await connectUser(email, password);
    const options = {
      headers: { Authorization: `Bearer ${token}` }
    };
    window.location.href = "index.html"; // redirige l'utilisateur vers la page d'accueil
  } catch (error) {
    document.querySelector('#error-message').textContent = error.message;
  }
};


// ajouter l'écouteur d'événement sur le bouton de soumission
const submit = document.querySelector('#login-form button');
submit.addEventListener('click', loginUser);