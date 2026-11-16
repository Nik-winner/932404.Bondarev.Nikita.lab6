// Регистрация Service Worker для PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => {
                console.log('Service Worker успешно зарегистрирован:', reg.scope);
            })
            .catch(err => {
                console.error('Ошибка регистрации Service Worker:', err);
            });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const fetchButton = document.getElementById('fetchTimer');
    
    if (fetchButton) {
        fetchButton.addEventListener('click', async () => {
            const secondsInput = document.getElementById('secondsInput');
            const resultEl = document.getElementById('result');
            const seconds = secondsInput.value;
            
            resultEl.className = 'result';
            resultEl.textContent = 'Загрузка...';
            
            try {
                const response = await fetch(`/api/timer?seconds=${seconds}`);
                const data = await response.json();
                
                if (!response.ok) {
                    resultEl.textContent = `Ошибка ${response.status}: ${data.error}`;
                    resultEl.classList.add('error');
                } else {
                    const formattedData = {
                        'Время начала': new Date(data.start).toLocaleString('ru-RU'),
                        'Время окончания': new Date(data.end).toLocaleString('ru-RU'),
                        'Длительность (сек)': data.durationSeconds,
                        'ISO формат (start)': data.start,
                        'ISO формат (end)': data.end
                    };
                    
                    resultEl.textContent = Object.entries(formattedData)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join('\n');
                    resultEl.classList.add('success');
                }
            } catch (error) {
                resultEl.textContent = 'Сетевая ошибка.';
                resultEl.classList.add('error');
                console.error('Ошибка:', error);
            }
        });
    }
});