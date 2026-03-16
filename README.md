# Sito Web E-commerce

Un sito web completo per vendite online con carrello, catalogo prodotti e sistema di checkout.

## 🌟 Caratteristiche

- **Homepage attraente** con prodotti in evidenza
- **Catalogo completo** con sistema di filtri e ricerca
- **Carrello della spesa** funzionale con gestione quantità
- **Design responsive** ottimizzato per mobile e desktop
- **Animazioni fluide** e interfaccia moderna
- **Persistenza dati** tramite localStorage

## 📁 Struttura File

- `index.html` - Homepage principale
- `prodotti.html` - Pagina catalogo prodotti
- `carrello.html` - Pagina carrello acquisti
- `styles.css` - Stili e design responsive
- `script.js` - Funzionalità e logica JavaScript

## 🚀 Come Usare

1. Apri `index.html` nel tuo browser
2. Naviga tra le diverse pagine usando il menu
3. Aggiungi prodotti al carrello
4. Visualizza e gestisci il tuo carrello
5. Procedi al checkout

## � Sistema Chat in Tempo Reale

Il sito include un sistema di chat integrato per assistenza clienti.

### Funzionamento

- **Online (HTTPS)**: Utilizza Firebase Realtime Database per chat istantanea
- **Locale (HTTP)**: Funziona con localStorage e sincronizzazione tra tab

### Pagine Chat

- `chat.js` - Widget chat per clienti
- `chat.css` - Stili del widget chat
- `messaggi-admin.html` - Pannello admin per gestire messaggi

### Test Locale

Per testare la chat localmente:
1. Servi il sito su `http://localhost:8000`
2. Apri una pagina cliente (es. `prodotti.html`)
3. Apri `messaggi-admin.html` in un'altra tab
4. Invia messaggi dalla chat cliente
5. Rispondi dall'admin (si aggiorna ogni 2 secondi)

### Deploy Online

Quando deployato su HTTPS (es. Netlify), la chat diventa completamente real-time grazie a Firebase.

Apri `styles.css` e modifica le variabili colore nella sezione header:

```css
/* Colore principale */
background-color: #2c3e50;

/* Colore accento */
color: #3498db;
```

### Aggiungere Nuove Categorie

1. Aggiungi prodotti con la nuova categoria
e2. Aggiorna il select in `prodotti.html`:

```html
<option value="nuova-categoria">Nuova Categoria</option>
```

## 📱 Responsive

Il sito è completamente responsive e ottimizzato per:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎨 Tecnologie Utilizzate

- HTML5
- CSS3 (Grid, Flexbox, Animazioni)
- JavaScript ES6+
- Font Awesome (icone)
- Google Fonts

## 💡 Funzionalità Future

- Integrazione pagamento reale
- Account utente e login
- Sistema di recensioni
- Wishlist
- Confronto prodotti
- Email di conferma ordini

## 📝 Note

- I dati del carrello sono salvati in localStorage
- Le immagini sono caricate da Unsplash
- Il checkout è simulato (nessun pagamento reale)

## 🤝 Supporto

Per domande o supporto, contatta: info@negozio.it

---

**Buone vendite! 🛍️**
