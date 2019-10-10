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
        case 'customers':
            $('#customers').trigger('click');
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
    $.ajax({url:'/all/employees' + window.location.search, type:'GET', contentType:'text/html', success: function(data, status) {
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
        location.reload();
    } else {
        $('#add-emp-err-msg').text('An error occurred while trying to add the user');
    }
});

const update_emp = async (id) => {
    let role = $('#update-emp-role' + id).val();
    let branch = $('#update-emp-branch' + id).val();
    console.log(`ajax_requests:update-emp::  ID: ${id}, Role: ${role}, Branch: ${branch}`);
    let response = await fetch("/update/emp",
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            role: role,
            branch: branch
        })
    });
    if (response.status === 200){
        console.log(`ajax_requests:update-emp:: Updating user: ${id} finished successfully`);
        jQuery.noConflict();
        $('#' + id).modal('hide');
        location.reload();
    } else {
        $('#update-emp-err-msg' + id).text('An error occurred while trying to updating the user');
    }
};

$('#customers').click(function() {
    $.ajax({url:'/all/customers' + window.location.search, type:'GET', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            $('#main-body').html(data);
        }
    }});
});

$('#add-customer-button').click(async function() {
    let username = $('#add-customer-username').val();
    let password = $('#add-customer-password').val();
    let id = $('#add-customer-id').val();
    let phone = $('#add-customer-phone').val();
    let address = $('#add-customer-address').val();
    console.log(`ajax_requests:add-customer:: Username: ${username}, Passward: ${password}, ID: ${id}, Phone: ${phone}`);
    let response = await fetch("/add/customer",
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username : username,
            password : password,
            id: id,
            role: 'customer',
            phone: phone,
            address: address
        })
    });
    if (response.status === 200){
        console.log(`ajax_requests:add-customer:: Adding user: ${username} finished successfully`);
        jQuery.noConflict();
        $('#add-customer-modal').modal('hide');
        location.reload();
    } else {
        $('#add-customer-err-msg').text('An error occurred while trying to add the user');
    }
});

const update_customer = async (id) => {
    let phone = $('#update-customer-phone' + id).val();
    let address = $('#update-customer-address' + id).val();
    console.log(`ajax_requests:update-emp::  ID: ${id}, Phone: ${phone}, Address: ${address}`);
    let response = await fetch("/update/customer",
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            phone: phone,
            address: address
        })
    });
    if (response.status === 200){
        console.log(`ajax_requests:add-customer:: Adding user: ${id} finished successfully`);
        jQuery.noConflict();
        $('#' + id).modal('hide');
        location.reload();
    } else {
        $('#update-customer-err-msg').text('An error occurred while trying to updating the user');
    }
};

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
    $.ajax({url:`/remove/employee/${id}` + window.location.search, type:'DELETE', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            $('#main-body').html(data);
        }
    }});
}

const removeCustomer = (id) => {
    console.log(`ajax_requests:remove-customer:: ID: ${id}`);
    $.ajax({url:`/remove/customer/${id}` + window.location.search, type:'DELETE', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            $('#main-body').html(data);
        }
    }});
}

const removeMsg = () => {
    $('#add-emp-err-msg').text('');
    $('#add-customer-err-msg').text('');
}