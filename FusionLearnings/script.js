document.addEventListener('DOMContentLoaded', function() {
    fetch('sections.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(csvText => {
            const rows = csvText.split('\n').slice(1); // Skip header row
            const sectionsContainer = document.getElementById('sections-container');
            const quickLinksList = document.getElementById('quick-links-list');

            rows.forEach(row => {
                const [section, file] = row.split(',');
                if (section && file) {
                    createSection(sectionsContainer, quickLinksList, section.trim(), file.trim());
                }
            });
        })
        .catch(error => console.error('Error fetching the sections CSV file:', error));
});

function createSection(container, quickLinksList, sectionName, csvFile) {
    const sectionId = sectionName.toLowerCase().replace(/\s+/g, '-');
    
    const sectionTitle = document.createElement('h1');
    sectionTitle.className = 'section-title';
    sectionTitle.textContent = sectionName;
    sectionTitle.id = sectionId;

    const quickLink = document.createElement('li');
    const quickLinkAnchor = document.createElement('a');
    quickLinkAnchor.href = `#${sectionId}`;
    quickLinkAnchor.textContent = sectionName;
    quickLink.appendChild(quickLinkAnchor);
    quickLinksList.appendChild(quickLink);

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>#</th>
                <th>Module</th>
                <th>Title</th>
                <th>SubTitle</th>
                <th>Learning Video</th>
                <th>Fusion Version</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

    container.appendChild(sectionTitle);
    container.appendChild(table);

    fetch(csvFile)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(csvText => {
            const rows = csvText.split('\n').slice(1); // Skip header row
            const tableBody = table.querySelector('tbody');

            rows.forEach(row => {
                const cols = row.split(',');
                const tr = document.createElement('tr');

                cols.forEach(col => {
                    const td = document.createElement('td');
                    td.textContent = col.trim();
                    tr.appendChild(td);
                });

                tableBody.appendChild(tr);
            });
        })
        .catch(error => console.error(`Error fetching the CSV file ${csvFile}:`, error));
}
