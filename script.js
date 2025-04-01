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
    document.getElementById('personItemPage').style.display = 'block';

    document.getElementById('personItemOpen').src = person.image[0];
    document.getElementById('personName').textContent = person.name;
    document.getElementById('personInfo').innerHTML = ``;
    document.getElementById('personDescription').textContent = person.description;

    if (isStudent(person)) {
        document.getElementById('personInfo').innerHTML += `
            <div id="personHeight" class="person-attribute">Height: ${person.height}</div>
            <div id="personBirthday" class="person-attribute">Birthday: ${person.birthday}</div>
            <div id="personNationality" class="person-attribute">Nationality: ${person.nationality}</div>
            <div id="personGender" class="person-attribute">Gender: ${person.gender}</div>
            <div id="personComments" class="person-comments">${person.comments[0]}</div>
        `;
    } else {
        document.getElementById('personInfo').innerHTML += `
            <div id="personComments" class="person-comments">${person.comments[0]}</div>
        `;
    }

    function nextButtonHandler() {
        changePicture('next', person);
    }

    function previousButtonHandler() {
        changePicture('previous', person);
    }

    document.getElementById('personContainer').innerHTML += `
            <div id="nextButton" class="next-button" onclick=nextButtonHandler></div>
            <div id="previousButton" class="previous-button" onclick=previousButtonHandler></div>
        `;

    let commentIndex = 1;
    const comments = person.comments;
    const commentsLength = Object.keys(comments).length

    setInterval(() => {
        if (comments && commentsLength > 0) {
            document.getElementById('personComments').textContent = comments[commentIndex];
            commentIndex = (commentIndex + 1) % commentsLength;
        }
    }, 5000);
}

function changePicture(direction, person) {
    let activeImage = "";

    console.log(person.name);

    if (isStudent(person)) {
        activeImage = "image/student/" + document.getElementById('personItemOpen').src.split('image/student/')[1];
    }else{
        activeImage = "image/teacher/" + document.getElementById('personItemOpen').src.split('image/teacher/')[1];
    }

    let activeImageIndex = 0;

    for(i = 0; i < Object.keys(person.image).length; i++) {
        if (person.image[i] === activeImage) {
            activeImageIndex = i;
            break;
        }
    }

    (direction === 'next') ? activeImageIndex ++ : activeImageIndex--;

    if (activeImageIndex < 0)
        activeImageIndex = Object.keys(person.image).length - 1;
    else if (activeImageIndex >= Object.keys(person.image).length)
        activeImageIndex = 0;

    document.getElementById('personItemOpen').src = person.image[activeImageIndex];
}

function isStudent(person){
    return person.hasOwnProperty('height');
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