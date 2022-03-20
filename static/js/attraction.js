const endpoint = '/api/attraction'

const url = window.location.href
const splitedUrl = url.split('/')
let id = splitedUrl[splitedUrl.length-1]

console.log('id:',id)

fetch(`${endpoint}/${id}`, {
    method: "GET",
    })
    .then((res) => res.json())
    .then(
        (res) => {
        console.log('fetched:',res)
        renderAttraction(res);
    })
    .catch(
        (err) => {
        console.log(err)
    });

    
    function renderAttraction(res){
    const carousel = document.getElementById('carousel')
    const data = res.data

    function handleImage(){
    const carouselPic = document.createElement("div");
    carouselPic.className='carousel-pic'
    let imageSrc = data.images.split(',')[0]
    console.log(imageSrc)
    
    carouselPic.style.backgroundImage = `url(${imageSrc})`
    carouselPic.style.backgroundRepeat = "no-repeat"
    carouselPic.style.backgroundSize = "cover"
    carouselPic.style.backgroundPosition = "center"
    carouselPic.style.height = "400px"
    carousel.appendChild(carouselPic)
    }
    handleImage()
    
}