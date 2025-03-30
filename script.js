const peopleData = fetch('json/peopleData.json').then(res => res.json());
const pictureData = fetch('json/pictureData.json').then(res => res.json());

document.querySelectorAll('.nav-icon').forEach(button => {
    button.addEventListener('click', () => showPage(button.dataset.page));
});

document.querySelectorAll('.book-nav-icon').forEach(button => {
    button.addEventListener('click', () => loadPeople(button.dataset.type));
});

document.getElementById('imageCloseButton').addEventListener('click', closeImage);
document.getElementById('personCloseButton').addEventListener('click', closePerson);

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.style.display = 'none');
    document.getElementById(pageId + 'Page').style.display = 'block';

    if (pageId === 'gallery') loadPictures();
    if(pageId === 'book') loadPeople('student');
}

async function loadPeople(type) {
    const data = await peopleData;
    const container = document.querySelector('#bookPage .people-container');
    container.innerHTML = '';

    const people = type === 'teacher' ? data.teachers : data.students;
    people.forEach(person => {
        container.innerHTML += `
            <div class="person-item" data-person='${JSON.stringify(person)}'>
                <img src="${person.image[0]}" alt="${person.name}" data-path="${person.image[0]}">
                <div>${person.name}</div>
            </div>
        `;
    });

    document.querySelectorAll('.person-item').forEach(personItem => {
        personItem.addEventListener('click', () => {
            handlePersonClick(JSON.parse(personItem.dataset.person));
        });
    });
}

function handlePersonClick(person) {
    const isStudent = true

    document.getElementById('personItemPage').style.display = 'block';

    document.getElementById('personItemOpen').src = person.image[0];
    document.getElementById('personName').textContent = person.name;

    if(isStudent) {
        const personInfo = document.getElementById('personInfo');
        personInfo.innerHTML =
            '<div id="personBirthday" class="person-attribute">Birthday: 1.1.2000</div>\n' +
            '<div id="personNationality" class="person-attribute">Nationality: America</div>';
    }
}

async function loadPictures() {
    const data = await pictureData;
    const container = document.querySelector('#galleryPage .picture-container');
    container.innerHTML = '';

    const columnCount = 4; // Amount of Columns
    let columns = [];

    for (let i = 0; i < columnCount; i++) {
        columns.push(document.createElement('div'));
        columns[i].className = 'gallery-column';
        container.appendChild(columns[i]);
    }

    data.pictures.forEach((pic, index) => {
        const picDiv = document.createElement('div');
        picDiv.className = 'gallery-item';
        picDiv.innerHTML = `<img src="${pic.image}" alt="Image" data-path="${pic.image}">`;
        columns[index % columnCount].appendChild(picDiv);
    });

    document.querySelectorAll('.gallery-item img').forEach(img => {
        img.addEventListener('click', () => {
            document.getElementById('galleryItemOpen').src = img.dataset.path;
            document.getElementById('galleryItemPage').style.display = 'block';
        });
    });
}

function closeImage() {
    document.getElementById('galleryItemPage').style.display = 'none';
}

function closePerson() {
    document.getElementById('personItemPage').style.display = 'none';
}

showPage('book');