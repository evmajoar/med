$(function() {

    // Show contacts on mobile
    if ($(window).width() <= 768 || $(window).resize()) {
        // Show contacts on click
        $('.mobile-contacts__button').click(function () {
            $('.mobile-contacts__modal').fadeToggle(300);
        });

        // Sticky contacts bar on mobile
        $(window).on('scroll', function() {
            var thisPos = $(this).scrollTop(); 
            var headerHeight = $('.main-header').height();
            var headerPos = $('.main-header').offset().top;
            var barHeight = $('.mobile-contacts').height();
            var stickyCoord = Math.abs(headerPos + headerHeight - barHeight);

            if (thisPos >= stickyCoord) {
                $('.mobile-contacts').addClass('mobile-contacts--sticky');
            }
            else {
                $('.mobile-contacts').removeClass('mobile-contacts--sticky');
            }
        });
    }

    // Show modal-form on click
    $('.js-modal-form').click(function() {
        $('.modal')
            .addClass('modal--slide-down')
            .children('.modal-form')
            .addClass('modal-form--show');
    });

    // Hide modal-form on click
    $('.close, .overlay').click(function() {
        $('.modal').removeClass('modal--slide-down')

        if ($('.modal-form').hasClass('modal-form--show')) {
            $('.modal-form').removeClass('modal-form--show');
        }
        else if ($('.modal-product').hasClass('modal-product--show')) {
            $('.modal-product').removeClass('modal-product--show')
        } 
    });

    // Hide modal-form on push ESC
    $(document).keyup(function(e) {
        if (e.keyCode === 27) {

            $('.modal').removeClass('modal--slide-down')

            if ($('.modal-form').hasClass('modal-form--show')) {
                $('.modal-form').removeClass('modal-form--show');

            }
            else if ($('.modal-product').hasClass('modal-product--show')) {
                $('.modal-product').removeClass('modal-product--show')
            } 

        }
    });

    // Ajax modal load on click
    $('.js-popup-product').click(function() {

        var id = $(this).data('id');

        if (id) {
            $('.modal')
            .addClass('modal--slide-down')
            .children('.modal-product')
            .addClass('modal-product--show')
            .load('products.html' + ' .' + id);
        }
    });


    // Init validate
    $('.js-form').each(function () {
        $(this).validate({
            rules: {
                name: {
                    required: true,
                    minlength: 3
                },
                tel: {
                    required: true
                },
                email: {
                    required: true,
                    email: true
                }
            
            },
            submitHandler: function(form) {
                $.ajax({
                    url: "mail.php",
                    type: "POST",
                    data: $(form).serialize(),
                    success: function() {
                        window.location.href = "thanks.html";
                    }
                });
            }
        });
    });

    // Init maskinput
    $('input[type="tel"]').mask("8 (999) 999 99 99");

});