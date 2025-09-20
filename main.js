// ===== Variablen =====
let resources = 0;
let rps = 0;
let level = 1;
let prestigeBonus = 0;
let upgrades = [
    { name: "Mini Collector", cost: 10, rps: 1, purchased: false },
    { name: "Mega Collector", cost: 50, rps: 5, purchased: false },
    { name: "Galaxy AI", cost: 200, rps: 20, purchased: false },
    { name: "Supernova", cost: 500, rps: 50, purchased: false },
    { name: "Black Hole", cost: 2000, rps: 200, purchased: false }
];

// ===== Elemente =====
const mainMenu = document.getElementById("main-menu");
const gameDiv = document.getElementById("game");
const resourcesSpan = document.getElementById("resources");
const rpsSpan = document.getElementById("rps");
const levelSpan = document.getElementById("level");
const prestigeBonusSpan = document.getElementById("prestigeBonus");
const upgradeList = document.getElementById("upgrade-list");

const clickSound = document.getElementById("click-sound");
const upgradeSound = document.getElementById("upgrade-sound");
const prestigeSound = document.getElementById("prestige-sound");

// ===== Spiel starten / Menü =====
document.getElementById("start-game").addEventListener("click", () => {
    mainMenu.classList.add("hidden");
    gameDiv.classList.remove("hidden");
    updateUpgrades();
});

document.getElementById("back-menu").addEventListener("click", () => {
    gameDiv.classList.add("hidden");
    mainMenu.classList.remove("hidden");
});

// ===== Sammeln =====
document.getElementById("collect-btn").addEventListener("click", () => {
    resources += 1 + prestigeBonus;
    clickSound.play();
    updateStats();
    saveGame();
});

// ===== Spielstand zurücksetzen =====
document.getElementById("reset-game").addEventListener("click", () => {
    if(confirm("Willst du wirklich alles löschen?")) {
        localStorage.removeItem("galaxyCollectorSave");
        resources = 0;
        rps = 0;
        level = 1;
        prestigeBonus = 0;
        upgrades.forEach(u => u.purchased = false);
        updateStats();
        updateUpgrades();
    }
});

// ===== Prestige =====
document.getElementById("prestige-btn").addEventListener("click", () => {
    if (resources >= 1000) {
        prestigeBonus++;
        resources = 0;
        rps = 0;
        level = 1;
        upgrades.forEach(u => u.purchased = false);
        prestigeSound.play();
        updateStats();
        updateUpgrades();
        saveGame();
        alert(`Prestige aktiviert! Bonus: ${prestigeBonus}x`);
    } else {
        alert("Du brauchst mindestens 1000 Ressourcen für Prestige!");
    }
});

// ===== Stats aktualisieren =====
function updateStats() {
    resourcesSpan.textContent = resources;
    rpsSpan.textContent = rps + prestigeBonus;
    levelSpan.textContent = level;
    prestigeBonusSpan.textContent = prestigeBonus;
}

// ===== Upgrades anzeigen =====
function updateUpgrades() {
    upgradeList.innerHTML = "";
    upgrades.forEach((u, i) => {
        if (!u.purchased) {
            const btn = document.createElement("button");
            btn.textContent = `${u.name} - ${u.cost} Ressourcen`;
            btn.className = "upgrade-btn";
            btn.addEventListener("click", () => buyUpgrade(i));
            upgradeList.appendChild(btn);
        }
    });
}

// ===== Upgrade kaufen =====
function buyUpgrade(index) {
    const u = upgrades[index];
    if (resources >= u.cost) {
        resources -= u.cost;
        rps += u.rps;
        u.purchased = true;
        level++;
        upgradeSound.play();
        updateStats();
        updateUpgrades();
        saveGame();
    } else {
        alert("Nicht genug Ressourcen!");
    }
}

// ===== Ressourcen pro Sekunde =====
setInterval(() => {
    resources += rps;
    updateStats();
    saveGame();
}, 1000);

// ===== Spielstand speichern =====
function saveGame() {
    const gameState = {
        resources,
        rps,
        level,
        prestigeBonus,
        upgrades: upgrades.map(u => u.purchased)
    };
    localStorage.setItem("galaxyCollectorSave", JSON.stringify(gameState));
}

// ===== Spielstand laden =====
function loadGame() {
    const saved = localStorage.getItem("galaxyCollectorSave");
    if (saved) {
        const gameState = JSON.parse(saved);
        resources = gameState.resources;
        rps = gameState.rps;
        level = gameState.level;
        prestigeBonus = gameState.prestigeBonus;
        upgrades.forEach((u, i) => u.purchased = gameState.upgrades[i]);
        updateStats();
        updateUpgrades();
    }
}

// ===== Automatisch laden beim Start =====
loadGame();
