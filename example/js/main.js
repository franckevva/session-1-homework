/**
 * Created by Vladislava_Frantskev on 11/18/2014.
 */

window.onload = function () {

    var narrow = false;
    var header = $('#globalheader');
    var headerTop = header.find('.top-menu');
    var menuSec = header.find('.sec');
    var menuSub = header.find('.sub');
    var buttonsTop = headerTop.find('a');
    var buttonsSub = menuSec.find('a');
    var spClose = header.find('.intsp-btn-close');
    var isView = false;
    var $scroll = $('#alarm-scroll');
    var $main_wrap = $('#main-wrap');

    var changeTimerID = null;
    var closeTimerID = null;
    var closeTimeout = 2500;


    /*****************************************************************************************************************
     * INIT
     *****************************************************************************************************************/

    /* menuSec.css({display: 'none', opacity: 1});
     menuSub.css({display: 'none', opacity: 1});*/

    /*****************************************************************************************************************
     * EVENT BINDING
     *****************************************************************************************************************/

    buttonsTop.bind('click', clickSecButton);
    buttonsTop.bind('mouseenter', enterSecButton);
    buttonsSub.bind('mouseenter', enterSubButton);
    buttonsSub.bind('click', clickSubButton);
    //  header.bind('mouseleave', restartAllTimeout);
    // header.bind('mouseenter')
    //  spClose.bind('click', closeSp); // narrow only

    // close event
    menuSec.hover(function () {
        clearTimeout(closeTimerID);
    }, function () {
        setCloseTimer();
    });
    menuSub.hover(function () {
        clearTimeout(closeTimerID);
    }, function () {
        setCloseTimer();
    });


    /*****************************************************************************************************************
     * ENTER EVENT
     *****************************************************************************************************************/

        // sub
    function enterSecButton(e) {
        var that = this;
        if (this.tagName != 'A') {
            that = this.parentNode;
        }
        var self = $(that);
        if (!self.hasClass('selected')) {
            clearTimeout(closeTimerID);
            if (e.type == 'mouseenter') {
                clearTimeout(changeTimerID);
                self.addClass('hover').bind('mouseleave', function () {
                    self.unbind('mouseleave', arguments.callee);
                    self.removeClass('hover');
                });
                changeTimerID = setTimeout(function () {
                    if (self.hasClass('hover')) {
                        _open();
                    }
                }, 300);
            } else {
                _open();
            }
        }

        function _open() {
            self.addClass('selected');
            var selected = buttonsTop.filter('.selected');
            if (menuSub.filter('.open').length > 0) {
                closeSub();
                setTimeout(function () {
                    selected.each(function (i) {
                        if (this == that) {
                            openSec(selected.eq(i));
                        } else {
                            closeSec(selected.eq(i));
                        }
                    });
                }, 100);
            } else {
                selected.each(function (i) {
                    if (this == that) {
                        openSec(selected.eq(i));
                    } else {
                        closeSec(selected.eq(i));
                    }
                });
            }
        }
    }

// sub
    function enterSubButton(e) {
       /* if (narrow) return false;*/

        var that = this;
        var self = $(that);
        clearTimeout(closeTimerID);
        clearTimeout(changeTimerID);
        if (self.hasClass('selected')) {
           /* return false;*/
        }
        self.addClass('hover').bind('mouseleave', function () {
            self.unbind('mouseleave', arguments.callee);
            self.removeClass('hover');
        });

        if (self.attr('rel')) {
            // wait 300msec
            changeTimerID = setTimeout(function () {
                if (self.hasClass('hover')) {
                    self.addClass('selected');
                    var selected = buttonsSub.filter('.selected');
                    selected.each(function (i) {
                        if (this == that) {
                            openSub(selected.eq(i), e);
                        } else {
                            closeSub(selected.eq(i));
                        }
                    });
                }
                self.removeClass('hover');
            }, 300);
        } else {
            // wait 1000msec
            changeTimerID = setTimeout(function () {
                if (self.hasClass('hover')) {
                    closeSub();
                }
                self.removeClass('hover');
            }, 1000);
        }
    }


    /*****************************************************************************************************************
     * CLICK BINDING
     *****************************************************************************************************************/

        // sec
    function clickSecButton(e) {
        e.preventDefault();
        var self = $(this);
        if (self.hasClass('selected')) {
            if (menuSub.filter('.open').length > 0) {
                closeAll();
            } else {
                closeSec(self);
            }
        } else {
            enterSecButton.call(this, e);
        }
    }

// sub
    function clickSubButton(e) {
        if (narrow) return true;

        var that = this;
        var self = $(that);
        if (self.attr('rel')) {
            if (self.hasClass('selected')) {
                return true; // link
            } else {
                e.preventDefault();
                var selectedButton = buttonsSub.filter('.selected');
                if (selectedButton.length > 0) {
                    closeSub();
                    setTimeout(function () {
                        enterSubButton.call(that, e);
                    }, 100);
                } else {
                    enterSubButton.call(that, e);
                }
            }
        }
    }


    /*****************************************************************************************************************
     * ANIMATION
     *****************************************************************************************************************/

        // open sec
    function openSec(button) {
        var sec = $('#' + button.attr('href').split('#')[1]);
        sec.addClass('open').css({display: 'block', opacity: 0});
        setTimeout(function () {
            if (button.hasClass('selected')) {
                sec.css({opacity: 1});
            }
        }, 300);
    }

// open sub
    function openSub(button, e) {
        var sub = $(button.attr('rel'));
        sub.addClass('open').css({display: 'block', opacity: 0});
        setTimeout(function () {
            if (button.hasClass('selected')) {
                sub.css({opacity: 1});
            }
        }, 300);
    };

// close sec
    function closeSec(button) {
        if (button) {
            var sec = $('#' + button.attr('href').split('#')[1]);
            button.removeClass('selected');
        } else {
            var sec = menuSec.filter('.open');
            buttonsTop.filter('.selected').removeClass('selected');
        }
        sec.removeClass('open');
        sec.css({opacity: 0});
        setTimeout(function () {
            sec.hide();
        }, 300);
    }

// close sub
    function closeSub(button) {
        if (button) {
            var sub = $(button.attr('rel'));
            button.removeClass('selected');
        } else {
            var sub = menuSub.filter('.open');
            buttonsSub.filter('.selected').removeClass('selected');
        }
        sub.removeClass('open');
        sub.css({opacity: 0});
        setTimeout(function () {
            sub.hide();
        }, 300);
    }


    /*****************************************************************************************************************
     * UTILITY
     *****************************************************************************************************************/

        // close for narow mode
    function closeSp(e) {
        e.preventDefault();
        window.scrollTo(0, 1);
        closeSec();
    }

// close all menu
    function closeAll() {
        closeSub();
        setTimeout(closeSec, 200);
    }

// close timer
    function setCloseTimer() {
        clearTimeout(closeTimerID);
        closeTimerID = setTimeout(closeAll, closeTimeout);
    }


    /*function clickTopButton(event) {
     var $this = $(event.target).closest('a');
     console.log('clickTopButton');
     if (!$this.hasClass('selected')) {
     clearTimeout(closeTimerID);
     closeAllMenu();
     $this.addClass('selected');
     $($this.attr('href')).show();
     closeTimerID = setTimeout(closeSecMenu, closeTimeout);
     }
     if (event.type == 'mouseenter') {
     clearTimeout(closeTimerID);
     closeTimerID = setTimeout(closeSecMenu, closeTimeout);
     }
     }

     function clickSubButton(event) {
     var $this = $(event.target).closest('a');
     console.log('clickSubButton');
     if (!$this.hasClass('open')) {
     closeSubMenu();
     $this.addClass('open');
     $this.addClass('selected');
     $($this.attr('rel')).show();
     restartAllTimeout()
     }
     if (event.type == 'mouseenter') {
     restartAllTimeout();
     }
     }

     function closeAllMenu() {
     closeSubMenu();
     closeSecMenu();
     }

     function closeSubMenu() {
     $('.open', header).removeClass('open')
     .removeClass('selected');
     menuSub.hide();
     }

     function closeSecMenu() {
     $('.selected', headerTop).removeClass('selected');
     menuSec.hide();
     }

     function restartAllTimeout() {
     clearTimeout(closeTimerID);
     clearTimeout(changeTimerID);
     changeTimerID = setTimeout(closeSubMenu, closeTimeout);
     closeTimerID = setTimeout(closeSecMenu, closeTimeout);
     }
     */
    /**********************************************************************
     *
     * Animation Menu
     *
     **********************************************************************/

    var thumb_wraps = $('.menu-wrap .menu-element-wrap');
    var $mnav_close = $('#manv-close');

    function addEvent() {

        $('.menu-wrap .menu-element-wrap').each(function (i) {
            if (i >= 0) {
                $(this).on('mouseover', function () {
                    thumbActive(i, thumb_wraps);
                });

                $(this).on('mouseout', function () {
                    thumbActive(-1, thumb_wraps);
                });
            }
        });

        $mnav_close.on('click', function () {
            if (isView) {
                isView = false;
                $main_wrap.hide();
                $scroll.show();
                $scroll.css({opacity: 1});
            }
        });

    }


    function thumbActive(id, thumbs) {
//        if (issue_changing || !navi_open)return;
        for (var o in thumbs) {
            if (o >= 0) {
                var thumb = $(thumbs[o]);
                opacity = 1,
                    css3 = {tx: 0, ty: 0, tz: 0};
                var scale = 1;
                if (o == id) {
                    opacity = 1;
                    css3.tz = 100;
                    scale = 1.1;
                } else if (id == -1) {
                    opacity = 1;
                } else {
                    opacity = .5;
                    css3.tz = -200;
                    scale = 0.9;
                }

                /* if (modCSSTransforms && modCSSTransitions) {
                 */
                thumb.css({opacity: opacity});
                thumb.css(css3_scale(scale));
                /*} else {
                 thumb.stop().animate({opacity: opacity}, 600, 'easeOutQuint');
                 }*/
            }
        }
    }


    /* ************************************************************
     CSS3
     ************************************************************ */
    function css3_scale(scale) {
        var css3 = "scale(" + scale + ")";
        return{
            "-webkit-transform": css3,
            "-moz-transform": css3,
            "-o-transform": css3,
            "-ms-transform": css3,
            "transform": css3
        };
    }


    /* ************************************************************
     Scroll Setting
     ************************************************************ */


    $(window).mousewheel(function () {
        if (!isView) {
            $main_wrap.css({opacity: 1, display: 'block'});
            $scroll.css({opacity: 0});
            isView = true;
        }
    });

    addEvent();

}
;

