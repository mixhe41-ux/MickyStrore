// Firebase chat realtime
// Assicurati che il codice di configurazione Firebase sia già incluso in index.html

// Sostituisci 'chat-mickystore' con un nome univoco per la tua chat
const CHAT_DB_PATH = 'chat-mickystore';

// Controlla se siamo su HTTPS (Firebase richiede HTTPS)
const IS_HTTPS = window.location.protocol === 'https:';

class ChatWidget {
    constructor() {
        this.lastOperatorTimestamp = parseInt(localStorage.getItem('lastOperatorTimestamp') || '0', 10);
        this.isOpen = false;
        this.listenersActive = false; // flag per registrare listener UNA SOLA VOLTA
        if (IS_HTTPS && typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().onAuthStateChanged(() => {
                this.init();
            });
        } else {
            if (!IS_HTTPS) {
                console.warn('⚠️ Chat in tempo reale disabilitata: Firebase richiede HTTPS. Usa solo localStorage per ora.');
            }
            this.init();
        }
    }

    // Mostra tutti i messaggi (utente e operatore) in tempo reale
    showAllMessages() {
        const chatBody = document.getElementById('chat-body');
        chatBody.innerHTML = '';

        // Carica i messaggi salvati localmente
        this.loadMessagesFromLocalStorage();

        // Registra listener Firebase UNA SOLA VOLTA (solo su HTTPS)
        if (!this.listenersActive && IS_HTTPS && typeof db !== 'undefined') {
            this.listenersActive = true;

            // listener per sincronizzare con Firebase in tempo reale
            db.ref(CHAT_DB_PATH).on('value', snapshot => {
                const messages = snapshot.val() || {};
                const sorted = Object.values(messages).sort((a, b) => a.timestamp - b.timestamp);

                // Salva in localStorage
                try {
                    localStorage.setItem('chatMessages', JSON.stringify(sorted));
                } catch (e) { /* ignore */ }

                // Notifica se c'è un nuovo messaggio operatore
                const maxOp = sorted.reduce((max, m) => m.operator && m.timestamp > max ? m.timestamp : max, this.lastOperatorTimestamp);
                if (maxOp > this.lastOperatorTimestamp) {
                    this.lastOperatorTimestamp = maxOp;
                    localStorage.setItem('lastOperatorTimestamp', maxOp.toString());

                    // Aggiungi il nuovo messaggio operatore
                    const newOpMsg = sorted.find(m => m.operator && m.timestamp === maxOp);
                    if (newOpMsg) {
                        console.log('◼︎ NUOVO MESSAGGIO OPERATORE RICEVUTO:', newOpMsg.message);
                        this.addOperatorMessage(newOpMsg.message);
                    }

                    if (!this.isOpen) this.showChatNotification();
                }
            }, (error) => {
                console.error('Errore Firebase (lettura):', error);
            });
        }
    }

    loadMessagesFromLocalStorage() {
        const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        messages.forEach(msg => {
            if (msg.message) {
                if (msg.operator) {
                    this.addOperatorMessage(msg.message);
                } else {
                    this.addUserMessage(msg.message);
                }
            }
        });
    }

    checkLocalStorageForNewMessages() {
        // Controlla periodicamente localStorage per nuovi messaggi dell'operatore (fallback Firebase)
        const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        const currentMaxOp = this.lastOperatorTimestamp;

        // Trova i messaggi operatore più recenti
        const newOpMessages = messages.filter(m =>
            m.operator && m.timestamp > currentMaxOp
        ).sort((a, b) => a.timestamp - b.timestamp);

        // Aggiungi i nuovi messaggi alla chat
        newOpMessages.forEach(msg => {
            console.log('💾 NUOVO MESSAGGIO DA LOCALSTORAGE:', msg.message);
            this.addOperatorMessage(msg.message);
            this.lastOperatorTimestamp = msg.timestamp;
            localStorage.setItem('lastOperatorTimestamp', msg.timestamp.toString());

            if (!this.isOpen) this.showChatNotification();
        });
    }
    showFirebaseError(msg) {
        if (!IS_HTTPS) {
            console.warn('Firebase non disponibile su HTTP - chat funziona solo con localStorage');
            return;
        }
        if (msg && msg.includes('permission_denied')) {
            console.warn('Firebase: accesso limitato, usando localStorage');
            return;
        }
        let errBox = document.getElementById('firebase-error-box');
        if (!errBox) {
            errBox = document.createElement('div');
            errBox.id = 'firebase-error-box';
            errBox.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#e91e63;color:#fff;padding:16px 28px;border-radius:8px;z-index:99999;font-size:1.1rem;box-shadow:0 4px 16px rgba(0,0,0,0.18);';
            document.body.appendChild(errBox);
        }
        errBox.textContent = msg;
    }

