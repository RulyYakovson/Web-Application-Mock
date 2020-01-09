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
        removeMsg();
    });
    $('#add-customer-confirm').on('input', () => {
        validatePassword();
    });
    $('#add-customer-password').on('input', () => {
        validatePassword();
    });
    $('#after-reset-password').on('input', () => {
        validatePasswordForSet();
    });
    $('#after-reset-confirm').on('input', () => {
        validatePasswordForSet();
    });
    $('#change-pass-new').on('input', () => {
        validatePasswordForChange();
    });
    $('#change-pass-confirm').on('input', () => {
        validatePasswordForChange();
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

$("form#reset-pass-submit").submit(async e => {
    $(".cover").show();
    e.preventDefault();
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
        jQuery.noConflict();
        $('#reset-pass-modal').modal('hide');
        jQuery.noConflict();
        $('#after-reset-modal').modal('show');
    } else if (response.status === 400) {
        $('#reset-pass-msg').text('Email address is not registered');
    } else {
        $('#reset-pass-msg').text('An error occurred while trying to reset the password');
    }
    $(".cover").hide();
});

$("form#after-reset-submit").submit(async e => {
    $(".cover").show();
    e.preventDefault();
    const token = $('#after-reset-token').val();
    const username = $('#after-reset-username').val();
    const password = $('#after-reset-password').val();
    const encryptedPass = encrypt(password);
    const response = await fetch('customer/new_pass',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                username: username,
                password: encryptedPass,
            })
        });
    if (response.ok) {
        $('#after-reset-msg').css("color", "#bd3200");
        $('#after-reset-msg').text('Password has been changed, you can now log in by using the new password.');
    } else {
        tryEmpPathReset(token, username, encryptedPass);
    }
    $(".cover").hide();
});

$("form#change-pass-submit").submit(async e => {
    $(".cover").show();
    e.preventDefault();
    const oldPassword = $('#change-pass-old').val();
    const newPassword = $('#change-pass-new').val();
    const encryptedOldPass = encrypt(oldPassword);
    const encryptedNewPass = encrypt(newPassword);
    const response = await fetch('customer/change_pass',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                oldPassword: encryptedOldPass,
                newPassword: encryptedNewPass,
            })
        });
    if (response.ok) {
        jQuery.noConflict();
        $('#change-pass-modal').modal('hide');
    } else if (response.status === 401) {
        $('#change-pass-err-msg').text('Wrong password.');
    } else if (response.status === 404) {
        tryEmpPathChange(encryptedOldPass, encryptedNewPass);
    } else {
        $('#change-pass-err-msg').text('An error occurred while trying to update the password.');
    }
    $(".cover").hide();
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
        $('#login-err-msg').text('Username or password incorrect. Please try again.');
    } else {
        $('#login-err-msg').text('An error occurred during the login request.');
    }
    $(".cover").hide();
});

const tryEmpPathReset = async (token, username, encryptedPass) => {
    const response = await fetch('employee/new_pass',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                token: token,
                username: username,
                password: encryptedPass,
            })
        });
    if (response.ok) {
        $('#after-reset-msg').css("color", "#bd3200");
        $('#after-reset-msg').text('Password has been changed, you can now log in by using the new password.');
    } else if (response.status === 400) {
        $('#after-reset-msg').css("color", "red");
        $('#after-reset-msg').text(`User ${username} doesn't exist.`);
    } else if (response.status === 401) {
        $('#after-reset-msg').css("color", "red");
        $('#after-reset-msg').text('Token has incorrect or expired.');
    } else {
        $('#after-reset-msg').css("color", "red");
        $('#after-reset-msg').text('An error occurred while trying to update the password.');
    }
};

const tryEmpPathChange = async (encryptedOldPass, encryptedNewPass) => {
    const response = await fetch('employee/change_pass',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                oldPassword: encryptedOldPass,
                newPassword: encryptedNewPass,
            })
        });
    if (response.ok) {
        jQuery.noConflict();
        $('#change-pass-modal').modal('hide');
    } else if (response.status === 401) {
        $('#change-pass-err-msg').text('Wrong password.');
    } else {
        $('#change-pass-err-msg').text('An error occurred while trying to update the password.');
    }
};

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

const validatePasswordForSet = () => {
    const password = $('#after-reset-password').val();
    const confirm = $('#after-reset-confirm').val();
    if (password !== confirm) {
        $('#after-reset-password-err-msg').attr("hidden", false);
        $('#after-reset-password-err-msg').text(`* Password doesn't match.`);
        $('#after-reset-button').prop('disabled', true);
    } else {
        $('#after-reset-password-err-msg').attr("hidden", true);
        $('#after-reset-password-err-msg').text('');
        $('#after-reset-button').prop('disabled', false);
    }
};

const validatePasswordForChange = () => {
    const password = $('#change-pass-new').val();
    const confirm = $('#change-pass-confirm').val();
    if (password !== confirm) {
        $('#change-pass-confirm-msg').attr("hidden", false);
        $('#change-pass-confirm-msg').text(`* Password doesn't match.`);
        $('#change-pass-button').prop('disabled', true);
    } else {
        $('#change-pass-confirm-msg').attr("hidden", true);
        $('#change-pass-confirm-msg').text('');
        $('#change-pass-button').prop('disabled', false);
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

