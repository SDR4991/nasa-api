const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

//API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function createDOMNodes (page) {
    const currentArray = page === 'results' ? resultsArray : Object.values(favorites);
    currentArray.forEach((result)=>{
        // Card
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target = '_blank';
        // Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card - body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        //Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        //Text Paragraph
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if(page === 'results'){
            saveText.textContent = 'Add to Favorites';
            saveText.setAttribute('onclick',`saveFavorite('${result.url}')`);
        }else {
            saveText.textContent = 'Remove Favorites';
            saveText.setAttribute('onclick',`removeFavorite('${result.url}')`);
        }
        //Card Text 
        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.textContent = result.explanation;
        // Footer
        const footer = document.createElement('small');
        footer.classList.add('small');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        //Append

        footer.append(date,copyright);
        cardBody.append(cardTitle,saveText,cardText,footer);
        link.appendChild(image);
        card.append(link,cardBody);
        imagesContainer.appendChild(card);
    })
}

function showContent(page){
    window.scrollTo({top:0, behavior:'instant'});
    if(page === 'results'){
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    }else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    };
    loader.classList.add('hidden');
}

function updateDOM(page){
    if(localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);
    showContent(page);
}

// Get 10 images
async function getNasaImages(){
    /* loader.classList.remove('hidden'); */
    try{
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('results');
    }catch(error){

    }
}

function saveFavorite(itemUrl){
    resultsArray.forEach((item)=>{
        if(item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;
            saveConfirmed.hidden = false;
            setTimeout(()=>{
                saveConfirmed.hidden = true;
            },2000);
            localStorage.setItem('nasaFavorites',JSON.stringify(favorites));
        }
    })
}

function removeFavorite(itemUrl){
    if(favorites[itemUrl]){
        delete favorites[itemUrl];
        localStorage.setItem('nasaFavorites',JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

getNasaImages();

