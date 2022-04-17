const errorSubmitMsg = document.getElementById('handleErrorSubmit')

const tapPaySetUp = () => {
    TPDirect.setupSDK(124206, 'app_mkFtXkwkK4nrGeYr3nswwp7p97pKU7ZMGSVqtdujbXYAqM5Wdu7HYJws2h3x', 'sandbox')
    let fields = {
        number: {
            element: document.getElementById('card-number'),
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: document.getElementById('card-ccv'),
            placeholder: '後三碼'
        }
    }

    TPDirect.card.setup({
        fields: fields,
        styles: {
            'input': {
                'color': 'gray'
            },
            'input.ccv': {
                // 'font-size': '16px'
            },
            ':focus': {
                'color': 'black'
            },
            '.valid': {
                'color': 'green'
            },
            '.invalid': {
                'color': 'red'
            },
            '@media screen and (max-width: 400px)': {
                'input': {
                    'color': 'orange'
                }
            }
        }
    })

}
tapPaySetUp();


TPDirect.card.onUpdate(function (update) {
    
    if (update.canGetPrime) {
        document.getElementsByClassName('button[type="submit"]').removeAttr('disabled')
    } else {
        document.getElementsByClassName('button[type="submit"]').attr('disabled', true)
    }

    var newType = update.cardType === 'unknown' ? '' : update.cardType
    document.getElementsByClassName('#cardtype').text(newType)

    if (update.status.number === 2) {
        setNumberFormGroupToError('.card-number-group')
    } else if (update.status.number === 0) {
        setNumberFormGroupToSuccess('.card-number-group')
    } else {
        setNumberFormGroupToNormal('.card-number-group')
    }

    if (update.status.expiry === 2) {
        setNumberFormGroupToError('.expiration-date-group')
    } else if (update.status.expiry === 0) {
        setNumberFormGroupToSuccess('.expiration-date-group')
    } else {
        setNumberFormGroupToNormal('.expiration-date-group')
    }

    if (update.status.ccv === 2) {
        setNumberFormGroupToError('.ccv-group')
    } else if (update.status.ccv === 0) {
        setNumberFormGroupToSuccess('.ccv-group')
    } else {
        setNumberFormGroupToNormal('.ccv-group')
    }
})


document.getElementById('order-form').addEventListener('submit', function (event) {
    event.preventDefault()
    
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    if (tappayStatus.canGetPrime === false) {
        errorSubmitMsg.innerHTML = '請填寫正確付款資訊'
        return
    } else { errorSubmitMsg.innerHTML = ''}

    TPDirect.card.getPrime(function (result) {
        if (result.status !== 0) {
            return 
        }                
        fetch("/api/booking").then(function(response){
            return response.json();
        }).then(function(ord_result){
            let apiOrder = ord_result["data"]
            let contact_name = document.getElementById("contact_name").value;
            let contact_email = document.getElementById("contact_email").value;
            let contact_phone = document.getElementById("contact_phone").value;

            let order = {
                price : apiOrder["price"],
                trip : {
                    attraction : {
                        id : apiOrder["attraction"].id,
                        name : apiOrder["attraction"].name,
                        address : apiOrder["attraction"].address,
                        image : apiOrder["attraction"].image
                    },
                    date : apiOrder["date"],
                    time : apiOrder["time"]
                },
                contact : {
                    name : contact_name,
                    email : contact_email,
                    phone : contact_phone
                }
            }
            let toSend = {
                prime : result.card.prime,
                order : order
            }

            fetch("/api/orders",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json;"
                },
                body: JSON.stringify(toSend)
            }).then(function (booking_response) {
                if(booking_response.status === 200){                            
                    booking_response.json().then(function(text){
                    window.location.replace("/thankyou?number="+text["data"].number);
                    })
                }
                else if(booking_response.status === 400){
                    alert("訂單建立失敗，將自動整理頁面")
                    window.location.reload();
                }
                else if(booking_response.status === 403){
                    window.location.reload("/");
                }
            }).catch(err=>console.log(err))
        })
        
        
        
    })
})

function setNumberFormGroupToError(selector) {
    document.getElementsByClassName(selector).addClass('has-error')
    document.getElementsByClassName(selector).removeClass('has-success')
}

function setNumberFormGroupToSuccess(selector) {
    document.getElementsByClassName(selector).removeClass('has-error')
    document.getElementsByClassName(selector).addClass('has-success')
}

function setNumberFormGroupToNormal(selector) {
    document.getElementsByClassName(selector).removeClass('has-error')
    document.getElementsByClassName(selector).removeClass('has-success')
}