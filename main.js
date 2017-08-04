//configure widgets
var ps_widget = new paydock.HtmlPaymentSourceWidget('#ps_widget', 'e664b3f83b8205dd694f943960006d73b70d1a7b', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZWZlcmVuY2UiOiJDdXN0b21SZWZlcmVuY2UiLCJsaW1pdCI6bnVsbCwic2tpcCI6bnVsbCwiaWF0IjoxNTAxNjYxNjA3fQ.GOznFm-U5ai1Jcb6RVJ1O16P20p4P7rne8d7O752zdw');
var cardAccount = new paydock.Configuration('597f1691121bf502e56ae9a6', 'card');
var bankAccount = new paydock.Configuration('597f1691121bf502e56ae9a6', 'bank_account');

cardAccount.setFormFields(['last_name']);
bankAccount.setFormFields(['last_name', 'account_bsb']);

var multi_widget = new paydock.HtmlMultiWidget('#multi_widget', '5a453a6ee532cc3c8d40b12360254cc87a58e33c', [cardAccount, bankAccount]);

// document ready events
$(".price-item-link").on( "click", function(e) {
    e.preventDefault();
});

$(".submit-button").on( "click", function(e) {
    e.preventDefault();
    multi_widget.trigger('submit_form');
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var target = $(e.target).attr("href");
    if(target == '#tab1')
        ps_widget.reload();

    if(target == '#tab2')
        multi_widget.trigger('tab', { tab_number: 1});

    if(target == '#tab3')
        multi_widget.trigger('tab', { tab_number: 2});

    $('.submit-button').html('Submit button');
});

//Multi widget init
multi_widget.setEnv('staging');
multi_widget.setHiddenElements(['tabs', 'submit_button']);
multi_widget.onFinishInsert('[name="one_time_token"]', 'payment_source');
multi_widget.load();

//ps widget settings
var CARD = {
    AUSBC: 'ausbc',
    VISA: 'visa',
    MASTERCARD: 'mastercard',
    DINERS: 'diners',
    JAPCB: 'japcb',
    LASER: 'laser',
    SOLO: 'solo',
    DISCOVER: 'discover',
    AMEX: 'amex',
    UNIONPAY: 'unionpay',
    MAESTRO: 'maestro'
};
ps_widget.setStyles({
    icon_size: 'small'
});
ps_widget.setLimit(20);
ps_widget.setRefId('test_ref_id');
ps_widget.setEnv('staging');
ps_widget.onSelectInsert('[name="payment_source"]', 'payment_source_id');
ps_widget.on('select', function (data) {
    setDataToButton(data);
});

multi_widget.on('metaChange', function (data) {
    setDataToButton(data)
});

function setDataToButton(data) {
    var submitText = 'Submit Form ';
    if(data.card_scheme && (data.payment_source_type || data.type) == 'card') {
        if(data.card_number_last4)
            submitText += ' ****' + data.card_number_last4;

        switch(data.card_scheme) {
            case CARD.VISA:
                $('.submit-button').html(submitText + ' <i class="fa fa-cc-visa"></i>');
                break;
            case CARD.MASTERCARD:
                $('.submit-button').html(submitText + ' <i class="fa fa-cc-mastercard"></i>');
                break;
            case CARD.AMEX:
                $('.submit-button').html(submitText + ' <i class="fa fa-cc-amex"></i>');
                break;
            default:
                $('.submit-button').html(submitText + ' <i class="fa fa-credit-card"></i>');
                break;
        }
    }

    if(!data.card_scheme && (data.payment_source_type || data.type) == 'bank_account'){
        submitText += data.account_number;
        $('.submit-button').html(submitText + ' <i class="fa fa-university"></i>');
    }
}
ps_widget.load();


// PayPal button init and config
var button = new paydock.CheckoutButton('#ch_button', 'e664b3f83b8205dd694f943960006d73b70d1a7b', '598463cc0b19c07172b1b336');
button.setBackdropDescription('Very long text');
button.setBackdropTitle('Checkout title');
button.setMeta({
    brand_name: 'Paydock',
    reference: '15',
    email: 'checriginoleg@gmail.com',
    hdr_img: 'https://media.licdn.com/mpr/mpr/AAEAAQAAAAAAAAy4AAAAJDFmZTk5ZjJjLTE0MWYtNDI5OS1hMmUwLWJhOTlhNzQ2MDFhZA.jpg',
    logo_img: 'https://media.licdn.com/mpr/mpr/AAEAAQAAAAAAAAy4AAAAJDFmZTk5ZjJjLTE0MWYtNDI5OS1hMmUwLWJhOTlhNzQ2MDFhZA.jpg',
    first_name: 'receiver name',
    last_name: 'receiver name',
    address_line: 'receiver street',
    address_line2: 'receiver street 2',
    address_city: 'receiver city',
    address_postcode: 'receiver zip',
    hide_shipping_address: '1',
    phone: '9379992'
});
button.setEnv('staging');
button.onFinishInsert('input[name="pst"]', 'payment_source_token');