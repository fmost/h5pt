(function () {
    $('.tab-nav').on('click', '.item', function(){
        $(this).addClass('cur').siblings().removeClass('cur')
    })
})()