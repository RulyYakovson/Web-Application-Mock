$('#customers').click(() => {
    $(".cover").show();
    $.ajax({
        url: 'customer/all',
        type: 'GET',
        contentType: 'application/json',
        success: (data, status) => {
            console.log('Status: ' + status);
            if (status == 'success') {
                const html = generateCustomersHtml(data);
                $('#main-body').html(html);
                removeActive();
                $('#customers-menu').addClass('active');
                $(".cover").hide();
            }
        },
        error: (data, status) => {
            console.log('Status: ' + status);
            const html = generateErrorHtml(data);
            $('#main-body').html(html);
            removeActive();
            $('#customers-menu').addClass('active');
            $(".cover").hide();
        }
    });
});

$("form#add-customer-form-data").submit(async e => {
    $(".cover").show();
    e.preventDefault();
    const username = $('#add-customer-username').val();
    const password = $('#add-customer-password').val();
    const id = $('#add-customer-id').val();
    const phone = $('#add-customer-phone').val();
    const address = $('#add-customer-address').val();
    const gender = $('#add-customer-gender').val();
    const encryptedPass = encrypt(password);
    const response = await fetch('customer/add',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: encryptedPass,
                id: id,
                role: 'customer',
                phone: phone,
                address: address,
                gender: gender
            })
        });
    if (response.ok) {
        jQuery.noConflict();
        $('#add-customer-modal').modal('hide');
        location.reload();
    } else if (response.status === 400) {
        $('#add-customer-err-msg').text('A user with the given username or ID is already exist');
    } else {
        $('#add-customer-err-msg').text('An error occurred while trying to add the user');
    }
    $(".cover").hide();
});

const update_customer = async id => {
    const phone = $('#update-customer-phone' + id).val();
    const address = $('#update-customer-address' + id).val();
    const gender = $('#update-customer-gender' + id).val();
    const response = await fetch('customer/update',
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
    if (response.ok) {
        jQuery.noConflict();
        $('#' + id).modal('hide');
        location.reload();
    } else {
        $('#update-customer-err-msg').text('An error occurred while trying to updating the user');
    }
};

const removeCustomer = id => {
    console.log(`ajax_requests:remove-customer:: ID: ${id}`);
    $.ajax({
        url: `customer/remove/${id}`,
        type: 'DELETE',
        contentType: 'application/json',
        success: (data, status) => {
            console.log('Status: ' + status);
            if (status == 'success') {
                const html = generateCustomersHtml(data);
                $('#main-body').html(html);
            }
        },
        error: (data, status) => {
            console.log('Status: ' + status);
            const html = generateErrorHtml(data);
            $('#main-body').html(html);
            removeActive();
            $('#customers-menu').addClass('active');
        }
    });
};

const selectCurrentGender = (id, gender) => {
    if (gender === 'Male') {
        $('#update-customer-gender' + id + ' option[value=Male]').attr('selected', 'selected');
    }
    else if (gender === 'Female') {
        $('#update-customer-gender' + id + ' option[value=Female]').attr('selected', 'selected');
    }
};

const generateCustomersHtml = (data) => {
    const customers = data.customers;
    const userRole = data.userRole;
    let html = `<div class="jumbotron text-center">
                                <h1>Customers</h1>
                            </div>
                            <div style="margin: 0px 130px 50px 130px">
                                <table class="table">
                                    <tbody>`;
    for (let i = 0; i < customers.length; i++) {
        if (i % 5 === 0) {
            html += `<tr>`;
        }
        html += `<td>
                                <div class= "user-td-style">
                                    <div class="card" style="min-width: 227px; min-height: 445.74px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2)">
                                        <div class="modal fade" id=${customers[i].id} tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                                        <div class="modal-dialog" role="document">
                                            <div class="modal-content">
                                                <div class="modal-header">				
                                                    <h4 class="modal-title">${'Update details for ' + customers[i].username}</h4>
                                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                                                </div>
                                                <div class="modal-body">
                                                    <form id="update-customer-form-data" onsubmit="update_customer(${customers[i].id})">
                                                        <div class="form-group">
                                                            <h5 class="modal-dialog">${'ID: ' + customers[i].id}</h5>
                                                        </div>
                                                        <div class="md-form mb-4">
                                                            <input value=${customers[i].phone} id=${"update-customer-phone" + customers[i].id} type="tel" class="form-control" placeholder="Phone" required="required">					
                                                        </div>
                                                        <div class="md-form mb-4">
                                                            <input value=${customers[i].address} id=${"update-customer-address" + customers[i].id} type="email" class="form-control" placeholder="Address" required="required">					
                                                        </div>
                                                        <div class="md-form mb-4">
                                                            <select class="form-control" id=${"update-customer-gender" + customers[i].id}>
                                                                <option label="Male" value = "Male" />
                                                                <option label="Female" value = "Female" />
                                                            </select>					
                                                        </div>
                                                        <div class="form-group">
                                                            <input type="submit" value="Update" class="btn btn-primary btn-block btn-lg">
                                                        </div>
                                                    </form>
                                                    <p id=${"update-customer-err-msg" + customers[i].id} style="color: red"></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
        if (customers[i].gender === 'Male') {
            html += `<img class="card-img-top" src="/images/user_male.png" alt="Card image" style="width:100%">`;
        } else if (customers[i].gender === 'Female') {
            html += `<img class="card-img-top" src="/images/user_female.png" alt="Card image" style="width:100%">`;
        } else {
            html += `<img class="card-img-top" src="/images/template.jpg" alt="Card image" style="width:100%">`;
        }
        html += `<div class="card-body">
                                            <h5 class="card-title">${customers[i].username}</h5>`;
        if (userRole === 'Admin') {
            html += `<h6 class="card-subtitle mb-2 text-muted">${'Password: ' + customers[i].password}</h6>`;
        }
        html += `<p class="card-text">${'ID: ' + customers[i].id}</p>
                                            <p class="card-subtitle">${'Phone: ' + customers[i].phone}</p>
                                            <p class="card-text">${'Address: ' + customers[i].address}</p>`;
        if (userRole === 'Admin') {
            html += `<div style="text-align: center;">
                                                    <a id="remove-customer" href="#" class="card-link" style="color: red"
                                                    onclick="removeCustomer(${customers[i].id})">Remove</a>
                                                    <a onclick="selectCurrentGender('${customers[i].id}', '${customers[i].gender}')"
                                                        href="#" class="card-link" data-toggle="modal" data-target=${'#' + customers[i].id}>Update</a>
                                                </div>`;
        }
        html += `</div>
                                        </div>
                                    </div>
                                </td>`;
        if (i % 5 === 4) {
            html += `</tr>`;
        }
    }
    html += `   </tbody>
                        </table>
                    </div>`;
    return html;
};