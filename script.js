/**
 * Dune: War for Arrakis - Atreides Automa
 * Logic & State Management
 */

const Game = (function () {

    // --- Data ---

    // Mapped to files: 1.png to 20.png
    // Verified logic based on analysis of 1.jpg/png to 20.png
    // Mapped to files: 1.png to 20.png
    const cardsData = [
        {
            file: "1.png",
            cond: "2+ Gusanos en juego (incl. Hacedor Salvaje)",
            ifTrue: "<ul><li><b>Acción:</b> Gusano Ataca o se Mueve.</li><li><b>Prioridad:</b> Gusano más cercano al Polo Norte.</li><li><b>Objetivo:</b> Si ataca, elige la Legión enemiga de mayor valor (evitando Desierto Profundo).</li></ul>",
            ifFalse: "<ul><li><b>Acción:</b> Colocar 2 Fichas de Gusano.</li><li><b>Ubicación:</b> En un desierto (Prioridad: Polo Norte).</li></ul>",
            add: "<ul><li>Ejecutar 1ª acción de la Carta de Objetivo.</li><li>Atreides recibe +1 Dado/Escudo en próximo combate.</li></ul>"
        },
        {
            file: "5.png", // Corrected per user: Card 2 is Wild Maker
            cond: "Hacedor Salvaje en juego",
            ifTrue: "<ul><li><b>Acción:</b> Hacedor Salvaje Ataca o se Mueve.</li><li><b>Prioridad:</b> Hacia Hagga Basin.</li></ul>",
            ifFalse: "<ul><li><b>Acción:</b> Colocar Hacedor Salvaje en un desierto.</li><li><b>Criterio:</b> Cerca de una Legión (Prioridad: Hagga Basin).</li></ul>",
            add: "<ul><li>Revelar Estación de Pruebas Ecológicas y mover marcador.</li><li>Atreides recibe +1 Dado.</li></ul>"
        },
        {
            file: "3.png",
            cond: "Presciencia Verde ≥ 3 Y Rojo ≥ 3",
            ifTrue: "<ul><li><b>Acción:</b> Mover Legión en Montaña hacia un Desierto.</li><li><b>Prioridad:</b> Polo Norte.</li></ul>",
            ifFalse: "<ul><li><b>Acción:</b> Colocar Líder (Paul) + 2 Fichas de Despliegue.</li><li><b>Ubicación:</b> En un Sietch Ofensivo.</li></ul>",
            add: "<ul><li>Reclutar Líder en Sietch Defensivo junto con 1 unidad regular.</li><li><b>Prioridad:</b> Paul > Gurney > Stilgar > Otros.</li></ul>"
        },
        {
            file: "4.png",
            cond: "Gusano de Arena en juego",
            ifTrue: "<ul><li><b>Acción:</b> Gusano Ataca o Mueve.</li><li><b>Criterio:</b> Atacar Legión en Desierto Profundo.</li><li><b>Prioridad:</b> Polo Norte.</li></ul>",
            ifFalse: "<ul><li><b>Opción A:</b> Mover 3 Legiones hacia Imperial Basin.</li><li><b>Opción B:</b> Mover 1 Legión desde Sietch Ofensivo hacia Imperial Basin.</li></ul>",
            add: "<ul><li>Ejecutar acción de la Carta de Objetivo.</li><li>Atreides recibe +1 Dado.</li></ul>"
        },
        {
            file: "5.png",
            cond: "Hacedor Salvaje en juego",
            ifTrue: "<ul><li><b>Acción:</b> Hacedor Salvaje Ataca o se Mueve hacia una Legión en Imperial Basin.</li></ul>",
            ifFalse: "<ul><li><b>Acción:</b> Colocar Hacedor Salvaje en desierto cercano a una Legión en Imperial Basin.</li></ul>",
            add: "<ul><li>Revelar Estación Ecológica.</li><li>Atreides recibe +1 Dado.</li></ul>"
        },
        {
            file: "6.png",
            cond: "Presciencia Amarillo ≥ 3",
            ifTrue: "<ul><li><b>Acción:</b> Colocar a la Reverenda Madre Jessica.</li><li><b>Ubicación:</b> Considerando un Sietch Defensivo.</li></ul>",
            ifFalse: "<ul><li><b>Acción:</b> Colocar Stilgar + 2 Unidades Regulares + 1 Unidad de Élite.</li><li><b>Ubicación:</b> Una Meseta cercana a Hagga Basin.</li></ul>",
            add: "Revelar Estación Ecológica."
        },
        {
            file: "7.png",
            cond: "Presciencia Verde ≥ 3",
            ifTrue: "<ul><li><b>Acción:</b> Colocar al Líder Muad'Dib + 1 Unidad de Élite en un Sietch Ofensivo.</li></ul>",
            ifFalse: "<ul><li><b>Acción:</b> Mover 2 Legiones hacia Hagga Basin.</li><li><b>Prioridad:</b> Mover la Legión de mayor rango hacia Hagga Basin.</li></ul>",
            add: "<ul><li>Ejecutar acción de la Carta de Objetivo.</li><li>Atreides recibe +1 Dado.</li></ul>"
        },
        {
            file: "8.png",
            cond: "Presciencia Rojo ≥ 3",
            ifTrue: "<ul><li><b>Acción:</b> Colocar a la Líder Chani + 2 Unidades Regulares en un Sietch Ofensivo.</li></ul>",
            ifFalse: "<ul><li><b>Acción:</b> Colocar Hacedor Salvaje en desierto cercano a una Legión en Imperial Basin.</li><li><b>Desempate:</b> Polo Norte.</li></ul>",
            add: "<ul><li>Revelar Estación Ecológica.</li><li>Atreides recibe +1 Dado.</li></ul>"
        },
        {
            file: "9.png",
            cond: "Presciencia Rojo ≥ 3 Y Amarillo ≥ 3 Y Gurney disponible",
            ifTrue: "<ul><li><b>Acción:</b> Mover a Gurney hacia el Polo Norte.</li></ul>",
            ifFalse: "<ul><li><b>Acción:</b> Colocar a Gurney + 2 Unidades de Élite considerando un Desierto.</li><li><b>Prioridad:</b> Hacia Imperial Basin.</li></ul>",
            add: "<ul><li>Reclutar Líder: Coloca un líder (Paul > Gurney > Stilgar) en el Sietch Defensivo.</li></ul>"
        },
        {
            file: "10.png",
            cond: "Presciencia Verde ≥ 3 O Amarillo ≥ 3 (Bandera)",
            ifTrue: "<ul><li><b>Ataque de Vehículos (3 dados):</b> Por cada Impacto/Especial, elimina un vehículo tuyo en Desierto/Desierto Profundo.</li><li><b>Prioridad:</b> Cosechadora > Ornitóptero > Carryall.</li></ul>",
            ifFalse: "<ul><li><b>Influencia Política:</b> Mover el marcador de Prohibición/Imperium hacia abajo.</li></ul>",
            add: "<ul><li>Jugar 1ª acción de la Carta de Objetivo.</li><li>Harkonnen obtiene +1 Escudo en su defensa.</li></ul>"
        },
        {
            file: "11.png",
            cond: "TODOS los marcadores de Presciencia ≥ 3 (Bandera)",
            ifTrue: "<ul><li><b>Combate:</b> El Automa ataca. Fuerza = X + número del Round actual.</li><li><b>Objetivo:</b> Una Legión, Líder o Líder Nombrado.</li><li><b>Prioridad:</b> Imperial Basin.</li></ul>",
            ifFalse: "<ul><li><b>Señal de Gusano:</b> Colocar 2 Fichas de Señal de Gusano.</li><li><b>Ubicación:</b> Desierto adyacente a un Sietch cercano a Imperial Basin.</li></ul>",
            add: "<ul><li>Revelar Estación Ecológica + colocar 2 Fichas de Señal de Gusano en desierto cercano a un Sietch Defensivo.</li><li><b>Prioridad:</b> Polo Norte.</li></ul>"
        },
        {
            file: "12.png",
            cond: "TODOS los marcadores de Presciencia ≥ 3 (Bandera)",
            ifTrue: "<ul><li><b>Ataque Selectivo (3 Dados):</b> Por cada Impacto/Especial, elimina un Líder o una Unidad propia.</li><li><b>Prioridad:</b> Hagga Basin.</li></ul>",
            ifFalse: "<ul><li><b>Señal de Gusano:</b> Colocar 2 Fichas de Gusano.</li><li><b>Ubicación:</b> En área con una Legión (Prioridad: Hagga Basin).</li></ul>",
            add: "<ul><li>Resolver carta de Presciencia (Acciones/Track).</li><li>Atreides obtiene +2 Dados más.</li></ul>"
        },
        {
            file: "13.png",
            cond: "Presciencia Verde ≥ 3 O Rojo ≥ 3 (Bandera)",
            ifTrue: "<ul><li><b>Sabotaje:</b> Una Legión Atreides interactúa/elimina un Vehículo tuyo.</li><li><b>Prioridad:</b> Imperial Basin.</li></ul>",
            ifFalse: "<ul><li><b>Despliegue:</b> Colocar una Legión con 2 Fichas de Despliegue en un Sietch Ofensivo.</li></ul>",
            add: "<ul><li>Jugar Carta de Objetivo.</li><li>Tú obtienes +1 Escudo.</li></ul>"
        },
        {
            file: "14.png",
            cond: "TODOS los marcadores de Presciencia ≥ 3 (Bandera)",
            ifTrue: "<ul><li><b>Despliegue Alia:</b> Colocar a Alia + 1 Regular + 1 Élite en Sietch Defensivo.</li><li><b>Ubicación:</b> En un Sietch Defensivo.</li></ul>",
            ifFalse: "<ul><li><b>Señal de Gusano:</b> Colocar 2 Fichas de Señal de Gusano.</li><li><b>Ubicación:</b> Desierto cercano a un Sietch en Imperial Basin.</li></ul>",
            add: "<ul><li>Revelar Estación Ecológica + colocar 2 Señales de Gusano cerca de un Sietch Defensivo.</li><li><b>Foco:</b> Polo Norte.</li></ul>"
        },
        {
            file: "15.png",
            cond: "TODOS los marcadores de Presciencia ≥ 3 (Bandera)",
            ifTrue: "<ul><li><b>Ataque de Gusanos:</b> Colocar 2 Gusanos de Arena en una zona de Desierto donde haya unidades.</li><li><b>Prioridad:</b> Polo Norte.</li></ul>",
            ifFalse: "<ul><li><b>Señal de Gusano:</b> Colocar 2 Fichas.</li><li><b>Ubicación:</b> Desierto adyacente a un Sietch Defensivo (Prioridad: Polo Norte).</li></ul>",
            add: "<ul><li>Revelar Estación Ecológica Y el Automa gana una ficha Bene Gesserit.</li><li>Tú obtienes +2 Escudos.</li></ul>"
        },
        {
            file: "16.png",
            cond: "Presciencia Amarillo ≥ 3 O Rojo ≥ 3 (Bandera)",
            ifTrue: "<ul><li><b>Recuperar/Reclutar Líder:</b> Colocar un Líder en un Asentamiento.</li><li><b>Prioridad:</b> Thufir Hawat > Otros > Feyd-Rautha > Gaius Helen Mohiam.</li></ul>",
            ifFalse: "<ul><li><b>Tormenta y Movimiento:</b> Mover una Legión al Polo Norte Y colocar una Tormenta de Coriolis.</li></ul>",
            add: "<ul><li>Jugar carta de Objetivo.</li><li>Tú obtienes +1 Escudo.</li></ul>"
        },
        {
            file: "17.png",
            cond: "TODOS los marcadores de Presciencia ≥ 3 (Bandera)",
            ifTrue: "<ul><li><b>Atómicas de Familia:</b> Usar la ficha de Atómicas sobre un Sietch Ofensivo (Bloquea/Destruye zona).</li></ul>",
            ifFalse: "<ul><li><b>Despliegue:</b> Colocar un Líder + 2 Fichas de Despliegue en un Sietch Ofensivo.</li></ul>",
            add: "<ul><li>Revelar Estación Ecológica + 2 Señales de Gusano cerca de un Sietch Defensivo (Foco: Polo Norte).</li></ul>"
        },
        {
            file: "18.png",
            cond: "TODOS los marcadores de Presciencia ≥ 3 (Bandera)",
            ifTrue: "<ul><li><b>Refuerzo desde Sietch:</b> Dos Legiones Atreides con fuerza ≤ 2 se mueven desde un Sietch Defensivo.</li></ul>",
            ifFalse: "<ul><li><b>Señal de Gusano:</b> Colocar 2 Fichas.</li><li><b>Ubicación:</b> Desierto cercano a un Sietch Ofensivo (Prioridad: Polo Norte).</li></ul>",
            add: "<ul><li>Revelar Estación Ecológica Y Resolver carta de Presciencia (Acciones).</li><li>Atreides obtiene +2 dados.</li></ul>"
        },
        {
            file: "19.png",
            cond: "Presciencia Verde ≥ 6 O Amarillo ≥ 6 O Rojo ≥ 6 (Bandera)",
            ifTrue: "<ul><li><b>Manipulación Política:</b> Si el Automa tiene ficha BG, la gasta para subir 1 nivel el marcador de Presciencia más bajo.</li></ul>",
            ifFalse: "<ul><li><b>Sabotaje:</b> Eliminar un Dado Rojo tuyo (Pierdes una acción).</li></ul>",
            add: "<ul><li><b>Reclutar Líder:</b> Colocar un Líder de la reserva en el Sietch Defensivo.</li><li><b>Prioridad:</b> Paul > Gurney > Stilgar.</li></ul>"
        },
        {
            file: "20.png",
            cond: "TODOS los marcadores de Presciencia ≥ 6 (Bandera)",
            ifTrue: "<ul><li><b>Combate Agresivo:</b> Si combate vs zona con Líder o >2 Legiones, añade 1 Éxito Automático. (Prioridad: Hagga Basin).</li><li><b>Prioridad:</b> Hagga Basin.</li></ul>",
            ifFalse: "<ul><li><b>Restricción Táctica:</b> En tu próximo turno, debes jugar obligatoriamente tu dado más a la derecha.</li></ul>",
            add: "Tanque de Regeneración (Líder -> Sietch Ofensivo)."
        }
    ];

    const TOTAL_DECISION_CARDS = cardsData.length;

    // Mapped to files: obj_1.png to obj_8.png
    // Mapped to files: obj_1.png to obj_8.png
    const objectivesData = [
        {
            id: 1,
            title: "Recolectores de Rocío",
            desc: "<b>Victoria:</b> Legiones en 3+ regiones de Meseta.",
            file: "obj_1.png",
            logic: "<ul><li><b>Movimiento IA:</b> Mover Legiones a Mesetas.</li><li><b>Alternativa:</b> Si no, colocar gusanos en rutas hacia Mesetas.</li><li><b>Acercamiento:</b> Mover legiones acercándose a Mesetas.</li><li><b>Foco:</b> Hagga Basin.</li></ul>"
        },
        {
            id: 2,
            title: "¡Paul el 'Mahdi'!",
            desc: "<b>Victoria:</b> Revelar un Sietch en la misma región donde se encuentre Paul.",
            file: "obj_2.png",
            logic: "<ul><li><b>Movimiento IA:</b> Prioriza mover legiones hacia la ubicación de Paul para protegerlo y asegurar la zona.</li><li><b>Efecto:</b> Si Paul llega a un Sietch oculto, este se revela (Acción Gratuita).</li></ul>"
        },
        {
            id: 3,
            title: "Disciplina del Agua",
            desc: "<b>Victoria:</b> Paul y Jessica están en regiones de Desierto Profundo (sin Sietch).",
            file: "obj_3.png",
            logic: "<ul><li><b>Movimiento IA:</b> Mover a Paul y/o Jessica hacia el desierto abierto (profundo), alejándolos de los Sietchs.</li><li><b>Estrategia:</b> Busca mantenerlos en movimiento en zonas hostiles.</li></ul>"
        },
        {
            id: 4,
            title: "Nuevas Trampas de Viento",
            desc: "<b>Victoria:</b> Hay Legiones Atreides en 3 o más regiones de Montaña.",
            file: "obj_4.png",
            logic: "<ul><li><b>Movimiento IA:</b> Mover Legiones directamente a Montañas. Si no, colocar gusanos para proteger el camino.</li><li><b>Acercamiento:</b> Mover legiones acercándose a Montañas libres.</li></ul>"
        },
        {
            id: 5,
            title: "Gusanos Atrofiados",
            desc: "<b>Victoria:</b> Hay Legiones Atreides en 2 o más regiones de Erg Menor.",
            file: "obj_5.png",
            logic: "<ul><li><b>Movimiento IA:</b> Prioridad absoluta de mover legiones hacia los Ergs Menores.</li><li><b>Alternativa:</b> Si no pueden entrar, se mueven para acercarse lo máximo posible.</li><li><b>Foco:</b> Polo Norte.</li></ul>"
        },
        {
            id: 6,
            title: "Entrenamiento Bene Gesserit",
            desc: "<b>Victoria:</b> Jessica y Paul están en el mismo Sietch.",
            file: "obj_6.png",
            logic: "<ul><li><b>Movimiento IA:</b> Mover a Paul hacia la ubicación de Jessica y a Jessica hacia Paul.</li><li><b>Objetivo:</b> Que ambos terminen su movimiento en el mismo Sietch (base segura).</li></ul>"
        },
        {
            id: 7,
            title: "La Guerra del Desierto",
            desc: "<b>Victoria:</b> Hay Legiones Atreides en 4 o más regiones de Desierto (sin Sietch).",
            file: "obj_7.png",
            logic: "<ul><li><b>Movimiento IA:</b> Expansión agresiva. Mover legiones a cualquier zona de desierto vacía.</li><li><b>Estrategia:</b> Prioriza la cantidad de zonas ocupadas sobre la calidad de la defensa.</li></ul>"
        },
        {
            id: 8,
            title: "El Lisan Al-Gaib",
            desc: "<b>Victoria:</b> Revelar 2 Fichas de Despliegue en la región de Paul.",
            file: "obj_8.png",
            logic: "<ul><li><b>Movimiento IA:</b> La prioridad no es el movimiento geográfico, sino la concentración de fuerzas.</li><li><b>Acción:</b> Utiliza acciones de despliegue (++) en la zona de Paul para fortificarlo.</li></ul>"
        }
    ];

    // Mapped to files: tactica (1).jpg to tactica (8).jpg
    const tacticalSietches = [
        "Sietch Tabr", "Sietch Habbanya", "Sietch Tuono", "Sietch Tuek",
        "Sietch Umbu", "Sietch Chinna", "Sietch Timin", "Sietch Jacurutu"
    ];

    // --- State ---
    let state = {
        round: 1,
        score: 0,
        target: 20,
        deck: [],     // Array of card IDs (numbers)
        discard: [],  // Array of card IDs
        objDeck: [],  // Array of Objective Objects
        tactDeck: [], // Array of Strings (Sietch Names)
        currentObjective: null,
        currentTactics: [], // [Defensive, Offensive]
    };

    // --- Core Logic ---

    function init() {
        const diffSelect = document.getElementById('difficulty');
        state.target = parseInt(diffSelect.value);
        state.score = 0;
        state.round = 1;

        // Reset Decks
        initDecisionDeck();
        state.objDeck = shuffle([...objectivesData]);

        // Init Tactics (Indices 0-7)
        let tacticIndices = Array.from({ length: 8 }, (_, i) => i + 1);
        state.tactDeck = tacticIndices; // We reshuffle this every round

        UI.hideSetup();
        updateStatus();
        startRound();
    }

    function initDecisionDeck() {
        // Create deck of indices 0 to TOTAL-1 (corresponding to cardsData)
        let indices = Array.from({ length: TOTAL_DECISION_CARDS }, (_, i) => i);
        indices = shuffle(indices);

        // Rule: Remove 2 cards unseen
        state.discard = indices.slice(0, 2);
        state.deck = indices.slice(2);

        console.log("Deck Initialized. Removed:", state.discard.length);
    }

    function startRound() {
        if (state.objDeck.length === 0) {
            state.objDeck = shuffle([...objectivesData]);
        }
        state.currentObjective = state.objDeck.pop();

        let tDeck = shuffle([...state.tactDeck]);
        const defId = tDeck[0];
        const offId = tDeck[1];

        state.currentTactics = [
            { name: tacticalSietches[defId - 1], file: `tactica (${defId}).jpg` },
            { name: tacticalSietches[offId - 1], file: `tactica (${offId}).jpg` }
        ];

        UI.updateRound(state.round);
        UI.renderObjective(state.currentObjective);
        UI.renderTactics(state.currentTactics);
        UI.resetCardArea();
    }

    function nextRound() {
        if (!confirm("¿Confirmar fin de ronda?\nAsegúrate de haber sumado la Presciencia si corresponde.")) return;
        state.round++;
        startRound();
        updateStatus();
    }

    function drawCard() {
        if (state.deck.length === 0) {
            alert("Mazo agotado. Barajando descartes y cartas retiradas...");
            initDecisionDeck();
        }

        const cardIndex = state.deck.pop();
        state.discard.push(cardIndex);

        const card = cardsData[cardIndex];
        // Pass card data to UI
        UI.renderDecisionCard(card);
        updateStatus();
    }

    function updateScore(val) {
        state.score += val;
        if (state.score < 0) state.score = 0;
        updateStatus();

        if (state.score >= state.target) {
            UI.playVictoryVideo();
        }
    }

    function updateStatus() {
        UI.updateScore(state.score, state.target);
        UI.updateDeckCount(state.deck.length);
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function getCardData(index) {
        return cardsData[index];
    }

    // --- Public API ---
    return {
        init,
        drawCard,
        nextRound,
        updateScore,
        getCardData
    };

})();

/**
 * UI Controller
 */
const UI = (function () {

    let activeObjective = null;

    function hideSetup() {
        const el = document.getElementById('setupScreen');
        el.classList.add('hidden');
        setTimeout(() => el.style.display = 'none', 300);
    }

    function toggleMenu() {
        if (confirm("¿Volver al menú principal? Se perderá el progreso.")) {
            location.reload();
        }
    }

    function toggleModal(id) {
        const el = document.getElementById(id);
        el.classList.toggle('active');
    }

    function expandCard(type) {
        if (type === 'objective' && activeObjective) {
            showObjectiveDetails(activeObjective);
        }
    }

    function updateScore(score, target) {
        const el = document.getElementById('scoreDisplay');
        el.innerText = score;
        document.getElementById('targetDisplay').innerText = `/ ${target}`;

        if (score >= target) el.style.color = 'var(--dune-spice)';
        else el.style.color = '#fff';
    }

    function updateDeckCount(count) {
        document.getElementById('deckCount').innerText = `${count} Cartas`;
    }

    function updateRound(r) {
        document.getElementById('roundDisplay').innerText = r;
    }

    function renderObjective(obj) {
        activeObjective = obj; // Store for click handler
        const el = document.getElementById('objImg');
        el.src = obj.file;
        el.alt = obj.title;
    }

    function renderTactics(tactics) {
        document.getElementById('defSietchImg').src = tactics[0].file;
        document.getElementById('defSietchImg').alt = tactics[0].name;

        document.getElementById('offSietchImg').src = tactics[1].file;
        document.getElementById('offSietchImg').alt = tactics[1].name;
    }

    // New Function to show Objective Details
    const showObjectiveDetails = (obj) => {
        const content = `
            <h3>${obj.title}</h3>
            <p><strong>Condición:</strong> ${obj.desc}</p>
            <div class="step-box">
                <strong>Efecto Automático:</strong><br>
                ${obj.logic}
            </div>
            <div style="margin-top: 15px; text-align: center;">
                <img src="${obj.file}" style="max-width: 100%; border-radius: 8px;">
            </div>
        `;
        const modalBody = document.getElementById('detailsContent');
        modalBody.innerHTML = content;
        toggleModal('detailsModal');
    };

    let activeDecisionCard = null; // Store current decision card

    function renderDecisionCard(card) {
        activeDecisionCard = card;
        const container = document.getElementById('activeCardContainer');
        const empty = document.getElementById('emptyState');
        const img = document.getElementById('activeCardImg');

        img.src = card.file;

        // Pre-populate NOT needed here anymore, handled by showDecisionDetails
        // But we leave it empty or default? No, better to purely rely on the click.

        empty.classList.add('hidden');
        container.classList.remove('hidden');

        // Reset animation
        container.style.animation = 'none';
        container.offsetHeight;
        container.style.animation = null;
    }

    const showDecisionDetails = () => {
        if (!activeDecisionCard) return;

        const card = activeDecisionCard;
        const details = document.getElementById('detailsContent');

        details.innerHTML = `
            <div class="step-box step-check">
                <p class="step-title">CONDICIÓN</p>
                <p class="step-desc">${card.cond}</p>
            </div>

            <div class="step-box step-action">
                <p class="step-title">SI SE CUMPLE:</p>
                <p class="step-desc">${card.ifTrue}</p>
            </div>
            
            <div class="step-box" style="border-left: 4px solid #888;">
                <p class="step-title">SINO (Else):</p>
                <p class="step-desc" style="color: #ccc;">${card.ifFalse}</p>
            </div>
            
            <div style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #555;">
                <p class="step-title">ACCIÓN ADICIONAL</p>
                <p style="color: #dba764;">➕ ${card.add}</p>
            </div>
        `;
        toggleModal('detailsModal');
    };

    function resetCardArea() {
        document.getElementById('activeCardContainer').classList.add('hidden');
        document.getElementById('emptyState').classList.remove('hidden');
    }

    // Rules Pagination State
    let currentRulePage = 1;
    const totalRulePages = 6;

    function initRules() {
        const rulesContainer = document.getElementById('rulesContent');
        renderRulePage(); // Initial render
    }

    function renderRulePage() {
        const rulesContainer = document.getElementById('rulesContent');

        const html = `
            <div class="rules-navigation">
                <button class="nav-btn" onclick="UI.changeRulePage(-1)" ${currentRulePage === 1 ? 'disabled' : ''}>⬅ Prev</button>
                <span class="page-indicator">Página ${currentRulePage} / ${totalRulePages}</span>
                <button class="nav-btn" onclick="UI.changeRulePage(1)" ${currentRulePage === totalRulePages ? 'disabled' : ''}>Next ➡</button>
            </div>
            
            <div class="rules-gallery single-view">
                <div class="rules-page active">
                    <img src="rules_${currentRulePage}.jpg" 
                         alt="Reglamento Página ${currentRulePage}" 
                         onerror="this.src='placeholder_error.png'; this.alt='Error cargando imagen'"
                         loading="eager">
                </div>
            </div>
        `;

        rulesContainer.innerHTML = html;
        // Scroll to top of modal content to ensure visibility
        rulesContainer.scrollTop = 0;
    }

    function changeRulePage(delta) {
        const newPage = currentRulePage + delta;
        if (newPage >= 1 && newPage <= totalRulePages) {
            currentRulePage = newPage;
            renderRulePage();
        }
    }

    // Call initRules on load (or explicitly)
    setTimeout(initRules, 500);


    function playVictoryVideo() {
        const modal = document.getElementById('videoModal');
        const video = document.getElementById('victoryVideo');
        modal.classList.add('active');
        video.currentTime = 0;
        video.play().catch(e => console.log("Auto-play prevented:", e));
    }

    function closeVideo() {
        const modal = document.getElementById('videoModal');
        const video = document.getElementById('victoryVideo');
        video.pause();
        modal.classList.remove('active');
    }

    return {
        hideSetup,
        toggleMenu,
        toggleModal,
        expandCard,
        updateScore,
        updateDeckCount,
        updateRound,
        renderObjective,
        renderTactics,
        renderDecisionCard,
        showObjectiveDetails,
        showDecisionDetails,
        resetCardArea,
        playVictoryVideo,
        closeVideo,
        changeRulePage
    };

})();
