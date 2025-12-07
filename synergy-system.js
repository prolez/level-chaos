/**
 * Level Chaos - Synergy System
 * A card-based modifier system for creating roguelite gameplay
 */

class SynergySystem {
    constructor() {
        this.cards = new CardDatabase();
        this.inventory = new CardInventory();
        this.effects = new EffectManager();
        this.ui = new SynergyUI(this);
        this.gameState = new GameState();
        
        this.initialize();
    }
    
    initialize() {
        console.log('[Synergy System] Initializing...');
        this.setupEventListeners();
        this.loadSavedState();
    }
    
    setupEventListeners() {
        // Hook into game events
        window.addEventListener('levelComplete', (e) => this.onLevelComplete(e));
        window.addEventListener('playerDeath', (e) => this.onPlayerDeath(e));
        window.addEventListener('gameStart', (e) => this.onGameStart(e));
    }
    
    onLevelComplete(event) {
        console.log('[Synergy System] Level completed!');
        this.gameState.incrementLevel();
        this.ui.showCardSelection();
    }
    
    onPlayerDeath(event) {
        console.log('[Synergy System] Player died!');
        this.inventory.removeRecentCard();
        this.gameState.recordDeath();
    }
    
    onGameStart(event) {
        console.log('[Synergy System] Game started!');
        this.gameState.startNewRun();
    }
    
    addCardToInventory(cardId) {
        const card = this.cards.getCard(cardId);
        if (card) {
            this.inventory.addCard(card);
            this.effects.applyCardEffects(card);
            this.checkSynergies();
            this.saveState();
        }
    }
    
    checkSynergies() {
        const activeSynergies = this.effects.detectSynergies(this.inventory.getActiveCards());
        activeSynergies.forEach(synergy => {
            console.log('[Synergy System] Synergy activated:', synergy.name);
            this.ui.showSynergyNotification(synergy);
        });
    }
    
    saveState() {
        localStorage.setItem('synergyState', JSON.stringify({
            inventory: this.inventory.serialize(),
            gameState: this.gameState.serialize()
        }));
    }
    
    loadSavedState() {
        const saved = localStorage.getItem('synergyState');
        if (saved) {
            const state = JSON.parse(saved);
            this.inventory.deserialize(state.inventory);
            this.gameState.deserialize(state.gameState);
        }
    }
}

class CardDatabase {
    constructor() {
        this.cards = this.initializeCards();
    }
    
