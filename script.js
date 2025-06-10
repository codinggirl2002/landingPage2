//fonctions pour les animations

document.addEventListener('DOMContentLoaded', function () {
    // IntersectionObserver pour les animations au scroll
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.pain-point, .benefit, .program-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
});

// Fonctions pour ouvrir / fermer la modal
function openModal() {
    document.getElementById('inscriptionModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    document.getElementById('inscriptionModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}
window.onclick = function(event) {
    const modal = document.getElementById('inscriptionModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Aucun traitement JS côté formulaire Laravel (handled server-side)
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('inscriptionForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            // On laisse Laravel gérer la validation et la redirection
        });
    }
});

// Smooth scroll sur les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});


//gestions des incriptions a la formation grace a jsonnin.io
const BIN_ID    = '684740848960c979a5a73748';     
const API_KEY   = '$2a$10$I2Bt.SvEvgU1MKr7kEB37Omu1q3duKkNF46gYBAEiZqVuYU76980q'; // récupérée dans ton dashboard JSONBin
const BIN_URL   = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

// Récupérer le contenu actuel du bin
async function fetchInscriptions() {
    const res = await fetch(BIN_URL + '/latest', {
        headers: { 'X-Master-Key': API_KEY }
    });
    const json = await res.json();
  
    // json.record === { participants: [ ... ] }
    return Array.isArray(json.record.participants)
      ? json.record.participants
      : [];
  }
  
// Écraser le bin avec un nouveau tableau
async function saveInscriptions(inscriptionsArray) {
    // On enveloppe sous "record" et on remet la même structure { participants: [...] }
    const payload = {
      record: {
        participants: inscriptionsArray
      }
    };
  
    const res = await fetch(BIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type':      'application/json',
        'X-Master-Key':       API_KEY,
        'X-Bin-Versioning':   'false'
      },
      body: JSON.stringify({ participants: inscriptionsArray })
    });
  
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`Erreur PUT JSONBin (${res.status}): ${JSON.stringify(err)}`);
    }
  }
  

// Au submit de ton form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('inscriptionForm');
    if (!form) return;
  
    form.addEventListener('submit', async e => {
      e.preventDefault();
  
      // 1) Récupère tes champs
      const data = {
        nom:               form.nom.value,
        email:             form.email.value,
        telephone:         form.telephone.value,
        age_ado:           form.age_ado.value,
        principale_difficulte: form.principale_difficulte.value,
        attentes:          form.attentes.value,
        created_at:        new Date().toISOString()
      };
  
      try {
        // 2) Lire l'ancien tableau
        const inscriptions = await fetchInscriptions();
  
        // 3) Ajouter la nouvelle entrée
        inscriptions.push(data);
  
        // 4) Écraser le bin
        await saveInscriptions(inscriptions);
  
       // 5) Affiche la div de succès 
       form.style.display = 'none';
       document.getElementById('successMessage').style.display = 'block';
  
    } catch (err) {
      console.error(err);
      alert('Erreur lors de l’enregistrement : ' + err.message);
    }
    });
  });
  