    checkWorkingHours() {
        // La chat è disponibile 24/7
        return true;
    }

    init() {
        this.createChatWidget();
        this.attachEventListeners();
        this.checkWorkingHours();

        // Ascolta evento custom quando admin invia una risposta (istantaneo, stessa tab)
        window.addEventListener('adminMessageAdded', (event) => {
            console.log('⚡ MESSAGGIO ADMIN RICEVUTO ISTANTANEAMENTE:', event.detail.message);
            this.addOperatorMessage(event.detail.message);
            this.lastOperatorTimestamp = event.detail.timestamp;
            localStorage.setItem('lastOperatorTimestamp', event.detail.timestamp.toString());
            if (!this.isOpen) this.showChatNotification();
        });

        // Ascolta storage event per sincronizzazione tra tab (quando admin è su tab diversa)
        window.addEventListener('storage', (event) => {
            if (event.key === 'chatMessages') {
                console.log('📦 Storage event detected da altra tab');
                const messages = JSON.parse(event.newValue || '[]');
                const currentMaxOp = this.lastOperatorTimestamp;

                // Trova messaggi operatore nuovi
                const newOpMessages = messages.filter(m =>
                    m.operator && m.timestamp > currentMaxOp
                ).sort((a, b) => a.timestamp - b.timestamp);

                newOpMessages.forEach(msg => {
                    console.log('📬 NUOVO MESSAGGIO DA ALTRA TAB:', msg.message);
                    this.addOperatorMessage(msg.message);
                    this.lastOperatorTimestamp = msg.timestamp;
                    localStorage.setItem('lastOperatorTimestamp', msg.timestamp.toString());
                    if (!this.isOpen) this.showChatNotification();
                });
            }
        });

        // Aspetta un piccolo ritardo prima di leggere i messaggi
        setTimeout(() => {
            this.showAllMessages(); // Avvia listener realtime
        }, 500);

        // Poll localStorage come fallback (ogni 2 secondi, non più necessario ma per sicurezza)
        this.localStoragePoll = setInterval(() => {
            this.checkLocalStorageForNewMessages();
        }, 2000);
        return true;
    }