    initializeCards() {
        return {
            // Level Cards (Trap Modifiers)
            'level_ice': {
                id: 'level_ice',
                type: 'level',
                name: 'Glissement',
                description: 'Le sol est de la glace',
                rarity: 'common',
                effect: 'icyFloor'
            },
            'level_shadow': {
                id: 'level_shadow',
                type: 'level',
                name: 'Ombre',
                description: 'Les ennemis sont invisibles jusqu\'à ce que vous soyez proche',
                rarity: 'common',
                effect: 'invisibleEnemies'
            },
            'level_inversion': {
                id: 'level_inversion',
                type: 'level',
                name: 'Inversion',
                description: 'Le texte des indices est inversé',
                rarity: 'uncommon',
                effect: 'invertedText'
            },
            'level_invisible': {
                id: 'level_invisible',
                type: 'level',
                name: 'Invisible',
                description: 'Certains blocs sont des trous cachés',
                rarity: 'uncommon',
                effect: 'invisibleHoles'
            },
            'level_antigravity': {
                id: 'level_antigravity',
                type: 'level',
                name: 'Anti-Gravité',
                description: 'Saut plus lent',
                rarity: 'rare',
                effect: 'slowGravity'
            },
            'level_switches': {
                id: 'level_switches',
                type: 'level',
                name: 'Interrupteurs',
                description: 'Les blocs changent de l\'état A à B à chaque saut',
                rarity: 'rare',
                effect: 'switchingBlocks'
            },
            'level_symbol_inversion': {
                id: 'level_symbol_inversion',
                type: 'level',
                name: 'Inversion de Symbole',
                description: 'La porte de sortie est la porte de la mort',
                rarity: 'epic',
                effect: 'invertedSymbols'
            },
            
            // Player Cards (Synergy/Abilities)
            'player_double_jump': {
                id: 'player_double_jump',
                type: 'player',
                name: 'Double Saut',
                description: 'Permet de sauter deux fois',
                rarity: 'common',
                effect: 'doubleJump'
            },
            'player_ghost_sprint': {
                id: 'player_ghost_sprint',
                type: 'player',
                name: 'Sprint Fantôme',
                description: 'Traverse brièvement les pièges',
                rarity: 'uncommon',
                effect: 'ghostSprint'
            },
            'player_perceptive_view': {
                id: 'player_perceptive_view',
                type: 'player',
                name: 'Vue Perceptive',
                description: 'Révèle les pièges invisibles de base',
                rarity: 'uncommon',
                effect: 'revealTraps'
            },
            'player_pressure_marker': {
                id: 'player_pressure_marker',
                type: 'player',
                name: 'Marqueur de Pression',
                description: 'Chaque fois que vous marchez, une petite étincelle est générée',
                rarity: 'common',
                effect: 'pressureMarks'
            },
            'player_mind_control': {
                id: 'player_mind_control',
                type: 'player',
                name: 'Contrôle Mental',
                description: 'Peut ralentir le temps en l\'air',
                rarity: 'rare',
                effect: 'timeControl'
            },
            'player_light_jump': {
                id: 'player_light_jump',
                type: 'player',
                name: 'Saut Léger',
                description: 'Votre saut est à peine audible/visible',
                rarity: 'uncommon',
                effect: 'silentJump'
            },
            'player_sixth_sense': {
                id: 'player_sixth_sense',
                type: 'player',
                name: 'Sixième Sens',
                description: 'La sortie réelle émet un faible signal sonore',
                rarity: 'rare',
                effect: 'trueSense'
            },
            'player_titan': {
                id: 'player_titan',
                type: 'player',
                name: 'Le Titan',
                description: '+50% de vitesse, +50% de hauteur de saut, mais sol explosif si immobile',
                rarity: 'epic',
                effect: 'titanPower',
                drawback: 'explosiveGround'
            },
            'player_speed_boost': {
                id: 'player_speed_boost',
                type: 'player',
                name: 'Vitesse Accrue',
                description: 'Augmente la vitesse de mouvement',
                rarity: 'common',
                effect: 'speedBoost',
                stackable: true
            }
        };
    }
    
    getCard(cardId) {
        return this.cards[cardId] ? { ...this.cards[cardId] } : null;
    }
    
    getRandomCards(count, excludeIds = []) {
        const available = Object.values(this.cards)
            .filter(card => !excludeIds.includes(card.id));
        
        const shuffled = available.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
    }
    
    getCardsByType(type) {
        return Object.values(this.cards).filter(card => card.type === type);
    }
}

class CardInventory {
    constructor() {
        this.activeCards = [];
        this.baseCards = [];
    }
    
    addCard(card) {
        this.activeCards.push({
            ...card,
            acquiredAt: Date.now()
        });
        console.log('[Inventory] Card added:', card.name);
    }
    
    removeRecentCard() {
        if (this.activeCards.length > this.baseCards.length) {
            const removed = this.activeCards.pop();
            console.log('[Inventory] Card removed:', removed.name);
            return removed;
        }
        return null;
    }
    
    getActiveCards() {
        return [...this.activeCards];
    }
    
    getCardsByType(type) {
        return this.activeCards.filter(card => card.type === type);
    }
    
    hasCard(cardId) {
        return this.activeCards.some(card => card.id === cardId);
    }
    
    serialize() {
        return {
            activeCards: this.activeCards,
            baseCards: this.baseCards
        };
    }
    
    deserialize(data) {
        this.activeCards = data.activeCards || [];
        this.baseCards = data.baseCards || [];
    }
}

class EffectManager {
    constructor() {
        this.activeEffects = new Map();
        this.synergies = this.initializeSynergies();
    }
    
