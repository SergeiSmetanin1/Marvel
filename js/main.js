const allCharactersContainer = document.querySelector(".characters-all");
const moreCharactersBtn = document.querySelector("#moreCharacters");
const informationCharacters = document.querySelector(".information-characters");

const URL = "https://gateway.marvel.com:443/";
const publicApiKey = "da07fc4da480f7252b7a2c23dad22b62";

let limitCharacters = 8;

const getData = async (limit) => {
    const res = await fetch(`${URL}v1/public/characters?limit=${limit}&offset=0&apikey=${publicApiKey}`, {
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
        console.log(stories);
        informationCharacters.innerHTML = "";
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
    }
}


const getCharacter = (e) => {
    const target = e.target;
    const charactersBlock = target.closest(".characters-block");

    if (charactersBlock) {
        getDataCharacter(charactersBlock.dataset.id);
    }
}

getData(limitCharacters);

moreCharactersBtn.addEventListener("click", () => {
    limitCharacters = limitCharacters + 8;
    allCharactersContainer.innerHTML = "";
    getData(limitCharacters);
})

allCharactersContainer.addEventListener("click", getCharacter)
