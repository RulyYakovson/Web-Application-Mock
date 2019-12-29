$('#employees').click( () => {
    $(".cover").show();
    $.ajax({
        url:'employee/all',
        type:'GET',
        contentType:'application/json',
        success: (data, status) => {
            console.log('Status: ' + status);
            if (status == 'success') {
                removeActive();
                let html = generateEmployeesHtml(data);
                $('#main-body').html(html);
                $('#employees-menu').addClass('active');
                $(".cover").hide();
            }
        },
        error: (data, status) => {
            console.log('Status: ' + status);
            let html = generateErrorHtml(data);
            $('#main-body').html(html);
            removeActive();
            $('#employees-menu').addClass('active');
            $(".cover").hide();
        }
    });
});

$("form#add-emp-form-data").submit(async e => {
    $(".cover").show();
    e.preventDefault();    
    let username = $('#add-emp-username').val();
    let password = $('#add-emp-password').val();
    let id = $('#add-emp-id').val();
    let role = $('#add-emp-role').val();
    let branch = $('#add-emp-branch').val();
    let gender = $('#add-emp-gender').val();
    console.log(`ajax_requests:add-emp:: Username: ${username}, Passward: ${password}, ID: ${id}, Role: ${role}, Branch: ${branch}, Gender: ${gender}`);
    let response = await fetch('employee/add',
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
        $('#add-emp-err-msg').text('An error occurred while trying to add the employee');
    }
    $(".cover").hide();
});

const update_emp = async (id) => {
    let role = $('#update-emp-role' + id).val();
    let branch = $('#update-emp-branch' + id).val();
    let gender = $('#update-emp-gender' + id).val();
    console.log(`ajax_requests:update-emp::  ID: ${id}, Role: ${role}, Branch: ${branch}, Gender: ${gender}`);
    let response = await fetch('employee/update',
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
        console.log(`ajax_requests:update-emp:: Updating employee: ${id} finished successfully`);
        jQuery.noConflict();
        $('#' + id).modal('hide');
        location.reload();
    } else {
        $('#update-emp-err-msg' + id).text('An error occurred while trying to updating the employee');
    }
};

const removeEmployee = (id) => {
    console.log(`ajax_requests:remove-employee:: ID: ${id}`);
    $.ajax({
        url:`employee/remove/${id}`,
        type:'DELETE',
        contentType:'application/json',
        success: (data, status) => {
            console.log('Status: ' + status);
            if (status == 'success') {
                let html = generateEmployeesHtml(data);
                $('#main-body').html(html);
        }
    }});
};

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
};

const generateEmployeesHtml = data => {
    let employees = data.employees;
    let userRole = data.userRole;
    let html = `<div class="jumbotron text-center">
                                <h1>Employees</h1>
                            </div>
                            <div style="margin: 0px 130px 50px 130px">
                                <table class="table">
                                    <tbody>`;
                for (let i = 0; i < employees.length; i++) {
                    if(i % 5 === 0) {
                        html += `<tr>`;
                    }
                    html += `<td>
                                <div class="user-td-style">
                                    <div class="card" style="min-width: 227px; min-height: 427.4px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2)">
                                        <div class="modal fade" id=${employees[i].id} tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
                                            <div class="modal-dialog" role="document">
                                                <div class="modal-content">
                                                    <div class="modal-header">				
                                                        <h4 class="modal-title">${'Update details for ' + employees[i].username}</h4>
                                                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <form id="update-emp-form-data" onsubmit="update_emp(${employees[i].id})">
                                                            <div class="form-group">
                                                                <h5 class="modal-dialog">${'ID: '+ employees[i].id}</h5>
                                                            </div>
                                                            <div class="md-form mb-4">
                                                                <select class="form-control" id=${"update-emp-role" + employees[i].id}>
                                                                    <option label="Admin" value = "Admin" />
                                                                    <option label="Employee" value = "Employee" />
                                                                </select>					
                                                            </div>
                                                            <div class="md-form mb-4">
                                                                <input value=${employees[i].branch} id=${"update-emp-branch" + employees[i].id} type="number" class="form-control" placeholder="Branch number" required="required">					
                                                            </div>
                                                            <div class="md-form mb-4">
                                                                <select class="form-control" id=${"update-emp-gender" + employees[i].id}>
                                                                    <option label="Male" value = "Male" />
                                                                    <option label="Female" value = "Female" />
                                                                </select>					
                                                            </div>
                                                            <div class="form-group">
                                                                <input type="submit" value="Update" class="btn btn-primary btn-block btn-lg">
                                                            </div>
                                                        </form>
                                                        <p id=${"update-emp-err-msg" + employees[i].id} style="color: red"></p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>`;
                                        if (employees[i].gender === 'Male' && employees[i].role === 'Admin') {
                                            html += `<img class="card-img-top" src="/images/admin_male.png" alt="Card image" style="width:100%">`;
                                        } else if (employees[i].gender === 'Male' && employees[i].role === 'Employee') {
                                            html += `<img class="card-img-top" src="/images/user_male.png" alt="Card image" style="width:100%">`;
                                        } else if (employees[i].gender === 'Female' && employees[i].role === 'Admin') {
                                            html += `<img class="card-img-top" src="/images/admin_female.png" alt="Card image" style="width:100%">`;
                                        } else if (employees[i].gender === 'Female' && employees[i].role === 'Employee') {
                                            html += `<img class="card-img-top" src="/images/user_female.png" alt="Card image" style="width:100%">`;
                                        } else {
                                            html += `<img class="card-img-top" src="/images/template.jpg" alt="Card image" style="width:100%">`;
                                        }
                               html += `<div class="card-body">
                                            <h5 class="card-title">${employees[i].username}</h5>
                                            <h6 class="card-subtitle mb-2 text-muted">${employees[i].role}</h6>`;
                                            if (userRole === 'Admin') {
                                                html += `<h6 class="card-subtitle mb-2 text-muted">${'Password: ' + employees[i].password}</h6>`;
                                            }
                                   html += `<p class="card-subtitle">${'Branch: ' + employees[i].branch}</p>
                                            <p class="card-text">${'ID: ' + employees[i].id}</p>`;
                                            if (userRole === 'Admin') {
                                       html += `<div style="text-align: center;">
                                                    <a id="remove-employee" href="#" class="card-link" style="color: red"
                                                    onclick="removeEmployee(${employees[i].id})">Remove</a>
                                                    <a onclick="selectCurrentDetails('${employees[i].id}', '${employees[i].gender}', '${employees[i].role}')"
                                                        href="#" class="card-link" data-toggle="modal" data-target=${'#' + employees[i].id}>Update</a>
                                                </div>`;
                                            }
                                        html += `</div>
                                            </div>
                                        </div>
                                    </td>`;
                    if(i % 5 === 4) {
                        html += `</tr>`;
                    }
                }
                html += `   </tbody>
                        </table>
                    </div>`;
    return html;
};