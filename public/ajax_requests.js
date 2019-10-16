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

$(document).ready(function(){
    $(".form-control").focus(function() {
        removeMsg()
    });
});

$('#home').click(function() {
    $(".cover").show();
    $.ajax({url:'/home' + window.location.search, type:'GET', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            $('#main-body').html(data);
            removeActive();
            $('#home').addClass('active');
            $(".cover").hide();
        }
    }});
});

$('#about').click(function() {
    $(".cover").show();
    $.ajax({url:'/about', type:'GET', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            $('#main-body').html(data);
            removeActive();
            $('#about').addClass('active');
            $(".cover").hide();
        }
    }});
});

$('#flowers').click(function() {
    $(".cover").show();
    $.ajax({url:'/flowers' + window.location.search, type:'GET', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            $('#main-body').html(data);
            removeActive();
            $('#flowers').addClass('active');
            $(".cover").hide();
        }
    }});
});

$('#branches').click(function() {
    $(".cover").show();
    $.ajax({url:'/branches' + window.location.search, type:'GET', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            $('#main-body').html(data);
            removeActive();
            $('#branches').addClass('active');
            $(".cover").hide();
        }
    }});
});

$('#contact').click(function() {
    $(".cover").show();
    $.ajax({url:'/contact', type:'GET', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            $('#main-body').html(data);
            removeActive();
            $('#contact').addClass('active');
            $(".cover").hide();
        }
    }});
});

$('#employees').click(function() {
    $(".cover").show();
    $.ajax({url:'/all/employees' + window.location.search, type:'GET', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            removeActive();
            $('#main-body').html(data);
            $('#employees-menu').addClass('active');
            $(".cover").hide();
        }
    }});
});

$('#add-emp-button').click(async function() {
    $(".cover").show();
    let username = $('#add-emp-username').val();
    let password = $('#add-emp-password').val();
    let id = $('#add-emp-id').val();
    let role = $('#add-emp-role').val();
    let branch = $('#add-emp-branch').val();
    let gender = $('#add-emp-gender').val();
    console.log(`ajax_requests:add-emp:: Username: ${username}, Passward: ${password}, ID: ${id}, Role: ${role}, Branch: ${branch}, Gender: ${gender}`);
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
            branch: branch,
            gender: gender
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
    $(".cover").hide();
});

const update_emp = async (id) => {
    $(".cover").show();
    let role = $('#update-emp-role' + id).val();
    let branch = $('#update-emp-branch' + id).val();
    let gender = $('#update-emp-gender' + id).val();
    console.log(`ajax_requests:update-emp::  ID: ${id}, Role: ${role}, Branch: ${branch}, Gender: ${gender}`);
    let response = await fetch("/update/emp",
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            role: role,
            branch: branch,
            gender: gender
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
    $(".cover").hide();
};

$('#customers').click(function() {
    $(".cover").show();
    $.ajax({url:'/all/customers' + window.location.search, type:'GET', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            $('#main-body').html(data);
            removeActive();
            $('#customers-menu').addClass('active');
            $(".cover").hide();
        }
    }});
});

$('#add-customer-button').click(async function() {
    $(".cover").show();
    let username = $('#add-customer-username').val();
    let password = $('#add-customer-password').val();
    let id = $('#add-customer-id').val();
    let phone = $('#add-customer-phone').val();
    let address = $('#add-customer-address').val();
    let gender = $('#add-customer-gender').val();
    console.log(`ajax_requests:add-customer:: Username: ${username}, Passward: ${password}, ID: ${id}, Phone: ${phone}, Gender: ${gender}`);
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
            address: address,
            gender: gender
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
    $(".cover").hide();
});

const update_customer = async (id) => {
    $(".cover").show();
    let phone = $('#update-customer-phone' + id).val();
    let address = $('#update-customer-address' + id).val();
    let gender = $('#update-customer-gender' + id).val();
    console.log(`ajax_requests:update-emp::  ID: ${id}, Phone: ${phone}, Address: ${address}, Gender: ${gender}`);
    let response = await fetch("/update/customer",
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: id,
            phone: phone,
            address: address,
            gender: gender
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
    $(".cover").hide();
};

$('#login-button').click(async function() {
    $(".cover").show();
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
    $(".cover").hide();
});

$('#logout').click(function() {
    $(".cover").show();
    let url = location.href.toString();
    if (url.indexOf("?") > 0) {
        let clean_url = url.substring(0, url.indexOf("?"));
        history.replaceState({}, document.title, clean_url);
        location = clean_url;
    }
    $(".cover").hide();
});

const removeEmployee = (id) => {
    $(".cover").show();
    console.log(`ajax_requests:remove-employee:: ID: ${id}`);
    $.ajax({url:`/remove/employee/${id}` + window.location.search, type:'DELETE', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            $('#main-body').html(data);
        }
    }});
    $(".cover").hide();
}

const removeCustomer = (id) => {
    $(".cover").show();
    console.log(`ajax_requests:remove-customer:: ID: ${id}`);
    $.ajax({url:`/remove/customer/${id}` + window.location.search, type:'DELETE', contentType:'text/html', success: function(data, status) {
        console.log('Status: ' + status);
        if (status == 'success') {
            console.log('result is 200');
            $('#main-body').html(data);
        }
    }});
    $(".cover").hide();
}

const selectCurrentGender = (id, gender) => {
    if (gender === 'Male') { 
        $('#update-customer-gender' + id + ' option[value=Male]').attr('selected', 'selected');
    }
    else if (gender === 'Female') {
        $('#update-customer-gender' + id + ' option[value=Female]').attr('selected', 'selected');
    }
}

const selectCurrentDetails = (id, gender, role) => {
    if (gender === 'Male') { 
        $('#update-emp-gender' + id + ' option[value=Male]').attr('selected', 'selected');
    }
    else if (gender === 'Female') {
        $('#update-emp-gender' + id + ' option[value=Female]').attr('selected', 'selected');
    }

    if (role === 'Admin') { 
        $('#update-emp-role' + id + ' option[value=Admin]').attr('selected', 'selected');
    }
    else if (role === 'Employee') {
        $('#update-emp-role' + id + ' option[value=Employee]').attr('selected', 'selected');
    }
}

const removeMsg = () => {
    $('#add-emp-err-msg').text('');
    $('#add-customer-err-msg').text('');
}

const removeActive = () => {
    $('.nav-item').removeClass('active');
}

const colorChecked = (colorBoxName) => {
    let colors = document.getElementsByClassName('select-color ' + colorBoxName.substr(1));
    for (let i = 0; i < colors.length; i++) {
      colors[i].style.boxShadow = "none";
    }
    let color = document.getElementById(colorBoxName);
    color.style.boxShadow = "0 7px 14px 0 rgba(0, 0, 0, 4)";
}

const messageSent = () => {
    $('#home').trigger('click');
}