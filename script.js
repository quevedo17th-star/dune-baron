/**
 * Dune: War for Arrakis - Atreides Automa
 * Logic & State Management
 */

const Game = (function () {

    // --- Data ---

    // Mapped to files: 1.png to 20.png
    // Verified logic based on analysis of 1.jpg/png to 20.png
    const cardsData = [
        {
            file: "1.png",
            cond: "2+ Gusanos en juego",
            ifTrue: "Ejecutar 2 veces: Ataque de Gusano O Movimiento de Legión. (Prioridad: Desierto)",
            ifFalse: "Colocar 2 Fichas de Gusano (Sietch Defensivo)",
            add: "Jugar Carta de Objetivo"
        },
        {
            file: "5.png", // Corrected per user: Card 2 is Wild Maker
            cond: "Wild Maker en juego",
            ifTrue: "Wild Maker: Ataque / Movimiento (Prioridad: Hagga Basin)",
            ifFalse: "Colocar Wild Maker -> Desierto (Prioridad: Hagga Basin)",
            add: "Estación Ecológica + Ciclar + Combate +1"
        },
        {
            file: "3.png",
            cond: "Verde ≥ 3 Y Rojo ≥ 3",
            ifTrue: "Mover Legión (Montaña -> Erg). Desempate: Polo Norte.",
            ifFalse: "Líder (Paul) + Fichas Despliegue -> Sietch Ofensivo",
            add: "Tanque Regeneración: Líder -> Sietch Defensivo (Paul > Gurney > Stilgar)"
        },
        {
            file: "4.png",
            cond: "Gusano en juego",
            ifTrue: "2x (Ataque Gusano o Mover Legión) -> Prioridad: Polo Norte",
            ifFalse: "Colocar 3 Unidades -> Imperial Basin",
            add: "Resolver Presciencia (Ojo) + Combate +1"
        },
        {
            file: "5.png",
            cond: "Wild Maker en tablero",
            ifTrue: "Wild Maker Ataca o Mueve (Cerca Hagga Basin)",
            ifFalse: "Colocar Wild Maker en Desierto (Cerca Hagga Basin)",
            add: "Revelar Estación Ecológica + Mover Marcador"
        },
        {
            file: "6.png",
            cond: "Amarillo ≥ 3",
            ifTrue: "Colocar Jessica + 1 Ficha Despliegue -> Sietch Defensivo",
            ifFalse: "Colocar Stilgar + 2 Fichas + 1 Unidad -> Desierto (Cerca Leigón, Pri: Hagga Basin)",
            add: "Ciclar Carta (Remplazar) + Combate +1"
        },
        {
            file: "7.png",
            cond: "Verde ≥ 3",
            ifTrue: "Colocar Muad'Dib + 2 Unidades -> Sietch Ofensivo",
            ifFalse: "Colocar 2 Fichas Despliegue -> Asentamiento Hagga Basin",
            add: "Objetivo + Combate +1 Dado"
        },
        {
            file: "8.png",
            cond: "Rojo ≥ 3",
            ifTrue: "Colocar Chani + 2 Fichas -> Sietch Ofensivo",
            ifFalse: "Colocar Wild Maker -> Desierto (Cerca Imperial Basin)",
            add: "Revelar Estación Ecológica + Combate +1 Dado"
        },
        {
            file: "9.png",
            cond: "Rojo ≥ 3 Y Amarillo ≥ 3 Y Gurney",
            ifTrue: "Mover Gurney + Legión -> Asentamiento Polo Norte",
            ifFalse: "Colocar Gurney + 2 Fichas -> Desierto (Cerca Sietch Ofensivo)",
            add: "Tanque Regeneración"
        },
        {
            file: "10.png",
            cond: "Verde ≥ 3 O Amarillo ≥ 3",
            ifTrue: "Asalto (3 Dados): Retirar 1 Pieza HK por Éxito (Ornitóptero > Cosechadora > Unidad)",
            ifFalse: "Colocar Ficha de Bloqueo [+Ban]",
            add: "Jugar Objetivo + Combate +1 Dado"
        },
        {
            file: "11.png",
            cond: "Marcadores ≥ 3",
            ifTrue: "Asalto (x3 Dado Verde): Retirar Unidad por Acierto (Cerca Polo Norte)",
            ifFalse: "Colocar 2 Fichas Gusano -> Desierto (Cerca Legión Fuerte)",
            add: "Acciones + Combate +2 Dados"
        },
        {
            file: "12.png",
            cond: "Verde ≥ 3 Y Amarillo ≥ 3 Y Rojo ≥ 3",
            ifTrue: "Asalto (3 Dados): Retirar 1 Unidad por Éxito/Estrella (Prioridad: Hagga Basin)",
            ifFalse: "Colocar 2 Fichas Gusano -> Desierto con Legión (Prioridad: Hagga Basin)",
            add: "Ganar 1 Acción + Combate +2 Dados"
        },
        {
            file: "13.png",
            cond: "Verde ≥ 3 O Rojo ≥ 3",
            ifTrue: "Retirar Ornitóptero (Cerca Imperial Basin)",
            ifFalse: "Colocar Líder + 2 Fichas -> Sietch Ofensivo",
            add: "Objetivo + Combate +1 Dado"
        },
        {
            file: "14.png",
            cond: "Verde ≥ 3 Y Amarillo ≥ 3 Y Rojo ≥ 3",
            ifTrue: "Colocar Alia + 2 Fichas -> Sietch Defensivo",
            ifFalse: "Colocar 2 Fichas Gusano -> Desierto -> Montaña (Imperial Basin)",
            add: "Retirar Estación Ecológica -> 2 Fichas Gusano (Sietch Defensivo)"
        },
        {
            file: "15.png",
            cond: "Verde ≥ 3 Y Amarillo ≥ 3 Y Rojo ≥ 3",
            ifTrue: "Ataque Gusano x2 (Polo Norte)",
            ifFalse: "Colocar 2 Fichas Gusano -> Desierto (Polo Norte)",
            add: "Estación Ecológica + Ficha BG + Combate +2 Dados"
        },
        {
            file: "16.png",
            cond: "Amarillo ≥ 3 O Rojo ≥ 3",
            ifTrue: "Reclutar Líder Harkonnen (Prioridad Pista)",
            ifFalse: "Mover Legión -> Polo Norte (+Tormenta)",
            add: "Objetivo + Combate +1 Dado"
        },
        {
            file: "17.png",
            cond: "Verde ≥ 3 Y Amarillo ≥ 3 Y Rojo ≥ 3",
            ifTrue: "Usar Atómicas -> Sietch Ofensivo",
            ifFalse: "Colocar Líder + 2 Fichas Despliegue -> Sietch Ofensivo",
            add: "Retirar Estación Ecológica -> Colocar 2 Fichas Gusano (Sietch Defensivo / Polo Norte)"
        },
        {
            file: "18.png",
            cond: "Verde ≥ 3 Y Amarillo ≥ 3 Y Rojo ≥ 3",
            ifTrue: "Cosechadora en Desierto (con <= 2 Legiones) -> Retirar/Atacar",
            ifFalse: "Colocar 2 Fichas Gusano -> Desierto (Sietch Ofensivo)",
            add: "Retirar Estación Ecológica + Carta Presciencia + Combate +2"
        },
        {
            file: "19.png",
            cond: "Marcadores ≥ 6",
            ifTrue: "Ajustar Marcadores (Bajar Alto / Subir Bajo) + Ficha BG",
            ifFalse: "Retirar/Mover Cubo Rojo",
            add: "Tanque Regeneración (Líder -> Sietch Ofensivo)"
        },
        {
            file: "20.png",
            cond: "Marcadores ≥ 6",
            ifTrue: "Ataque Legión (Prioridad: Hagga Basin)",
            ifFalse: "Siguiente Turno: Jugar Dado más a la Derecha (No carta)",
            add: "Tanque Regeneración (Líder -> Sietch Ofensivo)"
        }
    ];

    const TOTAL_DECISION_CARDS = cardsData.length;

    // Mapped to files: obj_1.png to obj_8.png
    const objectivesData = [
        {
            id: 1,
            title: "Recolectores de Rocío",
            desc: "Legiones en 3+ regiones de Meseta",
            file: "obj_1.png",
            logic: "Colocar 1 Unidad (Meseta) -> x2 Colocar Despliegue (Desierto con Legión) -> Gratis: Colocar 1 Unidad (Meseta)"
        },
        {
            id: 2,
            title: "¡Paul el 'Mahdi'!",
            desc: "Revela Sietch donde está Paul",
            file: "obj_2.png",
            logic: "Revelar Sietch donde está Paul (Acción Gratuita)"
        },
        {
            id: 3,
            title: "Disciplina del Agua",
            desc: "Paul/Jessica en Desierto (sin Sietch)",
            file: "obj_3.png",
            logic: "Mover Paul y/o Jessica -> Sietch (Si están en Desierto Profundo sin Sietch)"
        },
        {
            id: 4,
            title: "Trampas de Viento",
            desc: "Legiones en 3+ regiones de Montaña",
            file: "obj_4.png",
            logic: "Colocar 1 Unidad (Montaña) -> x2 Colocar Despliegue -> Gratis: Colocar 1 Unidad (Montaña)"
        },
        {
            id: 5,
            title: "Gusanos Atrofiados",
            desc: "Legiones en 2+ Erg Menor",
            file: "obj_5.png",
            logic: "Colocar Unidad -> Erg Menor -> Colocar Unidad (Donde haya Unidad en Erg Menor)"
        },
        {
            id: 6,
            title: "Entrenamiento BG",
            desc: "Jessica y Paul en mismo Sietch",
            file: "obj_6.png",
            logic: "Revelar Sietch Paul -> Mover Jessica con Paul -> Colocar 2 Tokens Despliegue (Sietch Defensivo)"
        },
        {
            id: 7,
            title: "Guerra del Desierto",
            desc: "Legiones en 4+ Desiertos (sin Sietch)",
            file: "obj_7.png",
            logic: "Mover Unidad -> Desierto ocupado (x2)"
        },
        {
            id: 8,
            title: "Lisan Al-Gaib",
            desc: "Revelar 2 fichas Despliegue con Paul",
            file: "obj_8.png",
            logic: "Revelar Sietch Paul -> 2 Tokens Despliegue -> Ciclar 1 Token"
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

    function renderDecisionCard(card) {
        const container = document.getElementById('activeCardContainer');
        const empty = document.getElementById('emptyState');
        const img = document.getElementById('activeCardImg');

        // Target the modal content div
        const details = document.getElementById('detailsContent');

        img.src = card.file;

        // Populate Modal Content
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

        empty.classList.add('hidden');
        container.classList.remove('hidden');

        // Reset animation
        container.style.animation = 'none';
        container.offsetHeight;
        container.style.animation = null;
    }

    function resetCardArea() {
        document.getElementById('activeCardContainer').classList.add('hidden');
        document.getElementById('emptyState').classList.remove('hidden');
    }

    // Initialize Rules Content
    function initRules() {
        const rulesHTML = `
            <div class="rules-section">
                <h4>📜 1. Preparación (Setup)</h4>
                <p><strong>Configuración General:</strong></p>
                <ul>
                    <li>Prepara el juego normalmente para ti (Harkonnen) y el oponente.</li>
                    <li><strong>NO</strong> des al Automa: Tablero de jugador, Dados, ni Cartas de Planificación.</li>
                </ul>
                <p><strong>Componentes del Automa:</strong></p>
                <ul>
                    <li><strong>Mazo de Decisión:</strong> Baraja las 20 cartas. <strong>Retira las 2 superiores sin mirarlas</strong>. Coloca el resto boca abajo.</li>
                    <li><strong>Mazo de Tácticas:</strong> Baraja las 8 cartas de Tácticas (del modo Mahdi Solo).</li>
                    <li><strong>Mazo de Objetivos:</strong> Baraja las 8 cartas de Rastreo de Objetivo.</li>
                    <li>Retira las cartas de Presciencia de "Fase de Fin de Ronda" y baraja las de "Fase de Resolución de Acción".</li>
                    <li>El Automa comienza con 1 ficha Bene Gesserit.</li>
                </ul>
            </div>

            <div class="rules-section">
                <h4>🔄 2. Secuencia de Ronda</h4>
                <ol>
                    <li><strong>Inicio de la Ronda:</strong>
                        <ul>
                            <li>No robes cartas de Planificación ni Presciencia para el Automa.</li>
                            <li>Descarta la carta de Objetivo de la ronda anterior (salvo en la R1).</li>
                            <li>Roba y revela una nueva <strong>Carta de Objetivo</strong>.</li>
                            <li>Baraja las cartas de Táctica de la ronda anterior (salvo en R1) para formar un nuevo mazo.</li>
                            <li>Roba 1 Táctica para el <strong>Sietch Defensivo</strong> y 1 para el <strong>Sietch Ofensivo</strong>.</li>
                        </ul>
                    </li>
                    <li><strong>Movimiento de Legiones:</strong>
                        <ul>
                            <li>El destino nunca debe violar el límite de apilamiento. Si lo hiciera, elige el siguiente destino en prioridad.</li>
                            <li>El Automa <strong>siempre mueve una legión completa</strong> (incluyendo líderes).</li>
                            <li>Excepción: Si mover dejaría un Sietch vacío, deja 1 unidad (revela ficha de despliegue si es necesario).</li>
                        </ul>
                    </li>
                    <li><strong>Despliegue:</strong>
                        <ul>
                            <li>Despliega <strong>tantas unidades y fichas como sea posible</strong>.</li>
                            <li>La acción se considera completa aunque no se puedan desplegar todas.</li>
                        </ul>
                    </li>
                </ol>
            </div>

            <div class="rules-section">
                <h4>🤖 3. Anatomía de la Carta de Decisión</h4>
                <div class="step-box step-check">
                    <strong>1ª SECCIÓN (Condición):</strong>
                    <br>Contiene la acción a realizar si se cumplen las condiciones de la bandera.
                    <br><em>Los iconos bajo la línea punteada indican el DESEMPATE.</em>
                </div>
                
                <div class="step-box step-action">
                    <strong>2ª SECCIÓN (Else):</strong>
                    <br>Contiene la acción a realizar si la 1ª Sección NO fue posible o no se cumplió.
                </div>

                <div class="step-box" style="border-left: 4px solid #dba764;">
                    <strong>3ª SECCIÓN (Adicional):</strong>
                    <br>Acciones adicionales que se ejecutan SIEMPRE después de completar una de las dos primeras.
                </div>
                
                <p><strong>Notas Clave:</strong></p>
                <ul>
                    <li><strong>"Si puedes, eliges":</strong> Si hay múltiples opciones válidas para cumplir una condición, tú (el jugador) eliges la que sea <strong>peor para ti</strong> (o mejor para el Automa).</li>
                    <li><strong>Marcadores:</strong> Los marcadores de Presciencia NO activan efectos por sí mismos. Solo las cartas lo hacen.</li>
                </ul>
            </div>

            <div class="rules-section">
                <h4>⚔️ 4. Batallas</h4>
                <p>El Automa solo entra en combate si tiene al menos <strong>5 dados</strong> (o si es atacado). Si ataca y tiene menos, prefiere mover.</p>
                
                <p><strong>Valor de Combate (Dados):</strong></p>
                <ul>
                    <li>Se mide SOLO por el número de dados que genera la legión.</li>
                    <li>Diferencia: No distingue entre élite/especial para contar dados, pero sí para bajas.</li>
                    <li><strong>Defensa en Sietch:</strong> Suma el valor defensivo del Sietch al número de dados.</li>
                </ul>

                <p><strong>Secuencia de Batalla:</strong></p>
                <ol>
                    <li>Antes de tirar, puedes descartar cartas de Planificación para cambiar tus resultados.</li>
                    <li>Luego, roba la siguiente Carta de Decisión y mira el símbolo <strong>⚔+1</strong> (abajo derecha 3ª sección).</li>
                    <li>Si aparece, el Automa añade 1 dado (o más). Si ya tiene 6 dados, no tiene efecto.</li>
                    <li>Repite esto en cada ronda de combate.</li>
                </ol>

                <p><strong>Prioridad de Bajas:</strong></p>
                <ol>
                    <li>Más de 1 Líder: Retira 1 Líder (genérico primero).</li>
                    <li>1 Unidad de Élite: Reemplázala por Regular.</li>
                    <li>1 Élite Especial: Reemplázala por Regular.</li>
                    <li>1 Líder y al menos 2 Regulares: Retira 1 Regular.</li>
                    <li>1 Líder y 1 Regular: Retira el Líder.</li>
                    <li>Solo líderes nombrados van al Tanque de Regeneración.</li>
                </ol>
            </div>

            <div class="rules-section">
                <h4>🎯 5. Prioridades de Desempate</h4>
                <p>Si la carta muestra iconos de desempate, úsalos en orden de izquierda a derecha:</p>
                <ul>
                    <li>🛡️/⚔️ <strong>Sietch:</strong> Ofensivo / Defensivo.</li>
                    <li>📍 <strong>Norte:</strong> Legión/Gusano/Área más cercana al Polo Norte.</li>
                    <li>🏭 <strong>Hagga Basin:</strong> Prioridad a esta región.</li>
                </ul>
            </div>
        `;
        document.getElementById('rulesContent').innerHTML = rulesHTML;
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
        resetCardArea,
        playVictoryVideo,
        closeVideo
    };

})();
