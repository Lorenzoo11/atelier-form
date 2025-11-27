let userCount = 1;
const maxUsers = 4;

const addBtn = document.querySelector('.add-user-btn');
const removeBtn = document.querySelector('.remove-user-btn');
const formContainer = document.querySelector('.form-container');

addBtn.addEventListener('click', () => {
    if (userCount < maxUsers) {
        userCount++;
        
        // Crea nuovo form
        const newForm = document.createElement('form');
        newForm.id = `userForm${userCount}`;
        newForm.className = 'user-form';
        newForm.innerHTML = `
            <fieldset>
                <div class="input-group">
                    <input 
                        type="text" 
                        class="input-field" 
                        id="name"
                        placeholder=" "
                        autocomplete="off"
                    >
                    <label for="name" class="input-label">Nome</label>
                    </div>

                    <div class="input-group">
                    <input 
                        type="text" 
                        class="input-field" 
                        id="cognome"
                        placeholder=" "
                        autocomplete="off"
                    >
                    <label for="phone" class="input-label">Cognome</label>
                    </div>
                </div>
            </fieldset>
        `;
        
        // Inserisce il nuovo form prima del button-group
        const buttonGroup = document.querySelector('.button-group');
        formContainer.insertBefore(newForm, buttonGroup);
        
        // Disabilita il pulsante + se raggiunto il massimo
        if (userCount === maxUsers) {
            addBtn.disabled = true;
            addBtn.style.opacity = '0.5';
            addBtn.style.cursor = 'not-allowed';
        }

        // Attiva sempre il bottone -
        removeBtn.disabled = false;
        removeBtn.style.opacity = '1';
        removeBtn.style.cursor = 'pointer';
    }
});

removeBtn.addEventListener('click', () => {
    if (userCount > 1) {
        const lastForm = document.getElementById(`userForm${userCount}`);
        lastForm.remove();
        userCount--;

        // Riattiva +
        addBtn.disabled = false;
        addBtn.style.opacity = '1';
        addBtn.style.cursor = 'pointer';

        // Disabilita - quando rimane solo 1 form
        if (userCount === 1) {
            removeBtn.disabled = true;
            removeBtn.style.opacity = '0.5';
            removeBtn.style.cursor = 'not-allowed';
        }
    }
});

const form = document.getElementById("userForm");
/*
document.querySelector('button[id="submit"]').addEventListener("click", () => {
    console.log("Hai premuto Invia");
});*/

document.getElementById("submit").addEventListener("click", async function(event) {
    event.preventDefault();  // ❗ blocca il reset / reload della pagina

    const forms = document.querySelectorAll('form[id^="userForm"]');

    let utenti  = [];

    forms.forEach(form => {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        utenti.push(data);
    });

    console.log("Dati scritti nei form:", utenti );

    try {
        const response = await fetch("/.netlify/functions/sendForm", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify( utenti )
        });

        const result = await response.json();
        console.log("Risposta da Netlify:", result);

    } catch (error) {
        console.error("Errore nella fetch:", error);
    }
});