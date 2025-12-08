/**
 * Game Integration Module
 * Hooks the Synergy System into the Level Devil game
 */

class GameIntegration {
    constructor(synergySystem) {
        this.synergySystem = synergySystem;
        this.initialized = false;
        this.gameCanvas = null;
        this.originalGameOver = null;
        this.levelCompleteDetector = null;
        
        this.init();
    }
    
    init() {
        console.log('[Game Integration] Initializing...');
        
        // Wait for game to load
        this.waitForGame().then(() => {
            this.hookIntoGame();
            this.initialized = true;
            console.log('[Game Integration] Ready!');
        });
    }
    
    waitForGame() {
        return new Promise((resolve) => {
            const checkGame = () => {
                // Check if canvas exists
                const canvas = document.querySelector('canvas');
                if (canvas) {
                    this.gameCanvas = canvas;
                    resolve();
                } else {
                    setTimeout(checkGame, 100);
                }
            };
            checkGame();
        });
    }
    
    hookIntoGame() {
        // Hook keyboard events to detect game events
        this.hookKeyboardEvents();
        
        // Monitor game canvas for visual changes
        this.setupGameMonitor();
        
        // Add manual trigger buttons for testing
        this.addDebugControls();
    }
    
    hookKeyboardEvents() {
        // Store original handlers
        const originalKeyDown = window.onkeydown;
        const originalKeyUp = window.onkeyup;
        
        window.addEventListener('keydown', (e) => {
            // Call original handler
            if (originalKeyDown) originalKeyDown(e);
            
            // Check for special debug keys
            if (e.ctrlKey && e.key === 'l') {
                // Ctrl+L to trigger level complete
                e.preventDefault();
                this.triggerLevelComplete();
            }
            if (e.ctrlKey && e.key === 'd') {
                // Ctrl+D to trigger death
                e.preventDefault();
                this.triggerPlayerDeath();
            }
            if (e.ctrlKey && e.key === 's') {
                // Ctrl+S to show card selection
                e.preventDefault();
                this.synergySystem.ui.showCardSelection();
            }
        });
    }
    
    setupGameMonitor() {
        // Monitor for level changes and deaths
        // This is a heuristic approach since we don't have access to game internals
        // TODO: Implement proper game event detection once game internals are accessible
        
        // For now, disabled to avoid unnecessary polling
        // Can be enabled when detectLevelChange is properly implemented
        
        /* 
        let lastGameState = this.captureGameState();
        
        this.monitorInterval = setInterval(() => {
            const currentState = this.captureGameState();
            
            // Detect significant changes that might indicate level complete or death
            if (this.detectLevelChange(lastGameState, currentState)) {
                this.triggerLevelComplete();
            }
            
            lastGameState = currentState;
        }, 500);
        */
    }
    
    captureGameState() {
        // Capture relevant game state information
        return {
            timestamp: Date.now(),
            // Add more state capture as needed
        };
    }
    
    detectLevelChange(oldState, newState) {
        // Implement heuristics to detect level changes
        // This is placeholder - would need game-specific logic
        return false;
    }
    
    triggerLevelComplete() {
        console.log('[Game Integration] Triggering level complete event');
        const event = new CustomEvent('levelComplete', {
            detail: {
                timestamp: Date.now()
            }
        });
        window.dispatchEvent(event);
    }
    
    triggerPlayerDeath() {
        console.log('[Game Integration] Triggering player death event');
        const event = new CustomEvent('playerDeath', {
            detail: {
                timestamp: Date.now()
            }
        });
        window.dispatchEvent(event);
    }
    
