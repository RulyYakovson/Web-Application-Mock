$('#contact').click( () => {
    $(".cover").show();
    let data = generateContactHtml();
    console.log('result is 200');
    $('#main-body').html(data);
    removeActive();
    $('#contact').addClass('active');
    $(".cover").hide();
});

const messageSent = async () => {
    $(".cover").show(); // TODO: cover doesn't show
    await setTimeout(async () => {
        $('#home').trigger('click');
    }, 1500);
    $(".cover").hide();
};

const generateContactHtml = () =>
`<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.1.0/css/all.css" integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt" crossorigin="anonymous">
<div class="container">
	<div class="row justify-content-center" style="margin-top: 30px;">
		<div class="col-12 col-md-8 col-lg-6 pb-5">
            <div class="card border-primary rounded-0">
                <div class="card-header p-0">
                    <div class="bg-info text-white text-center py-2">
                        <h3><i class="fa fa-envelope"></i> Contact us</h3>
                        <p class="m-0">We will gladly help you</p>
                    </div>
                </div>
                <div class="card-body p-3">
                    <div class="form-group">
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa fa-user text-info"></i></div>
                            </div>
                            <input type="text" class="form-control" placeholder="Full name" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa fa-envelope text-info"></i></div>
                            </div>
                            <input type="email" class="form-control" placeholder="example@gmail.com" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                                <div class="input-group-text"><i class="fa fa-comment text-info"></i></div>
                            </div>
                            <textarea class="form-control" placeholder="Send us your message" required></textarea>
                        </div>
                    </div>
                    <div class="text-center">
                        <button onclick="messageSent()" id="contact-msg-btn" class="btn btn-info btn-block btn-lg">Send</button>
                    </div>
                </div>
            </div>
        </div>
	</div>
</div>`;