const search = document.getElementById('search-input');
const animeList = document.getElementById('scroll-content');
const animeDisplay =  document.getElementById('displayanime');
var lists = animeList.getElementsByClassName('card');
let debounceTimeout;

async function getAnime(animeName) {
    const URL = `https://api.jikan.moe/v4/anime?q=${animeName}&sfw`;
    const res = await fetch(URL);
    const data = await res.json();
    animeList.innerHTML = '';
    data.data.forEach(anime => {
        console.log(anime);
        animeList.innerHTML += 
        `<div class="card" data-id=${anime.mal_id} id="card">
                <img src="${anime.images.jpg.large_image_url}" alt="">
                <h1 class="title">${anime.titles[0].title}</h1>
        </div>`;
    })
}
search.onkeyup = executeAnime;

async function executeAnime(){
    var searchName = search.value;
    if(searchName.length === 0) {
        return;
    } else {
        clearTimeout(debounceTimeout); // clear the previous timeout if any
        debounceTimeout = setTimeout( async () => {
            await getAnime(searchName);
            console.log("good!")
            displayDetails();
        }, 500);
    } 
}


  function displayDetails() {
    var lists = animeList.getElementsByClassName('card');
    console.log(lists);
    
    Array.from(lists).forEach(item => {
      item.addEventListener('click', async () => {
        const result = await fetch(`https://api.jikan.moe/v4/anime/${item.dataset.id}`);
        const parseResult = await result.json();
        console.log(item.dataset.id);
        displayAnime(parseResult);
      })
    })
  }



function displayAnime(animeItem) {
    console.log(animeItem);
    animeDisplay.innerHTML = 
    `
    <div class="container">
                <div class="half1">
                    <img src="${animeItem.data.images.jpg.large_image_url}" alt="">
                    <div class="sub-div">
                        <h1>
                        ${animeItem.data.title}
                        </h1>
                        <h5>
                        ${animeItem.data.duration}
                        </h5>
                        <div class="synopsis">
                        <h2> Synopsis  </h2>
                            <div class="synop-sub">
                                
                                <h5><span>Rating:</span> &nbsp; ${animeItem.data.rating} </h5>
                                <h5><span>Popularity:</span> &nbsp; ${animeItem.data.popularity}</h5>
                                <h5><span>Rank:</span >&nbsp; ${animeItem.data.rank}</h5>
                                   
                            </div>
                        
                        </div>
                        <p>
                            ${animeItem.data.synopsis}
                        </p>
                    </div>
                </div>
                <div class="half2">
                    <div class="score">
                     <h5>
                     Score:
                     </h5> 
                     <h1>
                        ${animeItem.data.score}
    
                     </h1>
                        
                       <h6>
                      ${animeItem.data.scored_by}&nbsp;users    
                       </h6>

                       
                    </div>
                    <div class="more-details">
                        <ul class="list1">
                            <li> <span>Type: </span> ${animeItem.data.type}</li>
                            <li><span>Episodes:</span> ${animeItem.data.episodes}</li>
                            <li><span>Genres: </span>${animeItem.data.genres[0].name}</li>
                           
                        </ul>
                        <ul class="list2">
                            <li><span>Status:</span> ${animeItem.data.status} </li>
                            <li><span>Aired:</span> ${animeItem.data.aired.string} </li>
                            <li><span>Studios:</span> ${animeItem.data.studios[0].name}</li>
                        </ul>
                    </div>
                </div>
            </div>

   
           `;

    animeDisplay.classList.add('overlap');
    animeDisplay.style.zIndex = 2;
}