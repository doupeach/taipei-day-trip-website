const endpoint = '/api/attractions'

let page;
let searchKeyword

const params = new URL(document.location).searchParams;
const keyword = params.get("keyword");

const ajax = (url) => {
  fetch(url, {
    method: "GET",
  })
    .then((res) => res.json())
    .then(
      (res) => {
      render(res);
    })
    .catch(
      (err) => {
      console.log(err)
    });
};

function render(res) {
  page = res.nextPage
  searchKeyword = document.getElementById("search-value").value
    const cardsDiv = document.createElement("div");
    cardsDiv.className = "cards";
    if(res.data){
    for (let key = 0; key < res.data.length; key++) {
        data = res.data
        const wrap = document.createElement("div");
        wrap.className = "card";
        const link = document.createElement("a");
        link.href = `/attraction/${data[key].id}`
        link.className = 'link'
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
      wrap.appendChild(link);
      link.appendChild(image);
      link.appendChild(title);
      link.appendChild(MRTandCategory);
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
   
    fetch(`${endpoint}?keyword=${searchKeyword}`)
    .then(res => {
      if(res.status === 400){
        return res.json().then(res =>{
          cardsContainer.innerHTML = res.message})
      } else 
      if(res.ok){
        return res.json().then(res => {
          render(res)})}
    })
    .catch(err => {
      console.log(err)
    })
}



