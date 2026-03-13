import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters import CommandStart
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

# Твій токен
API_TOKEN = '8799917595:AAFyDcvVem0LD5p6j652SbcxBqNqm-veiJ8'

# Логування
logging.basicConfig(level=logging.INFO)

bot = Bot(token=API_TOKEN)
dp = Dispatcher()

@dp.message(CommandStart())
async def cmd_start(message: types.Message):
    # Створюємо кнопку для Web App
    markup = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(
                text="Відкрити RybalkaGram", 
                web_app=WebAppInfo(url="https://rybalkagram.onrender.com")
            )
        ]
    ])
    
    await message.answer("Привіт! Натисни кнопку нижче, щоб відкрити сайт:", reply_markup=markup)

async def main():
    await dp.start_polling(bot)

if __name__ == '__main__':
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print('Бот вимкнений')
