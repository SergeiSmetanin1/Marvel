const allCharactersContainer = document.querySelector(".characters-all");
const moreCharactersBtn = document.querySelector("#moreCharacters");
const informationCharacters = document.querySelector(".information-characters");
const containerInfo = document.querySelector(".container-info");
const searchHeader = document.querySelector(".search-header");

const URL = "https://gateway.marvel.com:443/";
const publicApiKey = "da07fc4da480f7252b7a2c23dad22b62";

let limitCharacters = 8;
let offsetCharacters = 0;

const getData = async (limit, offset) => {
    const res = await fetch(`${URL}v1/public/characters?limit=${limit}&offset=${offset}&apikey=${publicApiKey}`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json();
        console.log(data.data.results);
        const imgData = data.data.results;
        imgData.forEach(element => {
            // console.log(`${element.thumbnail.path}.jpg`);
            if (element.thumbnail.path === " ") {
                console.log(element.thumbnail.path);
                return
            }
            const character = `
                <div class="characters-block" data-id="${element.id}">
                    <img src="${element.thumbnail.path}.${element.thumbnail.extension}" alt="#">
                    <div class="characters-block-description">
                        <h3>${element.name}</h3>
                    </div>
                </div>
            `;
            allCharactersContainer.insertAdjacentHTML("beforeend", character);
        });
    }
}
const getDataCharacter = async (id) => {
    const res = await fetch(`${URL}v1/public/characters/${id}?apikey=${publicApiKey}`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json();
        console.log(data.data.results[0].name);
        console.log(data.data.results[0]);
        const stories = data.data.results[0].stories.items;
        informationCharacters.innerHTML = "";
        containerInfo.classList.add("shadow");
        informationCharacters.classList.remove("hide");

        const item = `
            <span class="close-button">×</span>
            <img src="${data.data.results[0].thumbnail.path}.${data.data.results[0].thumbnail.extension}" alt="character-img">
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

const searchCharacters = () => {
    
}

getData(limitCharacters);

moreCharactersBtn.addEventListener("click", () => {
    offsetCharacters = offsetCharacters + 8;
    // allCharactersContainer.innerHTML = "";
    getData(limitCharacters, offsetCharacters);
})

allCharactersContainer.addEventListener("click", getCharacter);
containerInfo.addEventListener("click", (e) => {
    const target = e.target;
    const cardInfo = target.closest(".information-characters");
    if (!cardInfo) {
        console.log(target);
        informationCharacters.innerHTML = "";
        containerInfo.classList.remove("shadow");
        informationCharacters.classList.add("hide");
    }
})
searchHeader.addEventListener("click", searchCharacters)
