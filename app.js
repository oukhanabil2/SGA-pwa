// app.js - Logique du Système de Gestion des Agents (SGA)

// --- INITIALISATION AU CHARGEMENT ---
document.addEventListener('DOMContentLoaded', () => {
    displayMainMenu();
    console.log("Interface SGA initialisée");
});

// --- GESTION DES MENUS ---

function displayMainMenu() {
    const mainContent = document.getElementById('main-content');
    document.getElementById('sub-title').textContent = "Menu Principal";
    mainContent.innerHTML = ''; 

    const menuContainer = document.createElement('div');
    menuContainer.className = 'menu-button-container';

    // Liste des boutons (Identique à votre version Python)
    const options = [
        { text: "GESTION DES AGENTS", handler: () => displayAgentsList() },
        { text: "STATISTIQUES", handler: displayStatsMenu },
        { text: "GESTION DU PLANNING", handler: () => showSnackbar("Bientôt disponible") },
        { text: "CODES PANIQUE", handler: () => showSnackbar("Section sécurisée") },
        { text: "QUITTER", handler: () => { if(confirm("Quitter l'application ?")) window.close(); }, className: "quit-button" }
    ];

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option.text;
        btn.className = 'menu-button' + (option.className ? ' ' + option.className : '');
        btn.onclick = option.handler;
        menuContainer.appendChild(btn);
    });

    mainContent.appendChild(menuContainer);
}

// --- LOGIQUE DES AGENTS ---

function displayAgentsList() {
    let html = `
        <div class="info-section">
            <input type="text" id="searchAgent" placeholder="Rechercher nom ou code..." 
                   style="width:100%; padding:10px; border-radius:5px; border:none;" 
                   onkeyup="filterAgents()">
            <div id="list-container" style="margin-top:15px;">
                ${generateAgentsTable(agents)}
            </div>
        </div>
    `;
    openPopup("Liste des Agents", html, `<button class="popup-button gray" onclick="closePopup()">Retour</button>`);
}

function generateAgentsTable(data) {
    return `
        <table class="classement-table">
            <thead>
                <tr><th>Code</th><th>Nom & Prénom</th><th>Groupe</th></tr>
            </thead>
            <tbody>
                ${data.map(a => `
                    <tr onclick="showAgentDetails('${a.code}')" style="cursor:pointer;">
                        <td>${a.code}</td>
                        <td>${a.nom} ${a.prenom}</td>
                        <td>${a.groupe}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function showAgentDetails(code) {
    const a = agents.find(agent => agent.code === code);
    if (!a) return;

    const details = `
        <div class="info-section">
            <div class="info-item"><span class="info-label">Matricule:</span><span class="info-value">${a.matricule}</span></div>
            <div class="info-item"><span class="info-label">CIN:</span><span class="info-value">${a.cin}</span></div>
            <div class="info-item"><span class="info-label">Téléphone:</span><span class="info-value">${a.tel}</span></div>
            <div class="info-item"><span class="info-label">Poste:</span><span class="info-value">${a.poste}</span></div>
        </div>
    `;
    openPopup(`Détails : ${a.nom}`, details, `<button class="popup-button blue" onclick="displayAgentsList()">Retour liste</button>`);
}

// --- LOGIQUE DES STATISTIQUES ---

function displayStatsMenu() {
    const groups = [...new Set(agents.map(a => a.groupe))].sort();
    let html = `
        <div class="info-section">
            <h3>Calculer le classement</h3>
            <p>Sélectionnez un groupe pour voir les performances :</p>
            <select id="group-select" class="info-value" style="width:100%; padding:10px; margin-top:10px;">
                <option value="ALL">Tous les Groupes</option>
                ${groups.map(g => `<option value="${g}">Groupe ${g}</option>`).join('')}
            </select>
        </div>
    `;
    openPopup("Statistiques", html, `
        <button class="popup-button green" onclick="runClassement()">Générer Classement</button>
        <button class="popup-button gray" onclick="closePopup()">Annuler</button>
    `);
}

function runClassement() {
    const group = document.getElementById('group-select').value;
    let filtered = group === "ALL" ? agents : agents.filter(a => a.groupe === group);
    
    // Simulation de calcul de total (comme dans votre Excel)
    const sortedData = filtered.map(a => ({
        ...a,
        total: Math.floor(Math.random() * 25) + 5 // Simulé pour l'exemple
    })).sort((a, b) => b.total - a.total);

    let html = `
        <table class="classement-table">
            <thead>
                <tr><th>Rang</th><th>Agent</th><th>Total</th></tr>
            </thead>
            <tbody>
                ${sortedData.map((a, index) => `
                    <tr>
                        <td class="rank-${index + 1}">${index + 1}</td>
                        <td>${a.nom}</td>
                        <td class="total-value">${a.total} j</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    openPopup(`Classement Groupe ${group}`, html, `<button class="popup-button blue" onclick="displayStatsMenu()">Nouveau calcul</button>`);
}

// --- FONCTIONS INTERFACE (UTILES) ---

function openPopup(title, body, footer) {
    const overlay = document.getElementById('overlay');
    const content = document.getElementById('popup-content');
    content.innerHTML = `
        <div class="popup-header"><h2>${title}</h2><button class="popup-close-btn" onclick="closePopup()">&times;</button></div>
        <div class="popup-body">${body}</div>
        <div class="popup-footer">${footer}</div>
    `;
    overlay.classList.add('visible');
}

function closePopup() {
    document.getElementById('overlay').classList.remove('visible');
}

function showSnackbar(msg) {
    alert(msg); // Version simplifiée, peut être remplacée par un toast CSS
}

function filterAgents() {
    const val = document.getElementById('searchAgent').value.toLowerCase();
    const filtered = agents.filter(a => 
        a.nom.toLowerCase().includes(val) || a.code.toLowerCase().includes(val)
    );
    document.getElementById('list-container').innerHTML = generateAgentsTable(filtered);
}
