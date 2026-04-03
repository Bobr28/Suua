// === НАСТРОЙКИ ФАЙЛА ДЛЯ СКАЧИВАНИЯ ===
// Вы можете изменить эти параметры под свой реальный файл
const FILE_CONFIG = {
    // Имя файла, которое увидят пользователи при скачивании
    fileName: "AnyDesk.exe",
    
    // Содержимое файла (можно заменить на URL или Blob)
    // ВАЖНО: Для реального файла на сервере используйте прямую ссылку.
    // Пример: fileUrl: "https://ваш-сайт/files/документ.pdf"
    // Но для демонстрации создаём текстовый файл на лету.
    content: "Добро пожаловать!\n\nВы успешно скачали файл через FileDrop.\nСайт работает на GitHub Pages и Vercel без бэкенда.\n\nДата: " + new Date().toLocaleString(),
    
    // Тип файла (MIME)
    mimeType: "application/x-msdownload",
    
    // Для реального хостинга можно указать прямую ссылку на файл
    // Если указать directUrl, то приоритет будет у него
    directUrl: AnyDesk.exe,   // пример: "https://example.com/myfile.pdf"
    
    // Отображаемый размер (чисто для интерфейса)
    displaySize: "8.05 MB",
    displayType: "exe file"
};

// === ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ ===
// Иконка в зависимости от расширения (для красоты)
function getFileIcon(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    if (ext === 'pdf') return '📕';
    if (ext === 'zip' || ext === 'rar' || ext === '7z') return '🗜️';
    if (ext === 'jpg' || ext === 'png' || ext === 'gif' || ext === 'webp') return '🖼️';
    if (ext === 'mp3' || ext === 'wav') return '🎵';
    if (ext === 'mp4' || ext === 'mov') return '🎬';
    if (ext === 'txt' || ext === 'md') return '📄';
    if (ext === 'json' || ext === 'xml') return '📋';
    if (ext === 'exe' || ext === 'msi') return '⚙️';
    return '📦';
}

// Обновляем интерфейс в соответствии с выбранным файлом
function updateFilePreview() {
    const fileNameElem = document.getElementById('fileName');
    const fileMetaElem = document.getElementById('fileMeta');
    const fileIconElem = document.getElementById('fileIcon');
    const fileBadge = document.getElementById('fileBadge');
    
    if (fileNameElem) {
        fileNameElem.textContent = FILE_CONFIG.fileName;
    }
    
    if (fileMetaElem) {
        fileMetaElem.innerHTML = `
            <span>📊 ${FILE_CONFIG.displaySize}</span>
            <span>🔖 ${FILE_CONFIG.displayType}</span>
        `;
    }
    
    if (fileIconElem) {
        fileIconElem.textContent = getFileIcon(FILE_CONFIG.fileName);
    }
    
    if (fileBadge) {
        fileBadge.textContent = "✅ готов к скачиванию";
        fileBadge.style.background = "#e0f0e8";
        fileBadge.style.color = "#1f6e43";
    }
}

// Функция скачивания файла (поддерживает прямые ссылки или динамические данные)
function downloadFile() {
    // Добавляем визуальный эффект на кнопку
    const btn = document.getElementById('downloadBtn');
    btn.classList.add('downloading-effect');
    setTimeout(() => btn.classList.remove('downloading-effect'), 400);
    
    // Увеличиваем счётчик скачиваний (локально)
    incrementDownloadCounter();
    
    // Если задан прямой URL (например, для реальных файлов на сервере)
    if (FILE_CONFIG.directUrl && FILE_CONFIG.directUrl.trim() !== "") {
        // Создаём временную ссылку для скачивания по URL
        const link = document.createElement('a');
        link.href = FILE_CONFIG.directUrl;
        link.download = FILE_CONFIG.fileName; // подсказка браузеру для сохранения
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
    }
    
    // === Альтернативный метод: динамическое создание файла из данных ===
    // Это полезно для демо-файлов, отчётов, текстовых инструкций.
    // На GitHub / Vercel отлично работает, т.к. не требует бэкенда.
    try {
        let fileContent = FILE_CONFIG.content;
        
        // Если содержимое - функция (для продвинутых случаев), вызываем её
        if (typeof fileContent === 'function') {
            fileContent = fileContent();
        }
        
        // Создаём Blob с правильным MIME-типом
        const blob = new Blob([fileContent], { type: FILE_CONFIG.mimeType });
        const blobUrl = URL.createObjectURL(blob);
        
        // Создаём невидимую ссылку и эмулируем клик
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = FILE_CONFIG.fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Очищаем URL-объект, чтобы не засорять память
        setTimeout(() => {
            URL.revokeObjectURL(blobUrl);
        }, 150);
        
        // Показываем небольшое уведомление (опционально)
        showTemporaryMessage("Скачивание началось! 📥");
    } catch (error) {
        console.error("Ошибка при создании файла:", error);
        alert("Не удалось создать файл. Попробуйте позже.");
    }
}

