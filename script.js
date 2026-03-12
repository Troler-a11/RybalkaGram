const tg = window.Telegram.WebApp;
const botToken = "8799917595:AAFyDcvVem0LD5p6j652SbcxBqNqm-veiJ8";
let balance = 50;
let isFishing = false;

function updateUI() {
    document.getElementById('balance').innerText = balance;
    document.getElementById('profile-bal').innerText = balance;
}

function handleAction() {
    if (isFishing) return;
    if (balance < 50) {
        tg.showAlert("У вас немає монет! Зайдіть в профіль.");
        return;
    }

    balance -= 50;
    updateUI();
    isFishing = true;
    
    const btn = document.getElementById('cast-btn');
    const float = document.getElementById('float');
    
    btn.disabled = true;
    btn.innerText = "ЧЕКАЄМО...";
    float.classList.add('float-active');

    // Кльов через 5-30 сек
    const waitTime = Math.floor(Math.random() * 25000) + 5000;

    setTimeout(() => {
        // Візуальний кльов (поплавок смикається)
        float.classList.add('float-bite');
        
        // Вібрація (Жужжання)
        if (tg.HapticFeedback) {
            tg.HapticFeedback.notificationOccurred('warning');
            setTimeout(() => tg.HapticFeedback.impactOccurred('heavy'), 200);
        }

        // Авто-підсікання через 2 сек кльову
        setTimeout(() => {
            finishFishing();
        }, 2000);
        
    }, waitTime);
}

function finishFishing() {
    const float = document.getElementById('float');
    const btn = document.getElementById('cast-btn');
    
    // МАТЕМАТИКА (Тобі в кишеню)
    const roll = Math.random() * 100;
    let result = { e: '🩲', mult: 0 };

    if (roll < 45) result = { e: '🩲', mult: 0 }; // 45% шанс х0
    else if (roll < 80) result = { e: '🐟', mult: Math.random() * (1.1 - 0.1) + 0.1 }; // 35% шанс х0.1-1.1
    else if (roll < 92) result = { e: '🐠', mult: Math.random() * (2.2 - 1.2) + 1.2 }; // 12%
    else if (roll < 97) result = { e: '🐡', mult: Math.random() * (9 - 5) + 5 }; // 5%
    else if (roll < 99.5) result = { e: '🦑', mult: Math.random() * (13 - 10) + 10 }; // 2.5%
    else result = { e: '🦈', mult: Math.random() * (20 - 15) + 15 }; // 0.5% шанс на макс

    const win = Math.floor(50 * result.mult);
    balance += win;

    // Показуємо рибу
    const display = document.getElementById('fish-display');
    display.innerText = result.e;
    display.style.display = 'block';
    
    tg.showAlert(`Зловлено: ${result.e}!\nМножник: x${result.mult.toFixed(2)}\nВиграш: ${win} 🐟🪙`);

    setTimeout(() => {
        display.style.display = 'none';
        float.classList.remove('float-active', 'float-bite');
        btn.disabled = false;
        btn.innerText = "ЗАКИДАТИ ВУДКУ";
        isFishing = false;
        updateUI();
    }, 2000);
}

function showProfile() { document.getElementById('profile-modal').style.display = 'block'; }
function closeProfile() { document.getElementById('profile-modal').style.display = 'none'; }

tg.ready();
updateUI();
