const loginBtn = document.getElementById("login-btn")    
const signOutBtn = document.getElementById("js-navbar__sign-out-btn");
const bookingBtn = document.getElementById("schedule");
const bookingIcon = document.getElementById("js-navbar__icon");
const bookingNumber = document.getElementById("js-navbar__number");
const popup = document.getElementById("js-popup");
const gate = document.getElementById("js-gate");
const gateTitle = document.getElementById("js-gate__title");
const gateCloseBtn = document.getElementById("js-gate__close");
const signIn = document.getElementById("js-sign-in");
const signUp = document.getElementById("js-sign-up");
const signInBtn = document.getElementById("js-sign-in__btn");
const signUpBtn = document.getElementById("js-sign-up__btn");
const signInSwitchBtn = document.getElementById("js-sign-in__switch-btn");
const signUpSwitchBtn = document.getElementById("js-sign-up__switch-btn");
const gateInputs = document.querySelectorAll(".gate__input");
const signInEmail = document.getElementById("js-sign-in__email");
const signInPwd = document.getElementById("js-sign-in__pwd");
const signInMsg = document.getElementById("js-sign-in__message");
const signUpName = document.getElementById("js-sign-up__name");
const signUpEmail = document.getElementById("js-sign-up__email");
const signUpPwd = document.getElementById("js-sign-up__pwd");
const signUpMsg = document.getElementById("js-sign-up__message");
const emailPattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

let isLogin = false

const resetGateInput = () => {
    gateInputs.forEach((input) => {
        removeOk(input);
        removeOkIcon(input);
        removeError(input);
        removeErrorIcon(input);
        input.value = null;
    })

    removeError(signUpMsg);
    removeOk(signUpMsg);
    removeMsg(signUpMsg);
    removeError(signInMsg);
    removeMsg(signInMsg);
}

const handleSignUpValidation = () => {
    const name = signUpName.value.trim();
    const email = signUpEmail.value.trim();
    const pwd = signUpPwd.value.trim();

    if (name) {
        setOkInput(signUpName);
    }

    else {
        setErrorInput(signUpName);
    }

    if (emailPattern.test(email)) {
        setOkInput(signUpEmail);
    }

    else {
        setErrorInput(signUpEmail);
    }

    if (pwd) {
        setOkInput(signUpPwd);
    }

    else {
        setErrorInput(signUpPwd);
    }

    if (name && emailPattern.test(email) && pwd) {
        removeError(signUpMsg)
        removeMsg(signUpMsg);
        return true;
    }
    
    else {
        setError(signUpMsg);
        setMsg(signUpMsg, "仍有欄位未輸入或資料格式錯誤")
        return false;
    }
}

const handleSignInValidation = () => {
    const email = signInEmail.value.trim();
    const pwd = signInPwd.value.trim();

    if (emailPattern.test(email)) {
        removeError(signInEmail);
        removeErrorIcon(signInEmail);
    }

    else {
        setError(signInEmail);
        setErrorIcon(signInEmail);
    }

    if (pwd) {
        removeError(signInPwd);
        removeErrorIcon(signInPwd);
    }

    else {
        setError(signInPwd);
        setErrorIcon(signInPwd);
    }

    if (emailPattern.test(email) && pwd) {
        removeError(signInMsg);
        removeMsg(signInMsg);
        return true;
    }

    else {
        setError(signInMsg);
        setMsg(signInMsg, "帳號及密碼未輸入，或帳號格式錯誤")
        return false;
    }
}

// handle input
const setOk = (e) => {
    e.classList.add("ok");
}

const setOkIcon = (e) => {
    e.parentNode.querySelector("i").classList.add("bx-check-circle")
}

const setError = (e) => {
    e.classList.add("error");
}

const setErrorIcon = (e) => {
    e.parentNode.querySelector("i").classList.add("bx-x-circle");
}

const removeOk = (e) => {
    e.classList.remove("ok");
}

const removeOkIcon = (e) => {
    e.parentNode.querySelector("i").classList.remove("bx-check-circle");
}

const removeError = (e) => {
    e.classList.remove("error");
}

const removeErrorIcon = (e) => {
    e.parentNode.querySelector("i").classList.remove("bx-x-circle");
}

const setOkInput = (e) => {
    setOk(e);
    setOkIcon(e)
    removeError(e);
    removeErrorIcon(e);
}

const setErrorInput = (e) => {
    setError(e);
    setErrorIcon(e);
    removeOk(e);
    removeOkIcon(e);
}

const setMsg = (e, txt) => {
    e.textContent = txt;
}

const removeMsg = (e) => {
    e.textContent = "";
}

const showBlock = (e) => {
    e.classList.remove("hidden");
}

const hideBlock = (e) => {
    e.classList.add("hidden");
}



// const showSchedules = async () => {
//     const option = {
//         method: "GET",
//         headers: {
//             "Content-Type": "application/json"
//         },
//     };
//     const response = await fetch("/api/booking", option);
//     const promise = await response.json();
//     const result = await promise;

//     if (result.data.length) {
//         bookingNumber.textContent = result.data.length;
//         bookingIcon.style.transform = "scale(1)";
//     }

//     else {
//         bookingIcon.style.transform = "scale(0)";
//     }
// }

// //
// showSchedules();


// handle login
loginBtn.addEventListener("click", () => {
    popup.style.pointerEvents = "all";
    popup.style.display = "flex";
    popup.style.transition = "1s";
    gate.style.transform = "translateY(80px)";
    gate.style.transition = "0.3s";
    gateTitle.textContent = "登入會員帳號";
    showBlock(signIn);
    hideBlock(signUp);
    resetGateInput();
});

