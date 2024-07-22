function acceptCookies() {
    document.cookie = "cookiesAccepted=true; path=/";
    $('#cookiesModal').modal('hide');
}

$(document).ready(function() {
    if (document.cookie.indexOf('cookiesAccepted') === -1) {
        $('#cookiesModal').modal('show');
    }
});

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
    $('[data-toggle="popover"]').popover(); 
});

$('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus');
})



