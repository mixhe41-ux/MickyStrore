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

## 🛠️ Personalizzazione

### Modificare i Prodotti

Apri `script.js` e modifica l'array `products`:

```javascript
const products = [
    {
        id: 1,
        name: "Nome Prodotto",
        category: "categoria",
        price: 99.99,
        image: "url-immagine",
        description: "Descrizione"
    },
    // Aggiungi altri prodotti...
];
```

### Modificare i Colori

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
