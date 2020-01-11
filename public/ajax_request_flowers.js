$('#flowers').click(() => {
    $(".cover").show();
    $.ajax({
        url: 'flower/all',
        type: 'GET',
        contentType: 'application/json',
        success: (data, status) => {
            console.log('Status: ' + status);
            if (status == 'success') {
                let html = generateFlowersHtml(data);
                $('#main-body').html(html);
                removeActive();
                $('#flowers-menu').addClass('active');
                $('#flowers').addClass('active');
                $(".cover").hide();
            }
        },
        error: (data, status) => {
            console.log('Status: ' + status);
            let html = generateErrorHtml(data);
            $('#main-body').html(html);
            removeActive();
            $('#flowers-menu').addClass('active');
            $('#flowers').addClass('active');
            $(".cover").hide();
        }
    });
});

$("form#add-flower-form-data").submit(e => {
    $(".cover").show();
    e.preventDefault();
    const formData = new FormData(document.getElementById('add-flower-form-data'));
    console.log('ajax_requests::add-flower');
    $.ajax({
        url: 'flower/add',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: (data, status) => {
            console.log('Status: ' + status);
            if (status == 'success') {
                jQuery.noConflict();
                $('#add-flower-modal').modal('hide');
                location.reload();
            }
            $(".cover").hide();
        },
        error: (data, status) => {
            console.log('Status: ' + status);
            $('#add-flower-err-msg').text('An error occurred while trying to add the flower');
            $(".cover").hide();
        }
    });
});

const colorChecked = colorBoxName => {
    const colors = document.getElementsByClassName('select-color ' + colorBoxName.substr(1));
    for (let i = 0; i < colors.length; i++) {
        colors[i].style.boxShadow = "none";
    }
    const color = document.getElementById(colorBoxName);
    color.style.boxShadow = "0 7px 14px 0 rgba(0, 0, 0, 4)";
};

const removeFlower = name => {
    console.log(`ajax_requests:remove-flower:: ID: ${name}`);
    $.ajax({
        url: `flower/remove/${name}`,
        type: 'DELETE',
        contentType: 'application/json',
        success: (data, status) => {
            console.log('Status: ' + status);
            if (status == 'success') {
                let html = generateFlowersHtml(data);
                $('#main-body').html(html);
            }
        }
    });
};

const generateFlowersHtml = (data) => {
    const flowers = data.flowers;
    const userRole = data.userRole;
    let html = `<div class="jumbotron text-center">
                                <h1>Flowers Catalog</h1>
                            </div>
                            <div style="margin: 0px 130px 50px 130px">
                                <table class="table">
                                    <tbody>`;
    for (let i = 0; i < flowers.length; i++) {
        if (i % 3 === 0) {
            html += `<tr>`;
        }
        html += `<td>
                                <div class="card" style="width: 22rem; max-height: 535px; box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2)">
                                    <div class="card-body">
                                        <div class="card-header text-white badge-primary" style="text-align: center; margin-bottom: 7px;">
                                            <h4 class="mb-1">${flowers[i].name}</h4>
                                        </div>
                                        <img class="card-img-top" alt="Card image cap" style="height: 17em;" src="data:image/png;base64, ${flowers[i].src}" >
                                        <p class="card-text">${flowers[i].description}</p>
                                        <h4 style="text-align: center;">
                                            <span class="badge badge-primary">${flowers[i].price}  &#8362; </span>
                                        </h4>
                                        <div style="margin-top: 15px; text-align: center;">
                                            <div style="display: inline-flex">
                                                <div class="select-color ${flowers[i].name} ligth-blue" onclick="colorChecked('${'1' + flowers[i].name}')" id=${'1' + flowers[i].name} ></div>
                                                <div class="select-color ${flowers[i].name} red" onclick="colorChecked('${'2' + flowers[i].name}')" id=${'2' + flowers[i].name} ></div>
                                                <div class="select-color ${flowers[i].name} wine" onclick="colorChecked('${'3' + flowers[i].name}')" id=${'3' + flowers[i].name} ></div>
                                                <div class="select-color ${flowers[i].name} transparent" onclick="colorChecked('${'4' + flowers[i].name}')" id=${'4' + flowers[i].name} ></div>
                                                <div class="select-color ${flowers[i].name} blue" onclick="colorChecked('${'5' + flowers[i].name}')" id=${'5' + flowers[i].name} ></div>
                                                <div class="select-color ${flowers[i].name} green" onclick="colorChecked('${'6' + flowers[i].name}')" id=${'6' + flowers[i].name} ></div>
                                                <div class="select-color ${flowers[i].name} purple" onclick="colorChecked('${'7' + flowers[i].name}')" id=${'7' + flowers[i].name} ></div>
                                            </div>
                                        </div>`;
        if (userRole && userRole === 'Admin') {
            html += `<div class="row justify-content-end">
                                                        <button style="height:27px" class="btn-danger align-self-end" onclick="removeFlower('${flowers[i].name}')">
                                                            <i class="fa fa-trash-o" style="font-weight: 900; display: block;"></i>
                                                        </button>
                                                    </div>`;
        }
        html += `</div>
                                </div>
                            </td>`;
        if (i % 3 === 2) {
            html += `<tr>`;
        }
    }
    html += `</tbody>
                        </table>
                    </div>`;
    return html;
}