const allCharactersContainer = document.querySelector(".characters-all");
const moreCharactersBtn = document.querySelector("#moreCharacters");

let limitCharacters = 8;

const getData = async (limit) => {
    const res = await fetch(`https://gateway.marvel.com:443/v1/public/characters?limit=${limit}&offset=0&apikey=da07fc4da480f7252b7a2c23dad22b62`, {
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
                    <h3>${element.name}</h3>
                </div>
            `;
            allCharactersContainer.insertAdjacentHTML("beforeend", character);
        });
    }
}
const getDataCharacter = async (id) => {
    const res = await fetch(`https://gateway.marvel.com:443/v1/public/characters/${id}?apikey=da07fc4da480f7252b7a2c23dad22b62`, {
        method: "GET"
    })

    if (res.ok) {
        const data = await res.json();
        console.log(data.data.results[0].name);
    }
}

const getCharacter = (e) => {
    const target = e.target;
    // console.log(target);
    const charactersBlock = target.closest(".characters-block");

    if (charactersBlock) {
        getDataCharacter(charactersBlock.dataset.id)
    }
}

getData(limitCharacters);

moreCharactersBtn.addEventListener("click", () => {
    limitCharacters = limitCharacters + 8;
    allCharactersContainer.innerHTML = "";
    getData(limitCharacters);
})

allCharactersContainer.addEventListener("click", getCharacter)
