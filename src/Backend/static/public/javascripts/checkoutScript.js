TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox')
TPDirect.card.setup({
    fields: {
        number: {
            element: '.form-control.card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            element: document.getElementById('tappay-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: $('.form-control.cvc')[0],
            placeholder: '後三碼'
        }
    },
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
// listen for TapPay Field
TPDirect.card.onUpdate(function (update) {
    /* Disable / enable submit button depend on update.canGetPrime  */
    /* ============================================================ */

    // update.canGetPrime === true
    //     --> you can call TPDirect.card.getPrime()
    // const submitButton = document.querySelector('button[type="submit"]')
    if (update.canGetPrime) {
        // submitButton.removeAttribute('disabled')
        $('button[type="submit"]').removeAttr('disabled')
    } else {
        // submitButton.setAttribute('disabled', true)
        $('button[type="submit"]').attr('disabled', true)
    }
    /* Change card type display when card type change */
    /* ============================================== */
    // cardTypes = ['visa', 'mastercard', ...]
    var newType = update.cardType === 'unknown' ? '' : update.cardType
    $('#cardtype').text(newType)
    /* Change form-group style when tappay field status change */
    /* ======================================================= */

    // number 欄位是錯誤的
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

    if (update.status.cvc === 2) {
        setNumberFormGroupToError('.cvc-group')
    } else if (update.status.cvc === 0) {
        setNumberFormGroupToSuccess('.cvc-group')
    } else {
        setNumberFormGroupToNormal('.cvc-group')
    }
})
const token = localStorage.getItem('token');
const header = { authorization: 'Bearer ' + token };
const getData = async()=>{
    axios.get('/api/1.0/users/', { headers: header })
    .then((response) => {
        if (response.status == 200) {
            profileData = response.data.user;
        }
    })
    .catch((err) => {
        alert("尚未登入,即將轉跳至登入畫面")
        window.location.href = 'http://54.95.174.96/signin'
        console.log(err.response.data);
    });
}
let profileData = {};
$('form').on('submit', async function (event) {
    event.preventDefault()
    // fix keyboard issue in iOS device
    forceBlurIos()
    
    await getData();
    console.log(profileData)
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()
    console.log(tappayStatus)

    // Check TPDirect.card.getTappayFieldsStatus().canGetPrime before TPDirect.card.getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('can not get prime')
        return
    }
    // Get prime
    TPDirect.card.getPrime(async function (result) {
        if (result.status !== 0) {
            alert('get prime error ' + result.msg)
            return
        }
        const token = localStorage.getItem('token');
        const prime =  result.card.prime;
        const data= new FormData();
        //alert('get prime : ' + result.card.prime)
        data.append('productID','99');
        data.append('price','999');
        data.append('userID',profileData.id);
        data.append('prime',prime);

        axios.defaults.headers.common['Content-Type'] = 'multipart/form-data';
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
        axios.defaults.headers.post['Authorization'] = token;
        axios.post('/1.0/orders', data)
        .then(function (response) {
            if (response.status == 200 ){
                alert(`Success check out your order!`)
                location.reload();
            }
            else
                console.log(response)
        })
        .catch(function (error) {
             alert(error.response.data.description);
        });
    })
})

function setNumberFormGroupToError(selector) {
    $(selector).addClass('has-error')
    $(selector).removeClass('has-success')
}

function setNumberFormGroupToSuccess(selector) {
    $(selector).removeClass('has-error')
    $(selector).addClass('has-success')
}

function setNumberFormGroupToNormal(selector) {
    $(selector).removeClass('has-error')
    $(selector).removeClass('has-success')
}

function forceBlurIos() {
    if (!isIos()) {
        return
    }
    var input = document.createElement('input')
    input.setAttribute('type', 'text')
    // Insert to active element to ensure scroll lands somewhere relevant
    document.activeElement.prepend(input)
    input.focus()
    input.parentNode.removeChild(input)
}

function isIos() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}