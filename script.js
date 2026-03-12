const tg = window.Telegram.WebApp;
const botToken = "8799917595:AAFyDcvVem0LD5p6j652SbcxBqNqm-veiJ8";

let balance = 50;
const cost = 50;

// МАТЕМАТИКА КАЗИНО (Шанси в % сумарно 100)
const lootTable = [
    { e: '🩲', min: 0, max: 0, chance: 45 },    // 45% повний програш
    { e: '🐟', min: 0.1, max: 0.8, chance: 35 }, // 35% мізерний виграш (програш частини грошей)
    { e: '🐠', min: 1.1, max: 1.5, chance: 12 }, // 12% невеликий плюс
    { e: '🐡', min: 2, max: 4, chance: 5 },      // 5% нормальний улов
    { e: '🦑', min: 5, max: 8, chance: 2 },      // 2% рідкість
    { e: '🦈', min: 15, max: 20, chance: 1 }     // 1% ДЖЕКПОТ
];

function startFishing() {
    if (balance < cost) {
        tg.showAlert("Немає Ribacoins! Поповнюй баланс.");
        return;
    }

    balance -= cost;
    updateUI();
    
    const btn = document.getElementById('cast-btn');
    btn.disabled = true;
    btn.innerText = "ЧЕКАЄМО КЛЬОВУ...";

    // Рандом від 5 до 30 сек
    const wait = Math.floor(Math.random() * 25000) + 5000;

    setTimeout(() => {
        // Вібрація
        tg.HapticFeedback.notificationOccurred('warning');
        
        const roll = Math.random() * 100;
        let sum = 0;
        let fish = lootTable[0];

        for (let item of lootTable) {
            sum += item.chance;
            if (roll <= sum) {
                fish = item;
                break;
            }
        }

        const mult = (Math.random() * (fish.max - fish.min) + fish.min).toFixed(2);
        const win = Math.floor(cost * mult);
        balance += win;

        // Показуємо результат
        const res = document.getElementById('catch-animation');
        res.innerText = fish.e;
        res.style.display = "block";
        
        tg.showPopup({
            title: `Ви зловили: ${fish.e}`,
            message: `Множник: x${mult}\nВиграш: ${win} 🐟🪙`,
            buttons: [{type: 'ok'}]
        });

        setTimeout(() => { res.style.display = "none"; }, 2000);
        
        btn.disabled = false;
        btn.innerText = `ЗАКИДУВАТИ (${cost} 🐟🪙)`;
        updateUI();
        
        // Відправка звіту адміну (тобі) через бота
        if (win > 200) {
            fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=ТВІЙ_ID&text=Гравець_${tg.initDataUnsafe.user?.id}_виграв_${win}`);
        }

    }, wait);
}

function updateUI() {
    document.getElementById('balance').innerText = balance;
    document.getElementById('profile-bal').innerText = balance;
}

// Початкове налаштування TG
tg.ready();
tg.setHeaderColor('#001f3f');
