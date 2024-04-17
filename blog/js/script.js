
  // 计算阈值
const threshold = window.innerHeight+120;

// 检查元素是否在视口内的函数
function isElementInViewport(element,index) {
  const bounding = element.getBoundingClientRect();
  return (
    // bounding.top >= 0 &&
    // bounding.top <= threshold
    bounding.bottom >= 0 &&
    bounding.top <= threshold
  );
}

// 监听滚动事件
function handleScroll() {
  const animateElements = document.querySelectorAll('.to-top,.to-opacity,.mark-bottom');
  animateElements.forEach((element,index) => {
    if (!element.classList.contains('appear') && isElementInViewport(element,index)) {
      element.classList.add('appear');
    }
  });
}

// 初始检查，如果元素初始位置已经在视口中，则立即触发动画
window.initialCheck = function () {
  const animateElements = document.querySelectorAll('.to-top,.to-opacity,.mark-bottom');
    animateElements.forEach((element,index) => {
    if (isElementInViewport(element,index)) {
      element.classList.add('appear');
    }
  });
}

// 在页面加载时和滚动时都执行初始检查
window.addEventListener('load', initialCheck);
window.addEventListener('scroll', handleScroll);

window.$ = jQuery
  
  function mediaRealSlider($el) {
    let $p = $el;
    let $list = $p.find('.u-carousel-list');
    let length = $list.find('.u-carousel-item').length;
    let index = -length; //[0,-length-2]
    let isLeftBtn = 1; //0左 1右
    let timer = null;
    let mrNum = window.innerWidth>768?38:28
    if (length < 5) return;

    $list.html(
      $list.html().repeat(3)
    );
    skewTransform(true);
    function skewTransform(auto, tIndex = index, skew = 0) {
      let width = $list
        .find('.u-carousel-item')
        .eq(Math.abs(tIndex) - 1)
        .width();
      let translateX = (width + mrNum) * tIndex;
      if (auto) {
        translateX += skew;
        $list.css({
          transform: 'translateX(' + translateX + 'px)',
          transition: ' all 0s ease',
        });
      } else {
        $list.css({
          transform: 'translateX(' + translateX + 'px)',
          transition: ' all .6s ease',
        });
      }
    }
    function changeLeft(skew) {
      if (isLeftBtn && index == -2*length) {
        skewTransform(true, -length + 1, skew);
        index = -length;
      }
      if (!isLeftBtn && index == -length+1) {
        skewTransform(true, -2*length, skew);
        index = -2*length + 1;
      }
      setTimeout(() => {
        skewTransform();
      }, 10);
    }

    function getTranslateX($element) {
      var matrix = $element
        .css('transform')
        .replace(/[^0-9\-.,]/g, '')
        .split(',');
      var translateX = parseFloat(matrix[12] || matrix[4]);
      return translateX;
    }
    function clearTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function initMobileCarousel() {
      let startX = 0;
      let listTar = 0;
      let startY = 0;
      let isScrolling = false;
      let isDragging = false;

      function setAutoPlay() {
        clearTimer();
        timer = setInterval(() => {
          isLeftBtn = 1;
          index--;
          changeLeft();
        }, 5000);
      }

      $list.on('touchstart mousedown', function (e) {
        clearTimer();

        if (e.type === 'touchstart') {
          var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
          startX = touch.clientX;
          startY = touch.clientY;
        } else {
          startX = e.clientX;
          startY = e.clientY;
        }

        isScrolling = false;
        isDragging = true;
        listTar = getTranslateX($list);
        $(document).on('touchmove mousemove', handleMove);
        $(document).on('touchend mouseup', handleEnd);
      });

      function handleMove(e) {
        if (isDragging) {
          if (e.type === 'touchmove') {
            var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            var diffX = touch.clientX - startX;
            var diffY = touch.clientY - startY;
          } else {
            var diffX = e.clientX - startX;
            var diffY = e.clientY - startY;
          }

          var translateX = listTar + diffX;

          if (!isScrolling) {
            if (Math.abs(diffX) > Math.abs(diffY)) {
              isScrolling = true;
            }
          }
          if (isScrolling && e.cancelable) {
            e.preventDefault();
            $list.css({ transform: 'translateX(' + translateX + 'px)', transition: 'all 0s ease' });
          }
        }
      }

      function handleEnd(e) { 
        if (isDragging) {
          $(document).off('touchmove mousemove', handleMove);
          $(document).off('touchend mouseup', handleEnd);
          
          // 检查被拖动的目标元素是否是a标签
          const isAnchorTag = $(e.target).closest('a').length > 0;
     
          if (isScrolling) {
            if (e.type === 'touchend') {
              var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
              var diffX = touch.clientX - startX;
            } else {
              var diffX = e.clientX - startX;
            }

            if (Math.abs(diffX) > window.innerWidth * 0.05) {
              if (diffX > 0) {
                index = index + 1;
                isLeftBtn = 0;
              } else {
                index = index - 1;
                isLeftBtn = 1;
              }
              changeLeft(diffX);
            } else {
              $list.css({ transform: 'translateX(' + listTar + 'px)', transition: 'all .4s ease' });
            }
          }else{
            isDragging = false;
          }

          setAutoPlay(); // 保证只触发一次自动播放
          if (isAnchorTag&&window.innerWidth>640) {
            // 如果是a标签，阻止默认行为并返回
            e.stopPropagation()
            e.preventDefault()
            return false
          }
          isScrolling = false;
          isDragging = false;
        }
      }
      $p.find('a').click(function(e){
        if(isDragging){
          e.preventDefault()
          return false
        }
      })
    }
    initMobileCarousel();
    clearTimer();

    timer = setInterval(() => {
      isLeftBtn = 1;
      index--;
      changeLeft();
    }, 5000);

    $list.hover(
      function () {
        clearTimer();
      },
      function () {
        clearTimer();
        timer = setInterval(() => {
          isLeftBtn = 1;
          index--;
          changeLeft();
        }, 5000);
      }
    );
  }
  $('.u-carousel-box').each(function(){
    mediaRealSlider($(this));
  })

  function uAnnouncementBarSwiper($el){
    let $item = $el.find('.u-announcement-bar-item')
    let $arraw = $el.find('.u-announcement-bar-arraw')
    let length = $item.length
    let time = +new Date()
    let index = 0
    let timer = null

    function changeItem(){
      if(index==length) index = 0
      if(index==-1) index = length - 1
      $el.find('.u-announcement-bar-item.active').addClass('close')
      $item.removeClass('active').eq(index).addClass('active')
      setTimeout(() => {
      $el.find('.u-announcement-bar-item.close').removeClass('close')
      }, 500);
    }

    $arraw.click(function(){
      if(+new Date() - time < 800) return
      time = +new Date()
      index +=$(this).data('index')==0?-1:1
      clearInterval(timer)
      changeItem()
      timer = setInterval(() => {
        index++
        changeItem()
      }, 3000);
    })

    timer = setInterval(() => {
      index++
      changeItem()
    }, 3000);
  }

  if($('.u-announcement-bar').length){
    uAnnouncementBarSwiper($('.u-announcement-bar'))
  }


  const lenis = new Lenis()

  // // lenis.on('scroll', (e) => {
  // // })
  
  function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  
  requestAnimationFrame(raf)
  

  $('.u-blog-head .u-blog-head-item .u-chid-btn').click(function(e){
    e.preventDefault()
    if(window.innerWidth>991){
      $('body').toggleClass('u-open-mark')
    }
    $(this).parents('.u-blog-head-item').siblings('.u-blog-head-item').find('.u-chid-btn').removeClass('active')
    $(this).parents('.u-blog-head-item').siblings('.u-blog-head-item').find('.u-blog-chid-list').slideUp()
    
    $(this).siblings('.u-blog-chid-list').slideToggle()
    $(this).toggleClass('active')
    if($(this).hasClass('active')){
      $(this).closest('.u-blog-head').addClass('u-open')
    }else{
      $(this).closest('.u-blog-head').removeClass('u-open')
    }
  })

  $('.u-mobile-head .u-mobile-btn').click(function(){
    $('body').toggleClass('u-open-mark')
    $(this).toggleClass('active')
    $(this).closest('.u-mobile-chid').find('.u-blog-head-cont').slideToggle()
    $(this).closest('.u-mobile-chid').find('.u-blog-head').removeClass('u-open').find('.u-blog-chid-list').slideUp()
  })

  $(document).click(function(e){
    if(window.innerWidth<991){
      if(e.target.className.includes&&!e.target.className.includes('u-mobile-btn') && !e.target.className.includes('u-chid-btn')){
        $('body').removeClass('u-open-mark')
        $('.u-mobile-head .u-mobile-btn').removeClass('active')
        $('.u-blog-head-cont').slideUp()
        $('.u-blog-head').removeClass('u-open')
        $('.u-blog-chid-list').slideUp()
        $('.u-chid-btn').removeClass('active')
      }
    }else{
      if(!e.target.className.includes('u-chid-btn')){
        $('body').removeClass('u-open-mark')
        $('.u-blog-head').removeClass('u-open')
        $('.u-blog-chid-list').slideUp()
        $('.u-chid-btn').removeClass('active')
      }
    }

  })

  // 菜单开关
  $('.u-mobile-head .u-menu-btn').click(function(){
    $('body').addClass('u-open-menu')
  })
  $('.u-header .u-mobile-close').click(function(){
    $('body').removeClass('u-open-menu')
  })
  // 菜单开关

  // 详情页进度条
  function getProgressNum(){
    let $p=$('.u-blog-cont .u-blog-cont-left')
    if($p.length>0){
      let top = $p[0].offsetTop
      let rect = $p[0].getBoundingClientRect()
      let num = 0
      if(rect.top<153){
        num = (rect.top - 153)/(rect.height+153)
      }
      $('body').attr('style','--width-num:'+(-num)*100+'%')
      // ||rect.bottom<153
      if(num>=0||num<=-1){
        $('.u-progress-box').hide()
      }else{
        $('.u-progress-box').show()
      }
    }
  }
  getProgressNum()
  $(window).scroll(function(){
		getProgressNum()
	})
  // 详情页进度条

  $('html').on('click','.u-blog-product-adv-close',function(){
    $(this).parents('.u-blog-product-adv').remove()
  })