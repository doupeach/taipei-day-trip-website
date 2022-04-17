function ordered_onload(){
    let src_user = "/api/user"
    fetch(src_user)
    .then(res =>  res.json())
    .then(res => {
        if(res["data"] == null ){
            console.log(res)
            window.location.replace("/");
        }
        renderOrder();
    })
    
}

function renderOrder(){
    const order_id = document.getElementById("order-id")
    const order_message = document.getElementById("order-msg")
    
    const getUrlString = location.href;
    const url = new URL(getUrlString);
    const order_number = url.searchParams.get('number')
    let src = "/api/order/" + order_number

    fetch(src)
    .then(res => res.json())
    .then((result) => {

        if(result["data"] == null){
            order_id.textContent = "查無此訂單編號"
        }
        else{
            let order_status = result["data"]["status"]

            if( order_status == 0){
                order_message.textContent = "付款成功 Have a nice trip!"
            }
            else{
                order_message.textContent = "付款失敗 Please try again!"
            }
        }
    })
    .catch(err=>console.log(err))
    order_id.textContent = order_number ;
}


ordered_onload()