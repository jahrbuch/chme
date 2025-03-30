let peopleData = null;
let pictureData = null;

fetch('json/peopleData.json')
    .then(response => response.json())
    .then(data => {
        peopleData = data;
        bookClicked();
        loadPeople('student');
    })
    .catch(error => console.error('Error fetching persons data:', error));

fetch('json/pictureData.json')
    .then(response => response.json())
    .then(data => {
        pictureData = data;
        loadPictures();
    })
    .catch(error => console.error('Error fetching picture data:', error));

function bookClicked() {
    document.getElementById('bookPage').style.display = 'block';
    document.getElementById('galleryPage').style.display = 'none';
    document.getElementById('galleryItemPage').style.display = 'none';
}

function galleryClicked() {
    document.getElementById('galleryPage').style.display = 'block';
    document.getElementById('bookPage').style.display = 'none';
    document.getElementById('galleryItemPage').style.display = 'none';
}

function loadPeople(type) {
    const container = document.querySelector('#bookContent .people-container');
    container.innerHTML = '';

    let people = [];
    if (type === 'teacher') {
        people = peopleData.teachers;
    } else if (type === 'student') {
        people = peopleData.students;
    }

    people.forEach(person => {
        const personDiv = document.createElement('div');
        personDiv.className = 'person-item';
        personDiv.innerHTML = `
            <img src="${person.image[0]}" alt="${person.name}" onclick="personClicked('${person.name}')">
            <div>${person.name}</div>
        `;
        container.appendChild(personDiv);
    });
}

function personClicked(name) {
    alert(`Clicked on ${name}`);
}

function loadPictures() {
    const container = document.querySelector('#galleryContent .picture-container');
    container.innerHTML = '';

    let pictures = pictureData.pictures;

    const columnCount = 4; // Amount of Colum
    let columns = [];
    for (let i = 0; i < columnCount; i++) {
        columns.push(document.createElement('div'));
        columns[i].className = 'gallery-column';
        container.appendChild(columns[i]);
    }

    pictures.forEach((pic, index) => {
        const picDiv = document.createElement('div');
        picDiv.className = 'gallery-item';
        picDiv.innerHTML = `<img src="${pic.image}" alt="Image" onclick="pictureClicked('${pic.image}', '${pic.persons}')">`;
        columns[index % columnCount].appendChild(picDiv);
    });
}

function pictureClicked(path, persons) {
    document.getElementById('galleryItemPage').style.display = 'block';

    if (path.includes('.mp4')) {

    } else {
        document.getElementById('galleryItemOpen').style.display = 'block';
        const pictureDiv = document.getElementById("galleryItemOpen");
        pictureDiv.src = path;
    }
}

function closeImage() {
    document.getElementById('galleryItemPage').style.display = 'none';
}