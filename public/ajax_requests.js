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
        case '':
            $('#home').trigger('click');
    }
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

$('#login-button').click(async function() {
    let username = $('#login-username').val();
    let password = $('#login-password').val();
    console.log(`ajax_requests:login:: Username: ${username}, Passward: ${password}`);
    let response = await fetch(`/login/${username}/${password}`, { method: 'post' });
    if (response.status === 200){
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