gateCloseBtn.addEventListener("click", () => {
    popup.style.pointerEvents = "none";
    popup.style.display = "none";
    popup.style.transition = "none";
    gate.style.transform = "translateY(-400px)";
    gate.style.transition = "none";
});

signInSwitchBtn.addEventListener("click", () => {
    gateTitle.textContent = "註冊會員帳號";
    showBlock(signUp);
    hideBlock(signIn);
    resetGateInput();
});

signUpSwitchBtn.addEventListener("click", () => {
    gateTitle.textContent = "登入會員帳號";
    showBlock(signIn);
    hideBlock(signUp);
    resetGateInput();
});

signUpBtn.addEventListener("click", async () => {
    const name = signUpName.value.trim();
    const email = signUpEmail.value.trim();
    const pwd = signUpPwd.value.trim();
    const data = {
        "name": name,
        "email": email,
        "password": pwd
    };
    const option = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    if (handleSignUpValidation()) {
        const response = await fetch("/api/user", option);
        const promise = await response.json();
        const result = await promise;

        if (result.ok) {
            resetGateInput();
            setOk(signUpMsg);
            removeError(signUpMsg);
            setMsg(signUpMsg, "註冊成功！");
        }

        else if (result.error) {
            if (result.message == "The email has already been registered.") {
                setErrorInput(signUpEmail);
                setError(signUpMsg);
                removeOk(signUpMsg);
                setMsg(signUpMsg, "此電子信箱已被其他使用者註冊");
            }

            else {
                setError(signUpMsg);
                removeOk(signUpMsg);
                setMsg(signUpMsg, "註冊失敗，請重新嘗試");
            }
        }
    }
});

signInBtn.addEventListener("click", async () => {
    const email = signInEmail.value.trim();
    const pwd = signInPwd.value.trim();
    const data = {
        "email": email,
        "password": pwd
    }
    const option = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    };

    if (handleSignInValidation()) {
        const response = await fetch("/api/user", option);
        const promise = await response.json();
        const result = await promise;

        if (result.ok) {
            popup.style.pointerEvents = "none";
            popup.style.display = "none";
            popup.style.transition = "1s";
            gate.style.transform = "translateY(-400px)";
            gate.style.transition = "0.3s";
            hideBlock(loginBtn);
            showBlock(signOutBtn);
            isLogin = true

            const bookingOption = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            };
            // const bookingResponse = await fetch("/api/booking", bookingOption);
            // const bookingPromise = await bookingResponse.json();
            // const bookingResult = await bookingPromise;
        
            // if (bookingResult.data.length) {
            //     bookingNumber.textContent = bookingResult.data.length;
            //     bookingIcon.style.transform = "scale(1)";
            // }
        
            // else {
            //     bookingIcon.style.transform = "scale(0)";
            // }
        }

        else if (result.error) {
            setErrorInput(signInEmail);
            setErrorInput(signInPwd);
            setError(signInMsg);
            setMsg(signInMsg, "帳號或密碼錯誤");
        }
    }
});

signOutBtn.addEventListener("click", async () => {
    const option = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    };

    const response = await fetch("/api/user", option);
    const promise = await response.json();
    const result = await promise;

    if (result.ok) {
        window.location.reload();
        showBlock(loginBtn);
        hideBlock(signOutBtn);
        isLogin = false
    }
});

gateInputs.forEach((input) => {
    input.addEventListener("focus", () => {
        removeOk(input);
        removeOkIcon(input);
        removeError(input);
        removeErrorIcon(input);
    });
});

signUpName.addEventListener("blur", () => {
    if (signUpName.value.trim()) {
        setOkInput(signUpName);
    }

    else {
        setErrorInput(signUpName);
    }
});

signUpEmail.addEventListener("blur", () => {
    if (emailPattern.test(signUpEmail.value.trim())) {
        setOkInput(signUpEmail);
    }

    else {
        setErrorInput(signUpEmail);
    }
});

signUpPwd.addEventListener("blur", () => {
    if (signUpPwd.value.trim()) {
        setOkInput(signUpPwd);
    }

    else {
        setErrorInput(signUpPwd);
    }
});

signInEmail.addEventListener("blur", () => {
    if (emailPattern.test(signInEmail.value.trim())) {
        removeError(signInEmail);
        removeErrorIcon(signInEmail);
    }

    else {
        setError(signInEmail);
        setErrorIcon(signInEmail);
    }
});

signInPwd.addEventListener("blur", () => {
    if (signInPwd.value.trim()) {
        removeError(signInPwd);
        removeErrorIcon(signInPwd);
    }

    else {
        setError(signInPwd);
        setErrorIcon(signInPwd);
    }
});

bookingBtn.addEventListener("click", async () => {
    const option = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    };
    const signInResponse = await fetch("/api/user", option);
    const signInPromise = await signInResponse.json();
    const signInResult = await signInPromise;

    if (signInResult.data) {
        window.location.href = "/booking";
    } else {
        popup.style.pointerEvents = "all";
        popup.style.display = "flex";
        popup.style.transition = "1s";
        gate.style.transform = "translateY(80px)";
        gate.style.transition = "0.3s";
        gateTitle.textContent = "登入會員帳號";
        showBlock(signIn);
        hideBlock(signUp);
        resetGateInput();
    }
});
  
const checkLoginStatus = async () => {
    const option = {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    };
    const signInResponse = await fetch("/api/user", option);
    const signInPromise = await signInResponse.json();
    const signInResult = await signInPromise;
    
    if (signInResult.data) {
        hideBlock(loginBtn);
        showBlock(signOutBtn);
    }
  
    else{
        showBlock(loginBtn);
        hideBlock(signOutBtn);
    }
  }
  
  checkLoginStatus()