    addDebugControls() {
        const controls = document.createElement('div');
        controls.id = 'debug-controls';
        controls.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: rgba(0, 0, 0, 0.8);
            padding: 10px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;
        
        controls.innerHTML = `
            <div style="color: white; font-size: 12px; margin-bottom: 5px;">
                <strong>Contrôles Debug</strong>
            </div>
            <button id="btn-level-complete" style="
                margin: 2px;
                padding: 5px 10px;
                font-size: 11px;
                cursor: pointer;
                background: #10B981;
                color: white;
                border: none;
                border-radius: 3px;
            ">Niveau Complété (Ctrl+L)</button>
            <button id="btn-player-death" style="
                margin: 2px;
                padding: 5px 10px;
                font-size: 11px;
                cursor: pointer;
                background: #EF4444;
                color: white;
                border: none;
                border-radius: 3px;
            ">Mort (Ctrl+D)</button>
            <button id="btn-card-select" style="
                margin: 2px;
                padding: 5px 10px;
                font-size: 11px;
                cursor: pointer;
                background: #3B82F6;
                color: white;
                border: none;
                border-radius: 3px;
            ">Cartes (Ctrl+S)</button>
            <button id="btn-reset" style="
                margin: 2px;
                padding: 5px 10px;
                font-size: 11px;
                cursor: pointer;
                background: #6B7280;
                color: white;
                border: none;
                border-radius: 3px;
            ">Reset</button>
            <button id="btn-toggle-debug" style="
                margin: 2px;
                padding: 5px 10px;
                font-size: 11px;
                cursor: pointer;
                background: #8B5CF6;
                color: white;
                border: none;
                border-radius: 3px;
            ">Masquer</button>
        `;
        
        document.body.appendChild(controls);
        
        // Add event listeners
        document.getElementById('btn-level-complete').addEventListener('click', () => {
            this.triggerLevelComplete();
        });
        
        document.getElementById('btn-player-death').addEventListener('click', () => {
            this.triggerPlayerDeath();
        });
        
        document.getElementById('btn-card-select').addEventListener('click', () => {
            this.synergySystem.ui.showCardSelection();
        });
        
        document.getElementById('btn-reset').addEventListener('click', () => {
            localStorage.removeItem('synergyState');
            location.reload();
        });
        
        document.getElementById('btn-toggle-debug').addEventListener('click', (e) => {
            const buttons = controls.querySelectorAll('button:not(#btn-toggle-debug)');
            const info = controls.querySelector('div');
            const isHidden = buttons[0].style.display === 'none';
            
            buttons.forEach(btn => {
                btn.style.display = isHidden ? 'inline-block' : 'none';
            });
            info.style.display = isHidden ? 'block' : 'none';
            
            e.target.textContent = isHidden ? 'Masquer' : 'Afficher';
        });
    }
    
    applyCardEffects() {
        // Apply active card effects to the game
        const activeCards = this.synergySystem.inventory.getActiveCards();
        
        activeCards.forEach(card => {
            this.applyEffect(card);
        });
    }
    
    applyEffect(card) {
        console.log('[Game Integration] Applying effect:', card.effect);
        
        // This would contain game-specific logic to apply effects
        // Since we don't have access to game internals, we'd need to use
        // DOM manipulation, canvas interception, or other techniques
        
        switch(card.effect) {
            case 'speedBoost':
                this.applySpeedBoost();
                break;
            case 'doubleJump':
                this.applyDoubleJump();
                break;
            case 'ghostSprint':
                this.applyGhostSprint();
                break;
            // Add more effect handlers
        }
    }
    
    applySpeedBoost() {
        // Placeholder for speed boost implementation
        console.log('[Effects] Speed boost active');
    }
    
    applyDoubleJump() {
        // Placeholder for double jump implementation
        console.log('[Effects] Double jump active');
    }
    
    applyGhostSprint() {
        // Placeholder for ghost sprint implementation
        console.log('[Effects] Ghost sprint active');
    }
}

// Initialize integration when synergy system is ready
window.addEventListener('load', () => {
    if (window.synergySystem) {
        window.gameIntegration = new GameIntegration(window.synergySystem);
    } else {
        // Wait for synergy system
        const checkSynergy = setInterval(() => {
            if (window.synergySystem) {
                clearInterval(checkSynergy);
                window.gameIntegration = new GameIntegration(window.synergySystem);
            }
        }, 100);
    }
});
