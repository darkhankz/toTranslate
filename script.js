async function loadEPUB(file) {
    const text = await file.text();
    const chunks = splitTextIntoChunks(text, 1000);
    await translateChunks(chunks);
}

function splitTextIntoChunks(text, chunkSize) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
}

async function translateChunks(chunks) {
    const tableBody = document.getElementById('translation-table');
    for (const chunk of chunks) {
        const translatedText = await translateText(chunk);
        const row = document.createElement('tr');
        const originalCell = document.createElement('td');
        const translatedCell = document.createElement('td');

        originalCell.innerText = chunk;
        translatedCell.innerText = translatedText;

        row.appendChild(originalCell);
        row.appendChild(translatedCell);
        tableBody.appendChild(row);
    }
}

async function translateText(text) {
    const url = `https://libretranslate.com/translate`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            q: text,
            source: 'en',
            target: 'ru',
            format: 'text'
        })
    });

    const data = await response.json();
    return data.translatedText;
}

document.getElementById('file-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const text = e.target.result;
            const chunks = splitTextIntoChunks(text, 1000);
            translateChunks(chunks);
        };
        reader.readAsText(file);
    }
});
