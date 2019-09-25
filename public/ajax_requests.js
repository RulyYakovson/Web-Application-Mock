$(document).ready(function() {
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
    $.ajax({url:'/home', type:'GET', contentType:'text/html', success: function(data, status) {
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