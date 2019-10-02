$(document).ready(function() {
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
        case '':
            $('#home').trigger('click');
    }
});

$(document).ready(function(){
    $(".form-control").focus(function() {
        removeMsg()
    });
});

$(document).ready(function(){
    $('#exampleModal').on('hide.bs.modal', function () {
        $(".form-control").val('');
        removeMsg()
    })
});

$('#home').click(function() {
    $.ajax({url:'/home' + window.location.search, type:'GET', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            $('#main-body').html(data);
            $('#about').removeClass('active');
            $('#contact').removeClass('active');
            $('#home').addClass('active');
        }
    }});
});

$('#about').click(function() {
    $.ajax({url:'/about', type:'GET', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            $('#main-body').html(data);
            $('#about').addClass('active');
            $('#contact').removeClass('active');
            $('#home').removeClass('active');
        }
    }});
});

$('#contact').click(function() {
    $.ajax({url:'/contact', type:'GET', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            $('#main-body').html(data);
            $('#contact').addClass('active');
            $('#about').removeClass('active');
            $('#home').removeClass('active');
        }
    }});
});

$('#employees').click(function() {
    $.ajax({url:'/all/employees', type:'GET', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            $('#main-body').html(data);
        }
    }});
});

$('#add-emp-button').click(async function() {
    let username = $('#add-emp-username').val();
    let password = $('#add-emp-password').val();
    let id = $('#add-emp-id').val();
    let role = $('#add-emp-role').val();
    let branch = $('#add-emp-branch').val();
    console.log(`ajax_requests:add-emp:: Username: ${username}, Passward: ${password}, ID: ${id}, Role: ${role}, Branch: ${branch}`);
    let response = await fetch("/add/emp",
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username : username,
            password : password,
            id: id,
            role: role,
            branch: branch
        })
    });
    if (response.status === 200){
        console.log(`ajax_requests:add-emp:: Adding user: ${username} finished successfully`);
        jQuery.noConflict();
        $('#add-emp-modal').modal('hide');
        if (window.location.hash.slice(1) === 'employees') {
            $('#employees').trigger('click');
        }
    } else {
        $('#add-emp-err-msg').text('An error occurred while trying to add the user');
    }
});

$('#login-button').click(async function() {
    let username = $('#login-username').val();
    let password = $('#login-password').val();
    console.log(`ajax_requests:login:: Username: ${username}, Passward: ${password}`);
    let response = await fetch(`/login/${username}/${password}`, { method: 'post' });
    if (response.status === 200) {
        console.log(`ajax_requests:login:: Authentication for user: ${username} succeeded`);
        location = `?username=${username}&password=${password}`;
        $('#login-modal').modal('hide');
    } else if (response.status === 401) {
        $('#login-err-msg').text('Username or password incorrect. Please try again')
    }
});

$('#logout').click(function() {
    let url = location.href.toString();
    if (url.indexOf("?") > 0) {
        let clean_url = url.substring(0, url.indexOf("?"));
        history.replaceState({}, document.title, clean_url);
        location = clean_url;
    }
});

const removeEmployee = (id) => {
    console.log(`ajax_requests:remove-employee:: ID: ${id}`);
    $.ajax({url:`/remove/employee/${id}`, type:'DELETE', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            $('#main-body').html(data);
        }
    }});
}

const removeMsg = () => {
    $('#add-emp-err-msg').text('')
}