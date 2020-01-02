$('#branches').click(() => {
    $(".cover").show();
    $.ajax({
        url: 'branch/all',
        type: 'GET',
        contentType: 'application/json',
        success: (data, status) => {
            console.log('Status: ' + status);
            if (status == 'success') {
                const html = generateBranchesHtml(data);
                $('#main-body').html(html);
                removeActive();
                $('#branches').addClass('active');
                $(".cover").hide();
            }
        },
        error: (data, status) => {
            console.log('Status: ' + status);
            const html = generateErrorHtml(data);
            $('#main-body').html(html);
            removeActive();
            $('#branches').addClass('active');
            $(".cover").hide();
        }
    });
});

const generateBranchesHtml = (data) => {
    const branches = data.branches;
    let html = `<div class="jumbotron text-center">
                                <h1>Branches</h1>
                            </div>
                            <div style="margin: 0px 130px 50px 130px">
                                <table class="table">
                                    <tbody>`;
    for (let i = 0; i < branches.length; i++) {
        if (i % 1 === 0) {
            html += `<tr>`;
        }
        html += `<td style="text-align: center;">
                                <div class="card" style="width: 65em; display: inline-block;  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2)">
                                    <div class="card-body">
                                        <div class="card-header text-white badge-primary" style="text-align: center; margin-bottom: 7px;">
                                            <h4 class="mb-1">${branches[i].name}</h4>
                                        </div>
                                        <div style="height: 27em;">
                                            <iframe width="100%" height="100%" frameborder="0" style="border:0;" allowfullscreen="" src=${branches[i].map}/>
                                        </div>
                                        <h1 style="text-align: center; margin-top: 20px;">
                                            <span class="badge badge-primary">${branches[i].address}</span>
                                        </h1>
                                        <h1 style="text-align: center; margin-top: 20px;">
                                            <span class="badge badge-primary">${'Tel: ' + branches[i].phone}</span>
                                        </h1>
                                    </div>
                                </div>
                            </td>`;
        if (i % 1 === 0) {
            html += `<tr>`;
        }
    }
    html += `</tbody>
                        </table>
                    </div>`;
    return html;
}