const main = document.querySelector('.main'); 
const charactersSection = document.querySelector(".characters");
const comicsSection = document.querySelector(".comics");
const allCharactersContainer = document.querySelector(".characters-all");
const moreCharactersBtn = document.querySelector("#moreCharacters");
const moreComicsBtn = document.querySelector("#moreComics");
const informationCharacters = document.querySelector(".information-characters");
const containerInfo = document.querySelector(".container-info");
const inputHeader = document.querySelector('.input-header');
const resultSearchContainer = document.querySelector(".search-container");
const loader = document.getElementById('loader');
const charactersSwitch = document.querySelector("#characters-switch");
const comicsSwitch = document.querySelector("#comics-switch");
const allComicsContainer = document.querySelector(".comics-all");

const URL = "https://gateway.marvel.com:443/";
const publicApiKey = "da07fc4da480f7252b7a2c23dad22b62";

let limitCharacters = 8;
let offsetCharacters = 0;
let limitComics = 8;
let offsetComics = 0;

const getData = async (limit, offset) => {
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
        hideLoader();
    }
}

const showLoader = () => {
    loader.style.display = 'block'; 
}

const hideLoader = () => {
    loader.style.display = 'none'; 
}

const getInfoCharacter = async (id) => {
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
        getInfoCharacter(charactersBlock.dataset.id);
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
                getInfoCharacter(button.dataset.characterId);
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

const getDataComics = async (limit, offset) => {
    const res = await fetch(`${URL}v1/public/comics?limit=${limit}&offset=${offset}&apikey=${publicApiKey}`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json();
        const imgData = data.data.results;
        imgData.forEach(element => {
            if (element.thumbnail.path === " ") {
                return;
            }
            const character = `
                <div class="characters-block" data-id="${element.id}">
                    <img src="${element.thumbnail.path}.${element.thumbnail.extension}" alt="${element.title}">
                    <div class="characters-block-description">
                        <h3>${element.title}</h3>
                    </div>
                </div>
            `;
            allComicsContainer.insertAdjacentHTML("beforeend", character);
        });
    }
}

const getComicsInfo = async (id) => {
    const res = await fetch(`https://gateway.marvel.com:443/v1/public/comics/${id}?apikey=${publicApiKey}`)
    if (res.ok) {
        const data = await res.json();
        informationCharacters.innerHTML = "";
        containerInfo.classList.add("shadow");
        informationCharacters.classList.remove("hide");
        informationCharacters.classList.add("col");

        const item = `
            <img src="${data.data.results[0].thumbnail.path}.${data.data.results[0].thumbnail.extension}" alt="${data.data.results[0].name}">
            <span class="close-button">×</span>
            <h3>Title: ${data.data.results[0].title}</h3>
            <span>Creator: ${data.data.results[0].creators.items[0].name}</span>
            <span>Price: ${data.data.results[0].prices[0].price}</span>
            <span>Format: ${data.data.results[0].format}</span>
            <span>Page: ${data.data.results[0].pageCount}</span>
        `;
        informationCharacters.insertAdjacentHTML("beforeend", item);
        document.querySelector(".close-button").addEventListener("click", () => {
            informationCharacters.innerHTML = "";
            containerInfo.classList.remove("shadow");
            informationCharacters.classList.add("hide");
        });

    }
}

const getComics = (e) => {
    const target = e.target;
    const comicsBlock = target.closest(".characters-block");

    if (comicsBlock) {
        getComicsInfo(comicsBlock.dataset.id);
    }
}

moreCharactersBtn.addEventListener("click", () => {
    offsetCharacters += 8;
    getData(limitCharacters, offsetCharacters);
});

moreComicsBtn.addEventListener("click", () => {
    offsetComics += 8;
    getDataComics(limitComics, offsetComics);
})

allCharactersContainer.addEventListener("click", getCharacter);
allComicsContainer.addEventListener("click", getComics);
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
charactersSwitch.addEventListener("click", ()=>{
    charactersSection.classList.remove("hide");
    comicsSection.classList.add("hide");
});
comicsSwitch.addEventListener("click", ()=>{
    charactersSection.classList.add("hide");
    comicsSection.classList.remove("hide");
});

getData(limitCharacters);
getDataComics(limitComics, offsetComics);