    initializeSynergies() {
        return [
            {
                name: 'Lévitation Mentale',
                description: 'L\'effet Anti-Gravité devient si prononcé que le joueur peut voler à basse altitude',
                requiredCards: ['level_antigravity', 'player_mind_control'],
                effect: 'mentalLevitation'
            },
            {
                name: 'Piège Réactif',
                description: 'Le saut léger annule l\'effet des Interrupteurs',
                requiredCards: ['level_switches', 'player_light_jump'],
                effect: 'reactiveBypass'
            },
            {
                name: 'Les Faux Amis',
                description: 'Le Sixième Sens ignore l\'Inversion de Symbole',
                requiredCards: ['level_symbol_inversion', 'player_sixth_sense'],
                effect: 'truePath'
            },
            {
                name: 'Révélation par Pression',
                description: 'Le Marqueur de Pression révèle les trous invisibles',
                requiredCards: ['level_invisible', 'player_pressure_marker'],
                effect: 'pressureReveal'
            }
        ];
    }
    
    applyCardEffects(card) {
        this.activeEffects.set(card.id, {
            card: card,
            applied: true
        });
        
        // Apply effect logic here
        console.log('[Effects] Applying effect:', card.effect);
    }
    
    detectSynergies(activeCards) {
        const activeCardIds = activeCards.map(c => c.id);
        const activeSynergies = [];
        
        this.synergies.forEach(synergy => {
            const hasAllCards = synergy.requiredCards.every(reqId => 
                activeCardIds.includes(reqId)
            );
            
            if (hasAllCards) {
                activeSynergies.push(synergy);
            }
        });
        
        return activeSynergies;
    }
    
    getActiveEffect(cardId) {
        return this.activeEffects.get(cardId);
    }
}

class GameState {
    constructor() {
        this.currentRun = 0;
        this.currentLevel = 0;
        this.deaths = 0;
        this.startTime = null;
    }
    
    startNewRun() {
        this.currentRun++;
        this.currentLevel = 0;
        this.deaths = 0;
        this.startTime = Date.now();
    }
    
    incrementLevel() {
        this.currentLevel++;
    }
    
    recordDeath() {
        this.deaths++;
    }
    
    serialize() {
        return {
            currentRun: this.currentRun,
            currentLevel: this.currentLevel,
            deaths: this.deaths,
            startTime: this.startTime
        };
    }
    
    deserialize(data) {
        this.currentRun = data.currentRun || 0;
        this.currentLevel = data.currentLevel || 0;
        this.deaths = data.deaths || 0;
        this.startTime = data.startTime || null;
    }
}

class SynergyUI {
    constructor(synergySystem) {
        this.system = synergySystem;
        this.container = null;
        this.createUIElements();
    }
    
    createUIElements() {
        // Create main container
        this.container = document.createElement('div');
        this.container.id = 'synergy-ui-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        document.body.appendChild(this.container);
        
        // Create card display area
        this.createCardDisplay();
        
        // Create stats display
        this.createStatsDisplay();
    }
    
    createCardDisplay() {
        const display = document.createElement('div');
        display.id = 'active-cards-display';
        display.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 5px;
            pointer-events: auto;
            max-width: 250px;
        `;
        this.container.appendChild(display);
        this.cardDisplay = display;
    }
    
    createStatsDisplay() {
        const stats = document.createElement('div');
        stats.id = 'game-stats-display';
        stats.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 5px;
            color: white;
            font-size: 14px;
        `;
        this.container.appendChild(stats);
        this.statsDisplay = stats;
        this.updateStatsDisplay();
    }
    
    updateCardDisplay() {
        const cards = this.system.inventory.getActiveCards();
        
        let html = '<h3 style="color: white; margin: 0 0 10px 0; font-size: 16px;">Cartes Actives</h3>';
        
        if (cards.length === 0) {
            html += '<p style="color: #888; font-size: 12px;">Aucune carte</p>';
        } else {
            cards.forEach(card => {
                const color = this.getRarityColor(card.rarity);
                html += `
                    <div style="
                        margin-bottom: 8px;
                        padding: 8px;
                        background: rgba(255, 255, 255, 0.1);
                        border-left: 3px solid ${color};
                        border-radius: 3px;
                    ">
                        <div style="color: ${color}; font-weight: bold; font-size: 12px;">${card.name}</div>
                        <div style="color: #ccc; font-size: 10px; margin-top: 2px;">${card.description}</div>
                    </div>
                `;
            });
        }
        
        this.cardDisplay.innerHTML = html;
    }
    
