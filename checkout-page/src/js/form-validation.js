function init() {
    $("form[name='credit-card-info']").validate({
        rules: {
            name: "required",
            cardnumber: {
                required: true,
                minlength: 13
            },
            date: "required",
            ccv: {
                required: true,
                minlength: 3,
                maxlength: 4
            },
            code: "required"
        },
        messages: {
            firstname: "Please enter name on the card",
            creditcardnumber: {
                required: "Please enter credit card number",
                minlength: "Credit card must contain at least 13 digits"
            },
            date: "Please enter expiration date",
            ccv: {
                required: "Please enter credit card ccv",
                minlength: "CCV must contain 3 digits at least",
                maxlength: "CCV must contain 4 digits at most"
            },
            code: "Please enter your postal code"
        }
    });
}

function submitForm(form) {
    if (form.valid()) {
        var btn = $('button');
        $('.text').css('display', 'none');
        $('.loader').css('display', 'block');
        btn.prop('disabled', 'true');

        setTimeout(function() {
            $('.loader').css('display', 'none');
            $('.check').css('display', 'block');

            $('button').css('background', '#7ED321');
        }, 2000)
    }
}
