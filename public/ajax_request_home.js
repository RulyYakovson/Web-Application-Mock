$('#home').click(() => {
    $(".cover").show();
    const data = generateHomeHtml();
    console.log('result is 200');
    $('#main-body').html(data);
    removeActive();
    $('#home').addClass('active');
    $(".cover").hide();
});

const generateHomeHtml = () =>
    `<div class="home-page" style="height: 420px;">
    <div class="home-page">
        <h1 style="color: #138496">Welcome to the flower shop "FB", which is the leading supplier of flowers in the state of Israel</h1>
    </div>
</div>`;