$('#flowers').click(function() {
    $(".cover").show();
    $.ajax({
        url:'/flowers' + window.location.search,
        type:'GET',
        contentType:'application/json',
        success: (data, status) => {
        console.log('Status: ' + status);
        if (status == 'success') {
                let flowers = data.flowers;
                let html = `<div class="jumbotron text-center">
                                <h1>Flowers Catalog</h1>
                            </div>
                            <div style="margin: 0px 130px 50px 130px">
                                <table class="table">
                                    <tbody>`;
                for (let i = 0; i < flowers.length; i++) {
                    if(i % 3 === 0) {
                        html += `<tr>`;
                    }
                    html += `<td>
                                <div class="card" style="width: 22rem;  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2)">
                                    <div class="card-body">
                                        <div class="card-header text-white badge-primary" style="text-align: center; margin-bottom: 7px;">
                                            <h4 class="mb-1">${flowers[i].name}</h4>
                                        </div>
                                        <img class="card-img-top" alt="Card image cap" style="height: 17em;" src=${flowers[i].src} >
                                        <p class="card-text">Here supposed to come a detailed, nice explanation about the flower.</p>
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
                                        </div>
                                    </div>
                                </div>
                            </td>`;
                    if (i % 3 === 2) {
                        html += `<tr>`;
                    }
                }
                html +=     `</tbody>
                        </table>
                    </div>`;
                    
                $('#main-body').html(html);
                removeActive();
                $('#flowers').addClass('active');
                $(".cover").hide();
            }
        },
        error: (data, status) => {
            console.log('Status: ' + status);
            let html = `<div class="home-page" style="height: 420px;">
                            <div class="home-page">
                                <h1 style="color: #138496">Can't reach the page !!! </h1>
                                <h1 style="color: #138496">${"Status code:   " + data.status} </h1>
                            </div>
                        </div>`;
            $('#main-body').html(html);
            removeActive();
            $('#flowers').addClass('active');
            $(".cover").hide();
        }
    });
});

const colorChecked = (colorBoxName) => {
    let colors = document.getElementsByClassName('select-color ' + colorBoxName.substr(1));
    for (let i = 0; i < colors.length; i++) {
      colors[i].style.boxShadow = "none";
    }
    let color = document.getElementById(colorBoxName);
    color.style.boxShadow = "0 7px 14px 0 rgba(0, 0, 0, 4)";
}