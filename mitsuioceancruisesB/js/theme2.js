
$(document).ready(function () {

  // ===========================
  // LazyLoad 轉 src
  // ===========================
  $(".lazyload").each(function(){
    $(this).attr("src", $(this).data("src"));
  });

  // ===========================
  // Banner
  // ===========================
$(".banner-img").slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  dots: true,
  infinite: true,
  autoplay: true,
  autoplaySpeed: 2000,
  speed: 1200,
  fade: true,
  cssEase: "ease-in-out",
  adaptiveHeight: false // 關閉高度動畫
});


  // ===========================
  // 初始化多組商品 Slider + 縮圖 + Zoom
  // ===========================
  function initProductSlider(mainSelector, navSelector) {
    $(mainSelector).slick({
      asNavFor: navSelector,
      rows: 0,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      adaptiveHeight: true,
      autoplay: true,
      autoplaySpeed: 3000,
      responsive: [
        { breakpoint: 768, settings: { arrows: true } }
      ]
    });

    $(navSelector).slick({
      asNavFor: mainSelector,
      rows: 1,
      slidesToShow: 6,
      slidesToScroll: 1,
      focusOnSelect: true,
      dots: false,
      arrows: false
    });

    if ($.fn.zoom) {
      $(".zoom").zoom();
      $(".zoom--grab").zoom({ on: "grab" });
      $(".zoom--click").zoom({ on: "click" });
      $(".zoom--toggle").zoom({ on: "toggle" });
    }
  }

  for (let i = 1; i <= 20; i++) {
    initProductSlider(`#product-slider-main${i}`, `.product-slider-nav${i}`);
  }

  // ===========================
  // 甲板平面圖 Tab + 自動輪播 + 手機滑動
  // ===========================
(function () {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".details");
  const wrapper = document.querySelector(".details-wrapper");
  if (!tabs.length || !contents.length || !wrapper) return;

  let activeEl = document.querySelector(".details.active") || contents[0];
  let activeId = activeEl.id;
  const interval = 3000;
  const ids = [...contents].map(c => c.id);
  let autoTimer = null;

  // ===========================
  // 高度計算（核心）
  // ===========================
  function adjustHeight(el) {
    wrapper.style.height = el.offsetHeight + "px";
  }

  // 初始化高度（修正重新整理裁切）
  function initHeight() {
    const active = document.querySelector(".details.active") || contents[0];
    if (active) adjustHeight(active);
  }

  // 等圖片 + 字型載入完成
  window.addEventListener("load", initHeight);
  if (document.fonts) {
    document.fonts.ready.then(initHeight);
  }

  // 視窗尺寸改變（手機旋轉）
  window.addEventListener("resize", initHeight);

  // ===========================
  // Tab 滾動置中
  // ===========================
  function scrollTabIntoView(tab) {
    const nav = tab.closest(".deck-nav");
    if (!nav) return;
    const navRect = nav.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    nav.scrollLeft +=
      tabRect.left -
      navRect.left -
      navRect.width / 2 +
      tabRect.width / 2;
  }

  // ===========================
  // 切換內容
  // ===========================
  function switchTo(targetId, direction = "left") {
    if (targetId === activeId) return;

    const current = document.getElementById(activeId);
    const next = document.getElementById(targetId);
    if (!current || !next) return;

    tabs.forEach(t => t.classList.remove("active"));
    const t = [...tabs].find(t => t.dataset.target === targetId);
    if (t) {
      t.classList.add("active");
      scrollTabIntoView(t);
    }

    current.classList.remove("active");
    current.classList.add(direction === "left" ? "exit-left" : "exit-right");

    next.classList.remove("exit-left", "exit-right");
    next.offsetHeight; // 強制 reflow
    next.classList.add("active");

    adjustHeight(next);

    setTimeout(() => {
      current.classList.remove("exit-left", "exit-right");
    }, 1000);

    activeId = targetId;
  }

  // ===========================
  // 自動播放
  // ===========================
  function autoPlay() {
    autoTimer = setInterval(() => {
      let idx = ids.indexOf(activeId);
      switchTo(ids[(idx + 1) % ids.length], "left");
    }, interval);
  }

  function restartAutoPlay() {
    clearInterval(autoTimer);
    autoPlay();
  }

  // 啟動 autoplay（高度已由 load / fonts.ready 補正）
  autoPlay();

  // ===========================
  // 點擊 Tab
  // ===========================
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.target;
      const dir =
        ids.indexOf(target) > ids.indexOf(activeId) ? "left" : "right";
      switchTo(target, dir);
      restartAutoPlay();
    });
  });

  // ===========================
  // 滑入暫停
  // ===========================
  wrapper.addEventListener("mouseenter", () => clearInterval(autoTimer));
  wrapper.addEventListener("mouseleave", () => restartAutoPlay());

  // ===========================
  // 手機滑動
  // ===========================
  let startX = 0;
  wrapper.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  wrapper.addEventListener("touchend", e => {
    let diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) < 40) return;

    let idx = ids.indexOf(activeId);
    switchTo(
      diff < 0
        ? ids[(idx + 1) % ids.length]
        : ids[(idx - 1 + ids.length) % ids.length],
      diff < 0 ? "left" : "right"
    );

    restartAutoPlay();
  });
})();


  // ===========================
  // goTop
  // ===========================
  var goTopButton = $('#goTop');
  $(window).scroll(function() {
    $(this).scrollTop() > 200 ? goTopButton.fadeIn() : goTopButton.fadeOut();
  });
  goTopButton.click(function() {
    $('html, body').animate({ scrollTop: 0 }, 800);
  });

  // ===========================
  // 郵輪航程搜尋表單
  // ===========================
  const $form = $('.cruise-form');
  const $candidateCount = $('.candidate-count');
  const $selects = $form.find('select');
  const $resetBtn = $form.find('.btn-reset');

  function updateCandidateCount() {
    let count = 11;
    $selects.each(function() { if ($(this).val()) count--; });
    $candidateCount.text(count > 0 ? count : 0);
  }

  $selects.change(updateCandidateCount);
  $resetBtn.click(function() {
    $selects.val('');
    updateCandidateCount();
  });

});

