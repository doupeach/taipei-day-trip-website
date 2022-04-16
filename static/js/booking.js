let book_welcome = document.getElementById("book_welcome")
let src_user = "/api/user"
fetch(src_user).then(function (response) {
    return response.json();
}).then(function (result) {
    if(result["data"] == null ){
        window.location.replace("/");
    }
    book_welcome.textContent = "您好，"+result["data"].name+"，待預定的行程如下：";
    booking();
})

function booking(){
    let attr_name = document.getElementById("book_attr_name");
    let attr_date = document.getElementById("book_attr_date");
    let attr_time = document.getElementById("book_attr_time");
    let attr_price = document.getElementById("book_attr_price");
    let attr_address = document.getElementById("book_attr_address");
    let attr_img = document.getElementById("book_attr_img");
    let total_price = document.getElementById("total_price");
    let ybook = document.getElementById("yes_booking");
    let nbook = document.getElementById("no_booking");
    let footer = document.getElementsByClassName('footer')[0]
    let src_attr = "/api/booking"
    fetch(src_attr).then(function (response) {
        return response.json();
    }).then(function (result) {
        book_attr_data = result["data"];
        if(book_attr_data != null){
            ybook.style.display="block";
            nbook.style.display="none";
            
            if(book_attr_data["time"] == "afternoon"){
                attr_time.textContent = "早上 9 點到下午 4 點";
            } else {
                attr_time.textContent = "下午 2 點到晚上 9 點";
            }
            footer.classList.remove('full_height') 
            attr_name.textContent = "台北一日遊："+book_attr_data["attraction"].name;
            attr_date.textContent = book_attr_data["date"];
            attr_price.textContent = "新台幣"+book_attr_data["price"]+"元";
            total_price.textContent = "新台幣"+book_attr_data["price"]+"元";
            attr_address.textContent = book_attr_data["attraction"].address;
            attr_img.setAttribute("src", book_attr_data["attraction"].image);
        }
        else{
            ybook.style.display="none";
            nbook.style.display="block";
            footer.classList.add('full_height') 
        }
    })
}

function delete_booking(){
    let req = new XMLHttpRequest();
    req.open("DELETE", "/api/booking");
    req.setRequestHeader("Content-Type", "application/json");
    req.send();
    window.location.reload();
}