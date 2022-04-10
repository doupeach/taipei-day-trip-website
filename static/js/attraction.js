const endpoint = '/api/attraction'

const url = window.location.href
const splitedUrl = url.split('/')
let id = splitedUrl[splitedUrl.length-1]
let renderData
fetch(`${endpoint}/${id}`, {
    method: "GET",
    })
    .then((res) => res.json())
    .then(
        (res) => {
        renderData = res.data
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
            const activeDot = document.getElementById(`dot${startIndex}`)
            const lastDot = document.getElementById(`dot${startIndex-1}`)
            const finalDot = document.getElementById(`dot${images.length-1}`)

            if(startIndex === images.length-1){
                imageSrc = images[startIndex]
                carouselPic.style.backgroundImage = `url(${imageSrc})`
                startIndex = 0
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
                imageSrc = images[startIndex]
                carouselPic.style.backgroundImage = `url(${imageSrc})`
                startIndex += 1
                activeDot.checked = true
            }
            isCarousel = false
        }
        
            carousel.appendChild(carouselPic) 

        let carouselReset = setInterval(carouselStart,2000)
        
        const nextBtn = document.getElementById('next-btn')
        const lastBtn = document.getElementById('last-btn')
        const allDot = document.getElementsByClassName('carousel-dot')

        nextBtn.addEventListener('click',(e)=>{
            e.preventDefault()
            Object.values(allDot).forEach(e => {
                    e.checked = false
            });
            if(startIndex < images.length - 1){ 
                startIndex = isCarousel ? startIndex + 1 : startIndex
            }
            else if(startIndex === images.length - 1){ 
                startIndex = isCarousel ? 0 : startIndex }

            document.getElementById(`dot${startIndex}`).checked = true
            imageSrc = images[startIndex]
            carouselPic.style.backgroundImage = `url(${imageSrc})`
            clearInterval(carouselReset)
            carouselReset = setInterval(carouselStart,2000)
            isCarousel = true
        })

        lastBtn.addEventListener('click',(e)=>{
            e.preventDefault()
            Object.values(allDot).forEach(e => {
                e.checked = false
            });
            if(startIndex === images.length - 1){ 
                startIndex = isCarousel ? startIndex - 1 : startIndex
            }
            else if(startIndex !== 0){ 
                startIndex = isCarousel ? startIndex - 1 : startIndex - 1
            }
            else if(startIndex === 0){ startIndex = images.length - 1 }

            document.getElementById(`dot${startIndex}`).checked = true
            imageSrc = images[startIndex]
            carouselPic.style.backgroundImage = `url(${imageSrc})`
            clearInterval(carouselReset)
            carouselReset = setInterval(carouselStart,2000)
            isCarousel = true
        })    
        }

    const timeDay = document.getElementById('time-day')
    const timeNight = document.getElementById('time-night')
    const money = document.getElementById('money')

    timeDay.addEventListener('click',()=>{money.innerHTML = '新台幣2000元'})
    timeNight.addEventListener('click',()=>{money.innerHTML = '新台幣2500元'})
        
    renderImage()
    renderNameCatAndMRT()
    renderAttractionDetails()
}



function bookingSubmit(){
    const check_date = document.getElementById("check_date");
    let date = document.getElementById("date").value;
    let src="/api/user";
    const login = document.getElementById("login-btn");
    fetch(src).then(function (response) {
        return response.json();
    }).then(function (result) {
        if(result["data"] != null){
            if(date != ""){
                check_date.style.display="none";
                bookRequest();
            }
            else{
                check_date.style.display="flex";
            }
        }
        else{
            login.click();            
        }
    })
}

function bookRequest(){
    let name = document.getElementsByClassName("attraction-name").textContent;
    let money = document.getElementById("money").textContent;
    let address = document.getElementById("attr-address").textContent;
    if(money == "新台幣2000元"){
        time = "afternoon"; money = 2000;
    } else {
        time = "evening"; money = 2500;
    }
    let toSend = {
        id : url,
        attr_name : name,
        address : address,
        img : renderData.images.split(',')[0],
        date : date,
        time : time,
        money : money
    }
    fetch("/api/booking", {
        method: "POST",
        headers: {
            "Content-Type": "application/json;"
        },
        body: JSON.stringify(toSend)
    }).then(function (response){
        if(response.status == 200){
            window.location.replace("/booking");
        }
    })
}

