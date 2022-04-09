const endpoint = '/api/attractions'
// const endpoint = 'http://35.75.87.149:3000/api/attractions'

let page;
let searchKeyword

console.log('page:',page)
console.log('searchKeyword:',searchKeyword)

const params = new URL(document.location).searchParams;
const keyword = params.get("keyword");

const ajax = (url) => {
  fetch(url, {
    method: "GET",
  })
    .then((res) => res.json())
    .then(
      (res) => {
      console.log('fetched:',res)
      render(res);
    })
    .catch(
      (err) => {
      console.log(err)
    });
};

function render(res) {
  console.log('render start')
  page = res.nextPage
  searchKeyword = document.getElementById("search-value").value
  console.log('Next Page:',page)
    const cardsDiv = document.createElement("div");
    if(res.data){
    for (let key = 0; key < res.data.length; key++) {
        data = res.data
        cardsDiv.className = "cards";
        const wrap = document.createElement("div");
        wrap.className = "card";
        const image = document.createElement("img");
        const title = document.createElement("div");
        const MRTandCategory = document.createElement("div");
        MRTandCategory.className = 'MRTandCategory'
        const MRT = document.createElement("div");
        const category = document.createElement("div");
        title.className = "stitle";
      imageSrc = data[key].images.split(",")[0];
      image.src = imageSrc;
      title.textContent = data[key].name;
      MRT.textContent = data[key].mrt;
      category.textContent = data[key].category;

      MRTandCategory.appendChild(MRT);
      MRTandCategory.appendChild(category);
      wrap.appendChild(image);
      wrap.appendChild(title);
      wrap.appendChild(MRTandCategory);
      cardsDiv.appendChild(wrap);
    }
  } 
    document.getElementById("cards-container").appendChild(cardsDiv);
}


if (page === undefined && searchKeyword === undefined) {
    ajax(endpoint) 
  } 

window.addEventListener("scroll", () => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight) {
    console.log('scroll page',page)
    console.log('scroll keyword',keyword)
    console.log('scroll searchKeyword',searchKeyword)
    const lazyLoadURL = `${endpoint}?page=${page}`;
    if(searchKeyword !== null && page !== null){
      ajax(lazyLoadURL+`&keyword=${searchKeyword}`)
    } else 
    if (page !== null) {
      ajax(lazyLoadURL);
    }
  }
});

function handleSearch(){
  const cardsContainer = document.getElementById("cards-container")
  cardsContainer.innerHTML = ''
  searchKeyword = document.getElementById("search-value").value

  console.log('searchKeyword:',searchKeyword)
   
    fetch(`${endpoint}?keyword=${searchKeyword}`)
    .then(res => {
      console.log(res)
      // if(res.meta.code === 400) {
      //   console.log('Error')}
      if(res.status === 400){
        return res.json().then(res =>{
          console.log(res)
          cardsContainer.innerHTML = res.message})
      } else 
      if(res.ok){
        return res.json().then(res => {
          console.log(res)
          render(res)})}
    })
    .catch(err => {
      console.log(err)
    })
  
}


