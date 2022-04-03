const endpoint = '/api/attraction'

const url = window.location.href
const splitedUrl = url.split('/')
let id = splitedUrl[splitedUrl.length-1]

// console.log('attr-id:',id)

fetch(`${endpoint}/${id}`, {
    method: "GET",
    })
    .then((res) => res.json())
    .then(
        (res) => {
        // console.log('data-fetched:',res)
        renderAttraction(res);
    })
    .catch(
        (err) => {
        console.log(err)
    });

function renderAttraction(res){
    const carousel = document.getElementById('carousel')
    const bookTourNames = document.getElementById('book-tour-names')
    const description = document.getElementById('description')
    const address = document.getElementById('address')
    const transport = document.getElementById('transport')
    const dots = document.getElementById('dots')

    const data = res.data

    function renderNameCatAndMRT(){
        const attractionName = document.createElement("div");
        attractionName.className='attraction-name'
        const categoryAndMRT = document.createElement("div");
        categoryAndMRT.className='categoryAndMRT'

        attractionName.textContent=data.name
        categoryAndMRT.textContent=`${data.category} at ${data.mrt}`

        bookTourNames.appendChild(attractionName)
        bookTourNames.appendChild(categoryAndMRT)
    }

    function renderAttractionDetails(){
        const attrDescription = document.createElement("p");
        const attrAddress = document.createElement("span");
        const attrTransport = document.createElement("span");

        attrDescription.id='attr-description'
        attrAddress.id='attr-address'
        attrTransport.id='attr-transport'

        attrDescription.textContent=data.description
        attrAddress.textContent=data.address
        attrTransport.textContent=data.transport

        description.appendChild(attrDescription)
        address.appendChild(attrAddress)
        transport.appendChild(attrTransport)
    }

    function renderImage(){
        let carouselPic = document.createElement("div");
        carouselPic.className='carousel-pic'

        let images = data.images.split(',')
        let startIndex = 0
        let imageSrc = images[startIndex]
        

        for(let i=0;i < images.length;i++){
            const carouselDot = document.createElement("input");
            carouselDot.className='carousel-dot'
            carouselDot.id=`dot${i}`
            carouselDot.setAttribute("type", "radio");
            dots.appendChild(carouselDot)
        }

        carouselPic.style.backgroundImage = `url(${imageSrc})`
        document.getElementById(`dot${startIndex}`).checked = true
        let isCarousel =true

        function carouselStart(){
            isCarousel = true
            console.log(isCarousel)
            const activeDot = document.getElementById(`dot${startIndex}`)
            const lastDot = document.getElementById(`dot${startIndex-1}`)
            const finalDot = document.getElementById(`dot${images.length-1}`)
            // console.log('startIndex ',startIndex)
            if(startIndex === images.length-1){
                // console.log('startIndex ',startIndex)
                imageSrc = images[startIndex]
                carouselPic.style.backgroundImage = `url(${imageSrc})`
                startIndex = 0
                // console.log('nextIndex ',startIndex)
                activeDot.checked = true
                lastDot.checked = false
            } else {
                if(startIndex === 0){
                    activeDot.checked = true
                    finalDot.checked = false
                }
                if(startIndex !== 0){
                    lastDot.checked = false
                }
                console.log('actIndex ',startIndex)
                imageSrc = images[startIndex]
                carouselPic.style.backgroundImage = `url(${imageSrc})`
                startIndex += 1
                console.log('nextIndex ',startIndex)
                activeDot.checked = true
            }
            isCarousel = false
            console.log(isCarousel)
        }
        
            carousel.appendChild(carouselPic) 

        let carouselReset = setInterval(carouselStart,2000)
        
        const nextBtn = document.getElementById('next-btn')
        const lastBtn = document.getElementById('last-btn')
        const allDot = document.getElementsByClassName('carousel-dot')

        nextBtn.addEventListener('click',(e)=>{
            e.preventDefault()
            console.log('next clicked')
            Object.values(allDot).forEach(e => {
                    e.checked = false
            });

            console.log(isCarousel)
            if(startIndex < images.length - 1){ 
                startIndex = isCarousel ? startIndex + 1 : startIndex
            }
            else if(startIndex === images.length - 1){ 
                startIndex = isCarousel ? 0 : startIndex }

            document.getElementById(`dot${startIndex}`).checked = true
            imageSrc = images[startIndex]
            carouselPic.style.backgroundImage = `url(${imageSrc})`
            // console.log('afterclick ',startIndex)
            clearInterval(carouselReset)
            carouselReset = setInterval(carouselStart,2000)
            isCarousel = true
            console.log(isCarousel)
            console.log(startIndex)
        })

        lastBtn.addEventListener('click',(e)=>{
            e.preventDefault()
            console.log('last clicked')
            Object.values(allDot).forEach(e => {
                e.checked = false
            });
            console.log(isCarousel)
            if(startIndex === images.length - 1){ 
                console.log('last')
                startIndex = isCarousel ? startIndex - 1 : startIndex
            }
            else if(startIndex !== 0){ 
                console.log('between')
                startIndex = isCarousel ? startIndex - 1 : startIndex - 1
            }
            else if(startIndex === 0){ startIndex = images.length - 1 }

            document.getElementById(`dot${startIndex}`).checked = true
            imageSrc = images[startIndex]
            carouselPic.style.backgroundImage = `url(${imageSrc})`
            // console.log('afterclick ',startIndex)
            clearInterval(carouselReset)
            carouselReset = setInterval(carouselStart,2000)
            isCarousel = true
            console.log(isCarousel)
            console.log(startIndex)
        })    
        }

        

    renderImage()
    renderNameCatAndMRT()
    renderAttractionDetails()
}