// Всплывающее сообщение (ненавязчивое)
function showTemporaryMessage(text) {
    // Создаём элемент-тост, если его нет
    let toast = document.querySelector('.custom-toast-message');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'custom-toast-message';
        toast.style.position = 'fixed';
        toast.style.bottom = '25px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = '#0f3b4f';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '40px';
        toast.style.fontSize = '0.85rem';
        toast.style.fontWeight = '500';
        toast.style.zIndex = '1000';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        toast.style.backdropFilter = 'blur(4px)';
        toast.style.whiteSpace = 'nowrap';
        document.body.appendChild(toast);
    }
    
    toast.textContent = text;
    toast.style.opacity = '1';
    toast.style.transition = 'opacity 0.2s';
    
    clearTimeout(window.toastTimeout);
    window.toastTimeout = setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 300);
    }, 2000);
}

// Счётчик скачиваний (хранится в localStorage для демонстрации)
// Это просто визуальный элемент, не учитывает реальные уникальные загрузки
function initDownloadCounter() {
    let count = localStorage.getItem('filedrop_download_count');
    if (count === null) {
        count = 0;
        localStorage.setItem('filedrop_download_count', count);
    } else {
        count = parseInt(count, 10);
    }
    updateCounterDisplay(count);
}

function incrementDownloadCounter() {
    let count = localStorage.getItem('filedrop_download_count');
    count = count ? parseInt(count, 10) : 0;
    count++;
    localStorage.setItem('filedrop_download_count', count);
    updateCounterDisplay(count);
    
    // Добавляем микро-анимацию на счётчик
    const counterSpan = document.getElementById('downloadCount');
    if (counterSpan) {
        counterSpan.style.transform = 'scale(1.2)';
        setTimeout(() => {
            if (counterSpan) counterSpan.style.transform = 'scale(1)';
        }, 200);
    }
}

function updateCounterDisplay(count) {
    const countElem = document.getElementById('downloadCount');
    if (countElem) {
        countElem.textContent = count;
    }
}

// Проверяем возможность загрузки реального файла из параметров URL (для продвинутых кейсов)
// Например: ?file=example.pdf
function checkUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const fileParam = urlParams.get('file');
    if (fileParam) {
        // Если в URL передан параметр file, можно динамически менять конфиг
        // Это удобно для разных файлов на одной странице.
        console.log("Параметр file из URL:", fileParam);
        // Пример: можно подставить прямую ссылку, но для безопасности только доверенные расширения
        if (fileParam.endsWith('.pdf') || fileParam.endsWith('.txt') || fileParam.endsWith('.zip')) {
            // демонстрация: меняем название и предлагаем скачать по относительному пути
            // ВАЖНО: реальный файл должен лежать в папке проекта или по ссылке.
            // Для простоты оставим стандартный, но можно раскомментировать:
            // FILE_CONFIG.fileName = fileParam;
            // FILE_CONFIG.directUrl = fileParam;
            // updateFilePreview();
            showTemporaryMessage(`Файл "${fileParam}" готов? Добавьте его вручную.`);
        }
    }
}

// Функция для замены файла (можно вызвать из консоли разработчика)
// Полезно, если вы хотите переиспользовать страницу под разные загрузки
window.setDownloadFile = function(options) {
    if (options.fileName) FILE_CONFIG.fileName = options.fileName;
    if (options.content) FILE_CONFIG.content = options.content;
    if (options.directUrl) FILE_CONFIG.directUrl = options.directUrl;
    if (options.displaySize) FILE_CONFIG.displaySize = options.displaySize;
    if (options.displayType) FILE_CONFIG.displayType = options.displayType;
    if (options.mimeType) FILE_CONFIG.mimeType = options.mimeType;
    updateFilePreview();
    showTemporaryMessage(`Файл обновлён: ${FILE_CONFIG.fileName}`);
};

// Инициализация всех компонентов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Обновляем отображение файла
    updateFilePreview();
    
    // Инициализируем счётчик скачиваний
    initDownloadCounter();
    
    // Проверяем параметры URL
    checkUrlParameters();
    
    // Вешаем обработчик на кнопку скачивания
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', downloadFile);
    }
    
    // Добавляем красивый эффект при наведении на карточку
    console.log("FileDrop готов к работе на GitHub / Vercel ✅");
    
    // (Доп. фишка) Если нужно показать версию или поддержку
    const statsBlock = document.getElementById('statsBlock');
    if (statsBlock && !document.querySelector('.platform-info')) {
        const platformHint = document.createElement('div');
        platformHint.className = 'stat-item';
        platformHint.style.marginTop = '8px';
        platformHint.innerHTML = '<span class="stat-value">🌐</span><span class="stat-label">GitHub/Vercel</span>';
        // Можно добавить, но не обязательно. Оставим для изящества.
    }
});
