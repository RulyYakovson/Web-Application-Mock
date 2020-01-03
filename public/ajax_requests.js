$(document).ready(() => {
    console.log("URL: " + location);
    const relativeUrl = window.location.hash.slice(1);
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

$(document).ready(() => {
    $(".form-control").focus(() => {
        removeMsg()
    });
    $('#add-customer-confirm').on('input', () => {
        validatePassword()
    });
    $('#add-customer-password').on('input', () => {
        validatePassword()
    });
});

$('#init-db').click(() => {
    $(".cover").show();
    $.ajax({
        url: '/init_db',
        type: 'PUT',
        contentType: 'text/html',
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

$("form#rest-pass-submit").submit(async e => {
    $(".cover").show();
    e.preventDefault();
    $(".cover").hide();
    const email = $('#rest-pass-email').val();
    const response = await fetch('reset_pass',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email
            })
        });
    if (response.ok) {
        $('#reset-pass-msg').text('A new password was sent to your email');
    } else if (response.status === 400) {
        $('#reset-pass-msg').text('Email address is not registered');
    } else {
        $('#reset-pass-msg').text('An error occurred while trying to reset the password');
    }
});

$("form#login-form-data").submit(async e => {
    $(".cover").show();
    e.preventDefault();
    const username = $('#login-username').val();
    const password = $('#login-password').val();
    const encryptedPass = encrypt(password);
    const response = await fetch('login',
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
    if (response.ok) {
        jQuery.noConflict();
        $('#login-modal').modal('hide');
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

const validatePassword = () => {
    const password = $('#add-customer-password').val();
    const confirm = $('#add-customer-confirm').val();
    if (password !== confirm) {
        $('#password-err-msg').attr("hidden", false);
        $('#password-err-msg').text(`* Password doesn't match.`);
        $('#add-customer-button').prop('disabled', true);
    } else {
        $('#password-err-msg').attr("hidden", true);
        $('#password-err-msg').text('');
        $('#add-customer-button').prop('disabled', false);
    }
};

const generateErrorHtml = data => {
    const html = `<div class="home-page" style="height: 420px;">
                    <div class="home-page">
                        <h1 style="color: #138496">Can't reach the page !!! </h1>
                        <h1 style="color: #138496">${"Status code:   " + data.status} </h1>
                    </div>
                </div>`;
    return html;
};

