const tg = window.Telegram.WebApp;
tg.expand();

let balance = 50;
const castCost = 50;
const botToken = "8799917595:AAFyDcvVem0LD5p6j652SbcxBqNqm-veiJ8";

const fishTypes = [
    { emoji: '🩲', minX: 0, maxX: 0, chance: 30 },      // Сміття (х0)
    { emoji: '🐟', minX: 0.1, maxX: 1.1, chance: 40 },  // Звичайна
    { emoji: '🐠', minX: 1.2, maxX: 2.2, chance: 15 },  // Рідкісна
    { emoji: '🐡', minX: 3, maxX: 5, chance: 8 },      // Дорога
    { emoji: '🦑', minX: 5, maxX: 9, chance: 4 },      // Дуже дорога
    { emoji: '🦞', minX: 10, maxX: 13, chance: 2 },     // Елітна
    { emoji: '🦈', minX: 15, maxX: 20, chance: 1 }      // Легендарна
];

function updateUI() {
    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('profile-bal').innerText = balance.toFixed(2);
}

function startFishing() {
    if (balance < castCost) {
        tg.showAlert("Недостатньо Ribacoins! Поповни баланс у профілі.");
        return;
    }

    balance -= castCost;
    updateUI();
    
    const btn = document.getElementById('cast-btn');
    btn.disabled = true;
    btn.innerText = "ОЧІКУВАННЯ КЛЬОВУ...";

    // Анімація вудки
    document.querySelector('.line').style.height = "150px";

    // Рандомний час очікування (5-30 сек)
    const waitTime = Math.floor(Math.random() * 25000) + 5000;

    setTimeout(() => {
        // Вібрація (кльов!)
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('success');
            tg.HapticFeedback.impactOccurred('heavy');
        }
        
        processCatch();
        
        btn.disabled = false;
        btn.innerText = `ЗАКИДУВАТИ (${castCost} 🐟🪙)`;
        document.querySelector('.line').style.height = "0px";
    }, waitTime);
}

function processCatch() {
    const roll = Math.random() * 100;
    let cumulativeChance = 0;
    let selectedFish = fishTypes[0];

    for (const fish of fishTypes) {
        cumulativeChance += fish.chance;
        if (roll <= cumulativeChance) {
            selectedFish = fish;
            break;
        }
    }

    const multiplier = (Math.random() * (selectedFish.maxX - selectedFish.minX) + selectedFish.minX).toFixed(2);
    const winAmount = castCost * multiplier;
    balance += parseFloat(winAmount);

    showResultPopup(selectedFish.emoji, multiplier, winAmount);
    updateUI();
}

function showResultPopup(emoji, mult, win) {
    const popup = document.getElementById('catch-animation');
    popup.innerHTML = `
        <div class="result-card">
            <div class="result-emoji">${emoji}</div>
            <div class="result-txt">x${mult}</div>
            <div class="result-win">+${win.toFixed(2)} 🐟🪙</div>
        </div>
    `;
    popup.style.display = "block";
    setTimeout(() => { popup.style.display = "none"; }, 3000);
}

function showProfile() {
    document.getElementById('profile-modal').style.display = "block";
    document.getElementById('user-id').innerText = tg.initDataUnsafe.user?.id || "Гість";
}

function closeProfile() {
    document.getElementById('profile-modal').style.display = "none";
}

function depositStars() {
    tg.showAlert("Система поповнення через Telegram Stars (1:1) ініційована. Перейдіть до оплати...");
    // Тут логіка виклику tg.openInvoice()
}

function withdrawGifts() {
    if (balance < 100) {
        tg.showPopup({ message: "Мінімальний вивід — 100 🐟🪙" });
        return;
    }
    tg.showPopup({
        title: "Вивід коштів",
        message: `Вивести ${balance} на подарунки?`,
        buttons: [{type: 'ok', text: 'Так'}, {type: 'cancel'}]
    });
}

updateUI();