    updateStatsDisplay() {
        const state = this.system.gameState;
        this.statsDisplay.innerHTML = `
            <div style="color: white;">
                <div><strong>Run:</strong> ${state.currentRun}</div>
                <div><strong>Niveau:</strong> ${state.currentLevel}</div>
                <div><strong>Morts:</strong> ${state.deaths}</div>
            </div>
        `;
    }
    
    showCardSelection() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
            pointer-events: auto;
        `;
        
        const cardOptions = this.system.cards.getRandomCards(3);
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: #222;
            padding: 30px;
            border-radius: 10px;
            max-width: 800px;
        `;
        
        let html = '<h2 style="color: white; text-align: center; margin-bottom: 20px;">Choisissez une Carte</h2>';
        html += '<div style="display: flex; gap: 20px; justify-content: center;">';
        
        cardOptions.forEach(card => {
            const color = this.getRarityColor(card.rarity);
            html += `
                <div class="card-option" data-card-id="${card.id}" style="
                    width: 200px;
                    padding: 20px;
                    background: #333;
                    border: 2px solid ${color};
                    border-radius: 8px;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                ">
                    <h3 style="color: ${color}; margin: 0 0 10px 0;">${card.name}</h3>
                    <p style="color: #ccc; font-size: 12px; margin: 0 0 10px 0;">${card.description}</p>
                    <div style="color: ${color}; font-size: 10px; text-transform: uppercase;">${card.rarity}</div>
                    <div style="color: #888; font-size: 10px; margin-top: 5px;">${card.type === 'level' ? '🎨 Niveau' : '🛡️ Joueur'}</div>
                </div>
            `;
        });
        
        html += '</div>';
        content.innerHTML = html;
        modal.appendChild(content);
        this.container.appendChild(modal);
        
        // Add hover effects
        const cardElements = content.querySelectorAll('.card-option');
        cardElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                el.style.transform = 'scale(1.05)';
                el.style.boxShadow = '0 5px 20px rgba(255, 255, 255, 0.3)';
            });
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'scale(1)';
                el.style.boxShadow = 'none';
            });
            el.addEventListener('click', () => {
                const cardId = el.getAttribute('data-card-id');
                this.system.addCardToInventory(cardId);
                modal.remove();
                this.updateCardDisplay();
                this.updateStatsDisplay();
            });
        });
    }
    
    showSynergyNotification(synergy) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            border-radius: 10px;
            color: white;
            text-align: center;
            z-index: 10002;
            pointer-events: none;
            animation: synergyPulse 2s ease-out;
            box-shadow: 0 0 30px rgba(102, 126, 234, 0.7);
        `;
        
        notification.innerHTML = `
            <h2 style="margin: 0 0 10px 0; font-size: 24px;">⚡ SYNERGIE ACTIVÉE ⚡</h2>
            <h3 style="margin: 0 0 10px 0; font-size: 20px;">${synergy.name}</h3>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">${synergy.description}</p>
        `;
        
        // Add animation CSS
        if (!document.getElementById('synergy-animations')) {
            const style = document.createElement('style');
            style.id = 'synergy-animations';
            style.textContent = `
                @keyframes synergyPulse {
                    0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.container.appendChild(notification);
        
        setTimeout(() => notification.remove(), 2000);
    }
    
    getRarityColor(rarity) {
        const colors = {
            common: '#9CA3AF',
            uncommon: '#10B981',
            rare: '#3B82F6',
            epic: '#8B5CF6',
            legendary: '#F59E0B'
        };
        return colors[rarity] || colors.common;
    }
}

// Initialize the synergy system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.synergySystem = new SynergySystem();
    });
} else {
    window.synergySystem = new SynergySystem();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SynergySystem, CardDatabase, CardInventory, EffectManager, GameState, SynergyUI };
}
