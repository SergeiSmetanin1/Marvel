const main = document.querySelector('.main'); 
const allCharactersContainer = document.querySelector(".characters-all");
const moreCharactersBtn = document.querySelector("#moreCharacters");
const informationCharacters = document.querySelector(".information-characters");
const containerInfo = document.querySelector(".container-info");
const inputHeader = document.querySelector('.input-header');
const resultSearchContainer = document.querySelector(".search-container");
const loader = document.getElementById('loader');

const URL = "https://gateway.marvel.com:443/";
const publicApiKey = "da07fc4da480f7252b7a2c23dad22b62";

let limitCharacters = 8;
let offsetCharacters = 0;

const getData = async (limit, offset) => {
    // Показываем загрузчик
    showLoader();

    try {
        const res = await fetch(`${URL}v1/public/characters?limit=${limit}&offset=${offset}&apikey=${publicApiKey}`, {
            method: "GET"
        });

        if (res.ok) {
            const data = await res.json();
            const imgData = data.data.results;
            imgData.forEach(element => {
                if (element.thumbnail.path === " ") {
                    console.log(element.thumbnail.path);
                    return;
                }
                const character = `
                    <div class="characters-block" data-id="${element.id}">
                        <img src="${element.thumbnail.path}.${element.thumbnail.extension}" alt="${element.name}">
                        <div class="characters-block-description">
                            <h3>${element.name}</h3>
                        </div>
                    </div>
                `;
                allCharactersContainer.insertAdjacentHTML("beforeend", character);
            });
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        // Скрываем загрузчик после получения ответа (успешного или с ошибкой)
        hideLoader();
    }
}

const showLoader = () => {
    loader.style.display = 'block'; // Показываем загрузчик
}

// Функция для скрытия загрузчика
const hideLoader = () => {
    loader.style.display = 'none'; // Скрываем загрузчик
}

const getDataCharacter = async (id) => {
    const res = await fetch(`${URL}v1/public/characters/${id}?apikey=${publicApiKey}`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json();
        const stories = data.data.results[0].stories.items;
        informationCharacters.innerHTML = "";
        containerInfo.classList.add("shadow");
        informationCharacters.classList.remove("hide");

        const item = `
            <span class="close-button">×</span>
            <img src="${data.data.results[0].thumbnail.path}.${data.data.results[0].thumbnail.extension}" alt="${data.data.results[0].name}">
            <h3>${data.data.results[0].name}</h3>
            <p>${data.data.results[0].description}</p>
            <ul class="characters-comics-list" id="comicsList">
                ${stories.map(story => {
                    return `<li class="char__comics-item">${story.name}</li>`;
                }).join('')}
            </ul>
        `;
        informationCharacters.insertAdjacentHTML("beforeend", item);
        document.querySelector(".close-button").addEventListener("click", () => {
            informationCharacters.innerHTML = "";
            containerInfo.classList.remove("shadow");
            informationCharacters.classList.add("hide");
        });
    }
}

const getCharacter = (e) => {
    const target = e.target;
    const charactersBlock = target.closest(".characters-block");

    if (charactersBlock) {
        getDataCharacter(charactersBlock.dataset.id);
    }
}

const getSearchData = async () => {
    if (!inputHeader.value) {
        resultSearchContainer.classList.add("hide");
        return;
    }

    const res = await fetch(`${URL}v1/public/characters?apikey=${publicApiKey}&nameStartsWith=${inputHeader.value}&limit=100`, {
        method: 'GET'
    })

    if (res.ok) {
        const data = await res.json();
        resultSearchContainer.innerHTML = "";
        resultSearchContainer.classList.remove("hide");
        const results = data.data.results;
        results.forEach(element => {
            const button = document.createElement("span");
            button.classList.add("btnInfo");
            button.dataset.characterId = element.id;
            button.textContent = element.name; 
            button.addEventListener("click", (e) => {
                getDataCharacter(button.dataset.characterId);
            });
            resultSearchContainer.appendChild(button);
        });
    }
}

const mainContainer = (e) => {
    const target = e.target;
    if (!target.classList.contains("btnInfo")) {
        resultSearchContainer.classList.add("hide");
    }
}


moreCharactersBtn.addEventListener("click", () => {
    offsetCharacters = offsetCharacters + 8;
    getData(limitCharacters, offsetCharacters);
})

allCharactersContainer.addEventListener("click", getCharacter);
containerInfo.addEventListener("click", (e) => {
    const target = e.target;
    const cardInfo = target.closest(".information-characters");
    if (!cardInfo) {
        informationCharacters.innerHTML = "";
        containerInfo.classList.remove("shadow");
        informationCharacters.classList.add("hide");
    }

})
inputHeader.addEventListener('input', getSearchData);
inputHeader.addEventListener("click", getSearchData);
main.addEventListener("click", mainContainer);
getData(limitCharacters);
