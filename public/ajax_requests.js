$(document).ready( () => {
    console.log("URL: " + location);
    let relativeUrl = window.location.hash.slice(1);
    switch (relativeUrl) {
        case 'about':
            $('#about').trigger('click');
            break;
        case 'contact':
            $('#contact').trigger('click');
            break;
        case 'employees':
            $('#employees').trigger('click');
            break;
        case 'customers':
            $('#customers').trigger('click');
            break;
        case 'flowers':
            $('#flowers').trigger('click');
            break;
        case 'branches':
            $('#branches').trigger('click');
            break;
        case '':
            $('#home').trigger('click');
    }
});

$(document).ready( () => {
    $(".form-control").focus( () => {
        removeMsg()
    });
});

$('#init-db').click( () => {
    $(".cover").show();
    $.ajax({
        url:'/init_db',
        type:'PUT',
        contentType:'text/html',
        success: (data, status) => {
            console.log('Status: ' + status);
            if (status == 'success') {
                console.log('result is 200');
                removeActive();
                $('#init-db').addClass('active');
                $(".cover").hide();
            }
        },
        error: (data, status) => {
            console.log('Status: ' + status);
            removeActive();
            $('#init-db').addClass('active');
            $(".cover").hide();
        }
    });
});

$("form#login-form-data").submit(async e => {
    $(".cover").show();
    e.preventDefault();    
    let username = $('#login-username').val();
    let password = $('#login-password').val();
    encryptedPass = encrypt(password);
    console.log(`ajax_requests:login:: Username: ${username}, Encrypted passward: ${encryptedPass}`);
    let response = await fetch('login',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: encryptedPass,
        })
    });
    if (response.status === 200) {
        console.log(`ajax_requests:login:: Authentication for user: ${username} succeeded`);
       // $('#login-modal').modal('hide');  //TODO !!!!!
        location.reload();
    } else if (response.status === 401) {
        $('#login-err-msg').text('Username or password incorrect. Please try again');
    } else {
        $('#login-err-msg').text('An error occurred during the login request');
    }
    $(".cover").hide();
});

const removeMsg = () => {
    $('#add-emp-err-msg').text('');
    $('#add-customer-err-msg').text('');
};

const removeActive = () => {
    $('.nav-item').removeClass('active');
};

const generateErrorHtml = data => {
    let html = `<div class="home-page" style="height: 420px;">
                    <div class="home-page">
                        <h1 style="color: #138496">Can't reach the page !!! </h1>
                        <h1 style="color: #138496">${"Status code:   " + data.status} </h1>
                    </div>
                </div>`;
    return html;
};

