const express = require('express');
const { engine } = require('express-handlebars');

const app = express();
const PORT = 3000;

app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/view/layouts/'
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/view');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Таймер обратного отсчёта',
        studentName: 'Пользователь',
        currentTime: new Date().toLocaleString('ru-RU')
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'О себе',
        university: 'ТГУ',
        institute: 'ИПМКН',
        studentName: 'Пользователь',
        group: '932404',
        year: '3',
        currentTime: new Date().toLocaleString('ru-RU')
    });
});

app.get('/api/timer', (req, res) => {
    const secondsParam = req.query.seconds;

    if (!secondsParam) {
        return res.status(400).json({ 
            error: "Параметр 'seconds' обязателен." 
        });
    }

    const seconds = Number(secondsParam);

    if (isNaN(seconds) || seconds <= 0) {
        return res.status(400).json({ 
            error: "Параметр 'seconds' должен быть положительным числом." 
        });
    }

    const start = new Date();
    const end = new Date(start.getTime() + seconds * 1000);

    res.json({
        start: start.toISOString(),
        end: end.toISOString(),
        durationSeconds: seconds
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});