    createChatWidget() {
        const chatHTML = `
            <div id="chat-widget" class="chat-widget">
                <!-- Chat Button -->
                <div id="chat-button" class="chat-button">
                    <i class="fas fa-comments"></i>
                    <span class="chat-badge" id="chat-status-badge"></span>
                </div>

                <!-- Chat Window -->
                <div id="chat-window" class="chat-window">
                    <div class="chat-header">
                        <div class="chat-header-content">
                            <i class="fas fa-headset"></i>
                            <div>
                                <h4>Assistenza 24/7</h4>
                                <span class="chat-status" id="chat-status">Online</span>
                            </div>
                        </div>
                        <button id="chat-close" class="chat-close-btn">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="chat-body" id="chat-body">
                        <!-- Messaggi verranno aggiunti qui -->
                    </div>

                    <div class="chat-footer" id="chat-footer">
                        <input 
                            type="text" 
                            id="chat-input" 
                            class="chat-input" 
                            placeholder="Scrivi un messaggio..."
                        >
                        <button id="chat-send" class="chat-send-btn">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
        this.updateStatus();
    }

    attachEventListeners() {
        const chatButton = document.getElementById('chat-button');
        const chatClose = document.getElementById('chat-close');
        const chatSend = document.getElementById('chat-send');
        const chatInput = document.getElementById('chat-input');

        chatButton.addEventListener('click', () => this.toggleChat());
        chatClose.addEventListener('click', () => this.closeChat());
        chatSend.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    updateStatus() {
        const isWorking = this.checkWorkingHours();
        const statusElement = document.getElementById('chat-status');
        const statusBadge = document.getElementById('chat-status-badge');
        const chatBody = document.getElementById('chat-body');

        // Sempre online 24/7
        statusElement.textContent = 'Online';
        statusElement.style.color = '#4caf50';
        statusBadge.classList.add('online');
        statusBadge.classList.remove('offline');

        this.addSystemMessage('👋 Ciao! Siamo disponibili 24/7. Come possiamo aiutarti?');
        this.showAllMessages();
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chat-window');
        const chatButton = document.getElementById('chat-button');

        if (this.isOpen) {
            chatWindow.classList.add('open');
            chatButton.classList.add('active');
            // rimuovi notifica quando si apre
            const notif = document.getElementById('chat-new-oper');
            if (notif) notif.remove();
        } else {
            chatWindow.classList.remove('open');
            chatButton.classList.remove('active');
        }
    }

    closeChat() {
        this.isOpen = false;
        const chatWindow = document.getElementById('chat-window');
        const chatButton = document.getElementById('chat-button');
        chatWindow.classList.remove('open');
        chatButton.classList.remove('active');

        // Quando l'utente chiude la chat, cancelliamo la cronologia locale
        // in modo che alla riapertura la conversazione parta pulita.
        try {
            localStorage.removeItem('chatMessages');
            localStorage.removeItem('lastOperatorTimestamp');
            const chatBody = document.getElementById('chat-body');
            if (chatBody) chatBody.innerHTML = '';
        } catch (e) {
            console.warn('Impossibile cancellare messaggi locali:', e);
        }
    }

    addSystemMessage(message) {
        const chatBody = document.getElementById('chat-body');
        const messageHTML = `
            <div class="chat-message system-message">
                <div class="message-content">${message}</div>
            </div>
        `;
        chatBody.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    addUserMessage(message) {
        const chatBody = document.getElementById('chat-body');
        const messageHTML = `
            <div class="chat-message user-message">
                <div class="message-content">${message}</div>
            </div>
        `;
        chatBody.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    addOperatorMessage(message) {
        const chatBody = document.getElementById('chat-body');
        const messageHTML = `
            <div class="chat-message operator-message">
                <div class="message-avatar">
                    <i class="fas fa-user-tie"></i>
                </div>
                <div class="message-content">${message}</div>
            </div>
        `;
        chatBody.insertAdjacentHTML('beforeend', messageHTML);
        this.scrollToBottom();
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message) return;

        // Aggiungi il messaggio all'interfaccia immediatamente
        this.addUserMessage(message);
        input.value = '';

        // Salva in localStorage
        this.notifyOperator(message);

        // Prova a inviare a Firebase (silenziosamente se fallisce)
        try {
            if (typeof db !== 'undefined') {
                db.ref(CHAT_DB_PATH).push({
                    message: message,
                    timestamp: Date.now(),
                    data: new Date().toLocaleString('it-IT'),
                    operator: false
                }, (error) => {
                    if (error) {
                        console.warn('Firebase non disponibile, usando localStorage:', error.message);
                    }
                });
            }
        } catch (e) {
            console.warn('Firebase non disponibile:', e.message);
        }
    }

    notifyOperator(message) {
        // Salva il messaggio in localStorage
        const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        const newMessage = {
            id: Date.now(),
            message: message,
            data: new Date().toLocaleString('it-IT'),
            timestamp: Date.now(),
            letto: false
        };
        messages.push(newMessage);
        localStorage.setItem('chatMessages', JSON.stringify(messages));

        console.log('✅ Messaggio salvato!', newMessage);
        console.log('📊 Totale messaggi:', messages.length);
        console.log('📂 Per vedere i messaggi, apri: messaggi-admin.html nello stesso browser');

        // Conferma all'utente
        setTimeout(() => {
            this.addOperatorMessage('✅ Il tuo messaggio è stato inviato al nostro team. Grazie per la vostra pazienza.');
        }, 1000);

        // Aggiorna il contatore badge se esiste
        this.updateMessageBadge();
    }

    updateMessageBadge() {
        const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
        const unreadCount = messages.filter(m => !m.letto).length;

        // Crea o aggiorna badge per l'operatore
        let badge = document.getElementById('operator-badge');
        if (!badge && unreadCount > 0) {
            badge = document.createElement('div');
            badge.id = 'operator-badge';
            badge.style.cssText = 'position: fixed; top: 10px; right: 10px; background: #e91e63; color: white; padding: 8px 12px; border-radius: 20px; font-weight: bold; z-index: 10000; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.3);';
            badge.innerHTML = `<i class="fas fa-envelope"></i> ${unreadCount} nuovi messaggi`;
            badge.onclick = () => window.open('messaggi-admin.html', '_blank');
            document.body.appendChild(badge);
        } else if (badge && unreadCount === 0) {
            badge.remove();
        } else if (badge) {
            badge.innerHTML = `<i class="fas fa-envelope"></i> ${unreadCount} nuovi messaggi`;
        }
    }

    scrollToBottom() {
        const chatBody = document.getElementById('chat-body');
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    showChatNotification() {
        const btn = document.getElementById('chat-button');
        if (!btn) return;
        let notif = document.getElementById('chat-new-oper');
        if (!notif) {
            notif = document.createElement('div');
            notif.id = 'chat-new-oper';
            notif.style.cssText = 'position:absolute;top:4px;right:4px;width:10px;height:10px;border-radius:50%;background:#4caf50;';
            btn.appendChild(notif);
        }
    }
}

// Inizializza la chat quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    new ChatWidget();
});
