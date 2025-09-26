var initialized = false;
var firstPlay = false;
var player;
var currentTime = 0;
var areControlsVisible = true;
var controlTimeout;
var hideControls = false;
var hidePlaceholderCaptionTimeout = null;

var captionSizes = [
  {percentage: 25, fontSize: "12px"},
  {percentage: 50, fontSize: "18px"},
  {percentage: 75, fontSize: "24px"},
  {percentage: 100, fontSize: "30px"},
  {percentage: 150, fontSize: "36px"},
  {percentage: 200, fontSize: "42px"},
  {percentage: 300, fontSize: "54px"}
];

captionSizesFullscreen = [
  {percentage: 25, fontSize: "18px"},
  {percentage: 50, fontSize: "24px"},
  {percentage: 75, fontSize: "30px"},
  {percentage: 100, fontSize: "36px"},
  {percentage: 150, fontSize: "42px"},
  {percentage: 200, fontSize: "54px"},
  {percentage: 300, fontSize: "66px"}
];

var captionColors = [
  {hex: "#ffffff", colorText: "Beyaz"},
  {hex: "#ffff00", colorText: "Sarı"},
  {hex: "#00ff00", colorText: "Yeşil"},
  {hex: "#00ffff", colorText: "Camgöbeği"},
  {hex: "#0000ff", colorText: "Mavi"},
  {hex: "#ff00ff", colorText: "Pembe"},
  {hex: "#ff0000", colorText: "Kırmızı"},
  {hex: "#000000", colorText: "Siyah"},
];
var captionSize = {percentage: 50, fontSize: "18px"};
var captionTextColor = {hex: "#ffffff", colorText: "Beyaz"};
var captionBackgroundColor = {hex: "#000000", colorText: "Siyah"};

loadLocalStorageSettings();

var subject = "Konu Başlığı"; // konu başlığı
var subTopic = "Konu Açıklaması"; // konu açıklaması

// videonun içerisinde bulunan uygulamalar ve işlemler burada tanımlanır // İŞLEM YAPILACAK
var applications = [
  {
    actionFx: function (marker) {
      console.log("video buraya ulaştı, eylemi yapabilirsin", marker); //İŞLEM YAPILACAK
      alert(marker.label);
    },
    pauseOnTime: true,
    marker: {
      time: 30, // saniye
      label: "İşaretçi Başlığı 1",
    },
  },
  {
    actionFx: function (marker) {
      console.log("video buraya ulaştı, eylemi yapabilirsin", marker); //İŞLEM YAPILACAK
      alert(marker.label);
    },
    pauseOnTime: true,
    marker: {
      time: 150, // saniye
      label: "İşaretçi Başlığı 2",
    },
  },
];

var topicListButtonClicked = function () {
  // konu başlıklarını gösterme fonksiyonu
  player.pause();
  console.log("konu başlıkları gösterilecek");
  alert("konu başlıkları");
  // İŞLEM YAPILACAK
};

// Dual mode initialization - supports both immediate and click-to-load
document.addEventListener("DOMContentLoaded", function () {
  const videoElement = document.getElementById("player");
  const placeholder = document.getElementById("video-placeholder");
  
  if (videoElement && !placeholder) {
    // Original mode: Video element already exists in DOM
    console.log("Original mode: Video elementi mevcut, hemen başlatılıyor...");
    initPlayer({
      applications: applications,
      topicListButtonClicked: topicListButtonClicked,
      pauseOnApplication: true,
      subject: subject,
      subTopic: subTopic,
    }).then((player) => {
      var duration = player.duration;
      console.log("duration ", duration);

      var durationTime = durationToTime(duration);
      console.log("durationTime ", durationTime);
      
      initialized = true;
      console.log("Original mode: Video başarıyla başlatıldı");
    }).catch((error) => {
      console.error("Original mode video initialization failed:", error);
    });
  } else if (placeholder && !videoElement) {
    // Deferred mode: Only placeholder exists
    console.log("Deferred mode: Video placeholder hazır - video tıklandığında yüklenecek.");
  } else if (videoElement && placeholder) {
    console.warn("Both video element and placeholder found. Using original mode.");
    // Use original mode if both exist
    initPlayer({
      applications: applications,
      topicListButtonClicked: topicListButtonClicked,
      pauseOnApplication: true,
      subject: subject,
      subTopic: subTopic,
    }).then((player) => {
      var duration = player.duration;
      console.log("duration ", duration);

      var durationTime = durationToTime(duration);
      console.log("durationTime ", durationTime);
      
      initialized = true;
      console.log("Mixed mode: Video başarıyla başlatıldı (original mode kullanıldı)");
    }).catch((error) => {
      console.error("Mixed mode video initialization failed:", error);
    });
  } else {
    console.error("Neither video element nor placeholder found!");
  }
});

// Video'ya tıklandığında çağrılan fonksiyon
function initializeVideoOnClick(event) {
  event.preventDefault();
  event.stopPropagation();
  
  if (initialized) {
    // Video zaten yüklüyse, normal togglePlay fonksiyonunu çağır
    togglePlay(event);
    return;
  }
  
  const videoContainer = document.getElementById("video-container");
  const placeholder = document.getElementById("video-placeholder");
  
  if (!videoContainer || !placeholder) {
    console.error("Video container veya placeholder bulunamadı");
    return;
  }
  
  // Loading state'i göster
  videoContainer.classList.add('loading');
  
  // Placeholder'ı gizle
  placeholder.style.display = 'none';
  
  // Video elementini dinamik olarak oluştur ve DOM'a ekle
  createVideoElement()
    .then(() => {
      // Video element oluşturulduktan sonra Plyr'i başlat
      return initPlayer({
        applications: applications,
        topicListButtonClicked: topicListButtonClicked,
        pauseOnApplication: true,
        subject: subject,
        subTopic: subTopic,
      });
    })
    .then((player) => {
      var duration = player.duration;
      console.log("duration ", duration);

      var durationTime = durationToTime(duration);
      console.log("durationTime ", durationTime);
      
      initialized = true;
      
      // Loading state'i kaldır
      videoContainer.classList.remove('loading');
      
      // Video'yu otomatik olarak başlat
      setTimeout(() => {
        player.play();
      }, 500);
      
      console.log("Video başarıyla yüklendi ve oynatılmaya başlandı");
    })
    .catch((error) => {
      console.error("Video yükleme hatası:", error);
      
      // Hata durumunda placeholder'ı tekrar göster
      placeholder.style.display = 'block';
      videoContainer.classList.remove('loading');
      
      // Kullanıcıya hata mesajı göster
      alert("Video yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
    });
}

// Video elementini dinamik olarak oluşturan fonksiyon
function createVideoElement() {
  return new Promise((resolve, reject) => {
    try {
      const videoContainer = document.getElementById("video-container");
      
      // Video elementini oluştur
      const videoElement = document.createElement('video');
      videoElement.id = 'player';
      videoElement.crossOrigin = 'anonymous';
      videoElement.setAttribute('data-poster', 'plyr/View_From_A_Blue_Moon_Trailer-HD.jpg');
      videoElement.controls = true; // Fallback için
      
      // Video source'unu ekle
      const source = document.createElement('source');
      source.src = 'plyr/View_From_A_Blue_Moon_Trailer-1080p.mp4';
      source.type = 'video/mp4';
      videoElement.appendChild(source);
      
      // Türkçe altyazı track'i
      const trackTR = document.createElement('track');
      trackTR.kind = 'captions';
      trackTR.label = 'Türkçe';
      trackTR.srclang = 'tr';
      trackTR.src = 'plyr/sub.tr.vtt';
      trackTR.default = true;
      videoElement.appendChild(trackTR);
      
      // İngilizce altyazı track'i
      const trackEN = document.createElement('track');
      trackEN.kind = 'captions';
      trackEN.label = 'English';
      trackEN.srclang = 'en';
      trackEN.src = 'plyr/sub.en.vtt';
      videoElement.appendChild(trackEN);
      
      // Video elementini container'a ekle
      videoContainer.appendChild(videoElement);
      
      console.log("Video element DOM'a eklendi");
      resolve();
      
    } catch (error) {
      reject(error);
    }
  });
}

// Eski Intersection Observer kodunu kaldır - artık kullanmıyoruz
function setupDeferredVideoInitialization() {
  console.log("Click-to-load modunda çalışıyor - Intersection Observer devre dışı");
}

// Manuel başlatma fonksiyonu - click-to-load için güncelle
function manualInitPlayer() {
  if (!initialized) {
    console.log("Manuel video başlatma tetiklendi...");
    initializeVideoOnClick({ preventDefault: () => {}, stopPropagation: () => {} });
  } else {
    console.log("Video zaten başlatılmış");
  }
}

togglePlay = function (event) {
  // Videoya tıklanıldığında oynat/duraklat
  event.preventDefault();
  if(event.pointerType == "touch" || event.pointerType == "pen"){
    if (event.target.classList.contains("plyr__poster")) {
      if (player && player.playing) {
        if(areControlsVisible){
          player.pause();
        }else{
          showControls();
          hideControlsWithDelay();
        }
      } else if (player && !player.playing) {
        player.play();
      }
    }
  }else{
    if (event.target.classList.contains("plyr__poster")) {
      if (player && player.playing) {
        player.pause();
      } else if (player && !player.playing) {
        player.play();
      }
    }
  }
};

function durationToTime(seconds) {
  if (seconds < 3600) {
    return new Date(seconds * 1000).toISOString().substring(14, 19);
  } else {
    return new Date(seconds * 1000).toISOString().substring(11, 19);
  }
}

/* -------------------------------------------------------------------------- */
/*                                PLAYER İŞLEMLERİ                            */
/* -------------------------------------------------------------------------- */
function initPlayer(options) {
  return new Promise((resolve, reject) => {
    var applications = options.applications;
    var pauseOnApplication = options.pauseOnApplication;

    var points = [];
    applications.forEach(function (application) {
      points.push(application.marker);
    });

    if (isMouseConnected()) {
      hideControls = true;
    }else{
      hideControls = false;
    }

    var playerElement = document.getElementById("player");
    player = new Plyr(playerElement, {
      clickToPlay: false,
      invertTime: false,
      playsinline: true,
      hideControls: hideControls,
      controls: ['play-large', 'play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
      i18n: {
        restart: "Tekrar başlat",
        rewind: "{seektime}s geri",
        play: "Oynat",
        pause: "Duraklat",
        fastForward: "{seektime}s İleri",
        seek: "Git",
        seekLabel: "{currentTime}/{duration}",
        played: "Oynatılan",
        buffered: "Önbellek",
        currentTime: "Şimdiki zaman",
        duration: "Süre",
        volume: "Ses",
        mute: "Sessiz",
        unmute: "Ses aç",
        enableCaptions: "Altyazıları aç",
        disableCaptions: "Altyazıları kapat",
        download: "İndir",
        enterFullscreen: "Tam ekran",
        exitFullscreen: "Tam ekranı kapat",
        frameTitle: "Player for {title}",
        captions: "Altyazılar",
        settings: "Ayarlar",
        pip: "Resim içinde resim",
        menuBack: "Önceki menüye dön",
        speed: "Hız",
        normal: "Normal",
        quality: "Kalite",
        loop: "Döngü",
        start: "Başlangıç",
        end: "Son",
        all: "Tümü",
        reset: "Sıfırla",
        disabled: "Kapalı",
        enabled: "Açık",
      },
      markers: { enabled: true, points: points },
    });

    player.on("ready", (event) => {
      setTimeout(() => {
        resolve(player);
      }, 1000);
      if (!initialized) {
        initialized = true;

        const player = event.detail.plyr;
        var playerContainer = document.querySelector(".plyr");

        let subjectDiv = document.createElement("div");
        subjectDiv.classList.add("player_subject");
        subjectDiv.innerHTML = `<span>${options.subject}</span>`;

        let subTopicDiv = document.createElement("div");
        subTopicDiv.classList.add("player_sub_topic");
        subTopicDiv.innerHTML = `<span>${options.subTopic}</span>`;
        playerContainer.appendChild(subjectDiv);
        playerContainer.appendChild(subTopicDiv);

        var topMenuContainer = document.createElement("div");
        var topicListButton = document.createElement("div");
        topicListButton.innerHTML = `<button class="plyr__controls__item plyr__control" type="button" aria-pressed="false"><svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-280q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 320h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg><span class="plyr__sr-only">Konu listesi</span></button>`;
        topicListButton.addEventListener(
          "click",
          options.topicListButtonClicked
        );

        let fastForwardArea = document.createElement("div");
        let fastRewindArea = document.createElement("div");


        player.on("play", (event) => {
          if (!firstPlay) {
            firstPlay = true;
            subjectDiv.style.display = "none";
            subTopicDiv.style.display = "none";

            fastForwardArea.classList.add("fast-forward-area");
            fastForwardArea.innerHTML = `<button class="" type="button" aria-pressed="false"><svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#e8eaed"><path d="M360-320v-180h-60v-60h120v240h-60Zm140 0q-17 0-28.5-11.5T460-360v-160q0-17 11.5-28.5T500-560h80q17 0 28.5 11.5T620-520v160q0 17-11.5 28.5T580-320h-80Zm20-60h40v-120h-40v120ZM480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800h6l-62-62 56-58 160 160-160 160-56-58 62-62h-6q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440h80q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/></svg><span class="plyr__sr-only">İleri Sar</span></button>`;
            fastForwardArea.addEventListener("click", fastForward);
            playerContainer.appendChild(fastForwardArea);

            fastRewindArea.classList.add("fast-rewind-area");
            fastRewindArea.innerHTML = `<button class="" type="button" aria-pressed="false"><svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#e8eaed"><path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80ZM360-320v-180h-60v-60h120v240h-60Zm140 0q-17 0-28.5-11.5T460-360v-160q0-17 11.5-28.5T500-560h80q17 0 28.5 11.5T620-520v160q0 17-11.5 28.5T580-320h-80Zm20-60h40v-120h-40v120Z"/></svg><span class="plyr__sr-only">Geri Sar</span></button>`;
            fastRewindArea.addEventListener("click", fastRewind);
            playerContainer.appendChild(fastRewindArea);
            
          }
          if(!hideControls){
            hideControlsWithDelay();
          }
        });

        player.on("pause", (event) => {
          if(!hideControls){
            this.showControls();
          }
        });

        if (pauseOnApplication) {
          player.on("timeupdate", (event) => {
            currentTime = parseInt(event.detail.plyr.currentTime);
            applications.forEach((application) => {
              if (!application.stoppedBefore && application.pauseOnTime) {
                if (currentTime == application.marker.time) {
                  application.stoppedBefore = true;
                  player.pause();
                  application.actionFx(application.marker);
                }
              }
            });
          });
        }

        let width = playerElement.offsetWidth;
        var playerMenu = document.querySelector(".plyr__menu__container");

        if (width < 500) {
          var volumeInput = document.querySelector('input[data-plyr="volume"]');
          volumeInput.style.display = "none";

          var durationElement = document.querySelector(".plyr__time--duration");
          durationElement.style.display = "none";

          var captionButton = document.querySelector(
            'button[data-plyr="captions"]'
          );
          captionButton.style.display = "none";

          var fullscreenButton = document.querySelector(
            'button[data-plyr="fullscreen"]'
          );
          fullscreenButton && fullscreenButton.classList.add("floating-button-0");
          var settingsButton = document.querySelector(".plyr__menu");
          settingsButton && settingsButton.classList.add("floating-button-1");
          var pipButton = document.querySelector('button[data-plyr="pip"]');
          pipButton && pipButton.classList.add("floating-button-2");

          topMenuContainer.classList.add("top-menu-container");
          // add fullscreen button to the top menu
          fullscreenButton && topMenuContainer.appendChild(fullscreenButton);
          // add settings button to the top menu
          settingsButton && topMenuContainer.appendChild(settingsButton);
          // add pip button to the top menu
          pipButton && topMenuContainer.appendChild(pipButton);
          topicListButton && topicListButton.classList.add("topic-list-button");
          topicListButton && topMenuContainer.appendChild(topicListButton);

          // if player container doesnt contain top menu container, add it
          if (!playerContainer.contains(topMenuContainer)) {
            console.log("topMenuContainer added");
            topMenuContainer && playerContainer.appendChild(topMenuContainer);
          }

          playerMenu && playerMenu.classList.add("top-menu");

          
        } else {
          // add the topic list button to the player before captionButton
          var captionButton = document.querySelector(
            'button[data-plyr="captions"]'
          );
          topicListButton && topicListButton.classList.add("plyr__controls__item");
          topicListButton && captionButton.parentNode.insertBefore(topicListButton, captionButton);
        }

        // add caption settings to the player settings menu
        if(player.currentTrack !== -1){
          addCaptionSettings();
        }
        
        player.on("controlshidden", (event) => {
          areControlsVisible = false;
          if (topMenuContainer) {
            topMenuContainer.classList.add("hidden");
          }
          if (fastForwardArea) {
            fastForwardArea.classList.add("hidden");
          }
          if(fastRewindArea){
            fastRewindArea.classList.add("hidden");
          }
        });

        player.on("controlsshown", (event) => {
          console.log("controlsshown ");
          areControlsVisible = true;
          if (topMenuContainer) {
            topMenuContainer.classList.remove("hidden");
          }

          if (fastForwardArea) {
            fastForwardArea.classList.remove("hidden");
          }

          if(fastRewindArea){
            fastRewindArea.classList.remove("hidden");
          }
        });

        player.on("enterfullscreen", (event) => {

          if(player.currentTrack !== -1){
            captionSize = captionSizesFullscreen.find((size)=>{ return size.percentage === captionSize.percentage});
            setCaptionSize(captionSize);
          }
        });

        player.on("exitfullscreen", (event) => {
          if(player.currentTrack !== -1){
            captionSize = captionSizes.find((size)=>{ return size.percentage === captionSize.percentage});
            setCaptionSize(captionSize);
          }
        });

        player.on("languagechange", (event) => {
          console.log("languagechange ");
          setTimeout(() => {
            addCaptionSettings();
          }, 100);
        });

        player.on("captionsenabled", (event) => {
          console.log("captionsenabled ");
          setTimeout(() => {
            addCaptionSettings();
          }, 100);
        });

        player.on("captionsdisabled", (event) => {
          console.log("captionsdisabled ");
          setTimeout(() => {
            removeCaptionSettings();
          }, 100);
        });
      }
    });
  });
}

removeCaptionSettings = function(){
  let playerMenu = document.querySelector(".plyr__menu__container");
  if(!playerMenu){
    return;
  }
  let menuId = playerMenu.getAttribute("id");
  let captionSettingsButton = document.getElementById(menuId + "-caption-settings-button");
  if(captionSettingsButton){
    captionSettingsButton.remove();
  }
}

function addCaptionSettings(){

  var playerMenu = document.querySelector(".plyr__menu__container");
  if(!playerMenu){
    return;
  }
  let menuId = playerMenu.getAttribute("id");
  let captionsMenu = document.getElementById(menuId + "-captions");
  let parentMenu = captionsMenu.parentNode;

  let existingCaptionSettingsButton = document.getElementById(menuId + "-caption-settings-button");
  if(existingCaptionSettingsButton){
    return;
  }

  // get div with role="menu"
  let menuDiv = captionsMenu.querySelector('[role="menu"]');
  // prepend a new button to the menu <button data-plyr="caption-settings" type="button" class="plyr__control plyr__control--forward" role="menuitem" aria-haspopup="true"><span>Seçenekler</span></button>
  let captionSettingsButton = document.createElement("button");
  captionSettingsButton.setAttribute("data-plyr", "caption-settings");
  captionSettingsButton.setAttribute("type", "button");
  captionSettingsButton.classList.add("plyr__control");
  captionSettingsButton.classList.add("plyr__control--forward");
  captionSettingsButton.setAttribute("role", "menuitem");
  captionSettingsButton.setAttribute("aria-haspopup", "true");
  captionSettingsButton.setAttribute("id", menuId + "-caption-settings-button");
  captionSettingsButton.innerHTML = "<span>Seçenekler</span>";
  captionSettingsButton.addEventListener("click", function (event) {

    // add hidden attribute to the children of the parent menu
    let children = parentMenu.children;
    for (let i = 0; i < children.length; i++) {
      children[i].setAttribute("hidden", "");
    }
    // remove hidden attribute from the caption settings menu
    let captionSettingsMenu = document.getElementById(menuId + "-caption-settings");
    captionSettingsMenu.removeAttribute("hidden");

  });
  menuDiv.prepend(captionSettingsButton);

  // add another menu to the parent of captionsMenu
  let captionSettingsMenu = document.createElement("div");
  captionSettingsMenu.setAttribute("id", menuId + "-caption-settings");
  captionSettingsMenu.setAttribute("hidden", "");
  //captionSettingsMenu.innerHTML = `<button type="button" class="plyr__control plyr__control--back"><span aria-hidden="true">Seçenekler</span><span class="plyr__sr-only">Önceki menüye dön</span></button><div role="menu"></div>`;
  let backMenuButton1 = document.createElement("button");
  backMenuButton1.setAttribute("type", "button");
  backMenuButton1.classList.add("plyr__control");
  backMenuButton1.classList.add("plyr__control--back");
  backMenuButton1.innerHTML = `<span aria-hidden="true">Seçenekler</span><span class="plyr__sr-only">Önceki menüye dön</span>`;
  backMenuButton1.addEventListener("click", (event)=>{
    captionSettingsMenu.setAttribute("hidden", "");

    // remove hidden attribute from the captions menu
    let captionsMenu = document.getElementById(menuId + "-captions");
    captionsMenu.removeAttribute("hidden");
  });
  captionSettingsMenu.appendChild(backMenuButton1);

  let captionSettingsMenuDiv = document.createElement("div");
  captionSettingsMenuDiv.setAttribute("role", "menu");
  //captionSettingsMenuDiv.innerHTML = `<button data-plyr="settings" type="button" class="plyr__control plyr__control--forward" role="menuitem" aria-haspopup="true"><span>Altyazılar<span class="plyr__menu__value">Türkçe</span></span></button><button data-plyr="settings" type="button" class="plyr__control plyr__control--forward" role="menuitem" aria-haspopup="true" hidden=""><span>Kalite<span class="plyr__menu__value">undefined</span></span></button><button data-plyr="settings" type="button" class="plyr__control plyr__control--forward" role="menuitem" aria-haspopup="true"><span>Hız<span class="plyr__menu__value">0.75×</span></span></button>`;
  let captionSettingsButton1 = document.createElement("button");
  captionSettingsButton1.setAttribute("data-plyr", "settings");
  captionSettingsButton1.setAttribute("type", "button");
  captionSettingsButton1.classList.add("plyr__control");
  captionSettingsButton1.classList.add("plyr__control--forward");
  captionSettingsButton1.setAttribute("role", "menuitem");  
  captionSettingsButton1.innerHTML = `<span>Yazı boyutu<span id="selected-caption-size" class="plyr__menu__value">%${captionSize.percentage}</span></span>`;
  captionSettingsButton1.addEventListener("click", (event)=>{
    let children = parentMenu.children;
    for (let i = 0; i < children.length; i++) {
      children[i].setAttribute("hidden", "");
    }
    // remove hidden attribute from the caption settings menu
    let captionSettingsMenu = document.getElementById(menuId + "-caption-size");
    captionSettingsMenu.removeAttribute("hidden");
  });
  captionSettingsMenuDiv.appendChild(captionSettingsButton1);

  let captionSettingsButton2 = document.createElement("button");
  captionSettingsButton2.setAttribute("data-plyr", "settings");
  captionSettingsButton2.setAttribute("type", "button");
  captionSettingsButton2.classList.add("plyr__control");
  captionSettingsButton2.classList.add("plyr__control--forward");
  captionSettingsButton2.setAttribute("role", "menuitem");
  captionSettingsButton2.innerHTML = `<span>Yazı rengi<span id="selected-caption-text-color" class="plyr__menu__value">${captionTextColor.colorText}</span></span>`;
  captionSettingsButton2.addEventListener("click", (event)=>{
    let children = parentMenu.children;
    for (let i = 0; i < children.length; i++) {
      children[i].setAttribute("hidden", "");
    }
    // remove hidden attribute from the caption settings menu
    let captionSettingsMenu = document.getElementById(menuId + "-caption-text-color");
    captionSettingsMenu.removeAttribute("hidden");
  });
  captionSettingsMenuDiv.appendChild(captionSettingsButton2);

  let captionSettingsButton3 = document.createElement("button");
  captionSettingsButton3.setAttribute("data-plyr", "settings");
  captionSettingsButton3.setAttribute("type", "button");
  captionSettingsButton3.classList.add("plyr__control");
  captionSettingsButton3.classList.add("plyr__control--forward");
  captionSettingsButton3.setAttribute("role", "menuitem");
  captionSettingsButton3.innerHTML = `<span>Arkaplan rengi<span class="plyr__menu__value">${captionBackgroundColor.colorText}</span></span>`;
  captionSettingsButton3.addEventListener("click", (event)=>{
    let children = parentMenu.children;
    for (let i = 0; i < children.length; i++) {
      children[i].setAttribute("hidden", "");
    }
    // remove hidden attribute from the caption settings menu
    let captionSettingsMenu = document.getElementById(menuId + "-caption-background-color");
    captionSettingsMenu.removeAttribute("hidden");
  });
  captionSettingsMenuDiv.appendChild(captionSettingsButton3);

  captionSettingsMenu.appendChild(captionSettingsMenuDiv);


  parentMenu.appendChild(captionSettingsMenu);



  let captionSizeMenu = document.createElement("div");
  captionSizeMenu.setAttribute("id", menuId + "-caption-size");
  captionSizeMenu.setAttribute("hidden", "");
  let backMenuButton2 = document.createElement("button");
  backMenuButton2.setAttribute("type", "button");
  backMenuButton2.classList.add("plyr__control");
  backMenuButton2.classList.add("plyr__control--back");
  backMenuButton2.innerHTML = `<span aria-hidden="true">Yazı boyutu</span><span class="plyr__sr-only">Önceki menüye dön</span>`;
  backMenuButton2.addEventListener("click", (event)=>{
    captionSizeMenu.setAttribute("hidden", "");

    // remove hidden attribute from the captions menu
    let captionsMenu = document.getElementById(menuId + "-caption-settings");
    captionsMenu.removeAttribute("hidden");
  });

  captionSizeMenu.appendChild(backMenuButton2);

  let captionSizeMenuDiv = document.createElement("div");
  captionSizeMenuDiv.setAttribute("role", "menu");

  let sizes = player.isFullscreen ? captionSizesFullscreen : captionSizes;

  sizes.forEach((size)=>{
    let captionSizeButton = document.createElement("button");
    captionSizeButton.setAttribute("type", "button");
    captionSizeButton.classList.add("plyr__control", "caption_size_radio");
    captionSizeButton.setAttribute("role", "menuitemradio");
    captionSizeButton.setAttribute("aria-checked", captionSize.percentage === size.percentage ? "true" : "false");
    captionSizeButton.setAttribute("value", size.percentage);
    captionSizeButton.innerHTML = `<span>%${size.percentage}</span>`;
    captionSizeButton.addEventListener("click", (event)=>{
      setCaptionSize(size, true);
    });
    captionSizeMenuDiv.appendChild(captionSizeButton);
  });

  captionSizeMenu.appendChild(captionSizeMenuDiv);
  parentMenu.appendChild(captionSizeMenu);



  let captionTextColorMenu = document.createElement("div");
  captionTextColorMenu.setAttribute("id", menuId + "-caption-text-color");
  captionTextColorMenu.setAttribute("hidden", "");
  let backMenuButton3 = document.createElement("button");
  backMenuButton3.setAttribute("type", "button");
  backMenuButton3.classList.add("plyr__control");
  backMenuButton3.classList.add("plyr__control--back");
  backMenuButton3.innerHTML = `<span aria-hidden="true">Yazı rengi</span><span class="plyr__sr-only">Önceki menüye dön</span>`;
  backMenuButton3.addEventListener("click", (event)=>{
    captionTextColorMenu.setAttribute("hidden", "");

    // remove hidden attribute from the captions menu
    let captionsMenu = document.getElementById(menuId + "-caption-settings");
    captionsMenu.removeAttribute("hidden");
  });

  captionTextColorMenu.appendChild(backMenuButton3);

  let captionTextColorMenuDiv = document.createElement("div");
  captionTextColorMenuDiv.setAttribute("role", "menu");

  captionColors.forEach((color)=>{
    let captionTextColorButton = document.createElement("button");
    captionTextColorButton.setAttribute("type", "button");
    captionTextColorButton.classList.add("plyr__control", "caption_text_color_radio");
    captionTextColorButton.setAttribute("role", "menuitemradio");
    captionTextColorButton.setAttribute("aria-checked", captionTextColor.hex === color.hex ? "true" : "false");
    captionTextColorButton.setAttribute("value", color.hex);
    captionTextColorButton.innerHTML = `<span>${color.colorText}</span>`;
    captionTextColorButton.addEventListener("click", (event)=>{
      setCaptionTextColor(color, true);
    });
    captionTextColorMenuDiv.appendChild(captionTextColorButton);
  });

  captionTextColorMenu.appendChild(captionTextColorMenuDiv);

  parentMenu.appendChild(captionTextColorMenu);

  let captionBackgroundColorMenu = document.createElement("div");
  captionBackgroundColorMenu.setAttribute("id", menuId + "-caption-background-color");
  captionBackgroundColorMenu.setAttribute("hidden", "");
  let backMenuButton4 = document.createElement("button");
  backMenuButton4.setAttribute("type", "button");
  backMenuButton4.classList.add("plyr__control");
  backMenuButton4.classList.add("plyr__control--back");
  backMenuButton4.innerHTML = `<span aria-hidden="true">Arkaplan rengi</span><span class="plyr__sr-only">Önceki menüye dön</span>`;
  backMenuButton4.addEventListener("click", (event)=>{
    captionBackgroundColorMenu.setAttribute("hidden", "");

    // remove hidden attribute from the captions menu
    let captionsMenu = document.getElementById(menuId + "-caption-settings");
    captionsMenu.removeAttribute("hidden");
  });

  captionBackgroundColorMenu.appendChild(backMenuButton4);

  let captionBackgroundColorMenuDiv = document.createElement("div");
  captionBackgroundColorMenuDiv.setAttribute("role", "menu");

  captionColors.forEach((color)=>{
    let captionBackgroundColorButton = document.createElement("button");
    captionBackgroundColorButton.setAttribute("type", "button");
    captionBackgroundColorButton.classList.add("plyr__control", "caption_background_color_radio");
    captionBackgroundColorButton.setAttribute("role", "menuitemradio");
    captionBackgroundColorButton.setAttribute("aria-checked", captionBackgroundColor.hex === color.hex ? "true" : "false");
    captionBackgroundColorButton.setAttribute("value", color.hex);
    captionBackgroundColorButton.innerHTML = `<span>${color.colorText}</span>`;
    captionBackgroundColorButton.addEventListener("click", (event)=>{
      setCaptionBackgroundColor(color, true);
    });
    captionBackgroundColorMenuDiv.appendChild(captionBackgroundColorButton);
  });

  captionBackgroundColorMenu.appendChild(captionBackgroundColorMenuDiv);

  parentMenu.appendChild(captionBackgroundColorMenu);


  setCaptionSize(captionSize);
  setCaptionTextColor(captionTextColor);
  setCaptionBackgroundColor(captionBackgroundColor);

}

function setCaptionSize(val, showPlaceholderCaption = false){

  captionSize = val;

  let captionDiv = document.querySelector(".plyr__captions");
  captionDiv.style.fontSize = captionSize.fontSize;

  // get all buttons with class caption_size_radio and make aria-checked false for all except the clicked one
  let captionSizeButtons = document.querySelectorAll(".caption_size_radio");
  captionSizeButtons.forEach((button)=>{
    button.setAttribute("aria-checked", "false");
  });

  let clickedButton = document.querySelector(`.caption_size_radio[value="${captionSize.percentage}"]`);
  clickedButton.setAttribute("aria-checked", "true");

  let selectedCaptionSize = document.getElementById("selected-caption-size");
  selectedCaptionSize.innerHTML = `%${captionSize.percentage}`;

  // save the caption size to the local storage
  localStorage.setItem("captionSize", JSON.stringify(captionSize));

  showPlaceholderCaption && addPlaceholderCaption();

}

function setCaptionTextColor(color, showPlaceholderCaption = false){
  captionTextColor = color;

  let captionDiv = document.querySelector(".plyr__captions");
  captionDiv.style.color = captionTextColor.hex;

  // make all children of the captionDiv have the same color
  let children = captionDiv.children;
  for(let i = 0; i < children.length; i++){
    children[i].style.color = captionTextColor.hex;
  }

  // get all buttons with class caption_text_color_radio and make aria-checked false for all except the clicked one
  let captionTextColorButtons = document.querySelectorAll(".caption_text_color_radio");
  captionTextColorButtons.forEach((button)=>{
    button.setAttribute("aria-checked", "false");
  });

  let clickedButton = document.querySelector(`.caption_text_color_radio[value="${captionTextColor.hex}"]`);
  clickedButton.setAttribute("aria-checked", "true");

  let selectedCaptionTextColor = document.getElementById("selected-caption-text-color");
  selectedCaptionTextColor.innerHTML = captionTextColor.colorText;

  // save the caption text color to the local storage
  localStorage.setItem("captionTextColor", JSON.stringify(captionTextColor));

  showPlaceholderCaption && addPlaceholderCaption();


}

function setCaptionBackgroundColor(color, showPlaceholderCaption = false){
  captionBackgroundColor = color;
  document.head.insertAdjacentHTML("beforeend", `<style>.player-captions .player-caption{background-color:` + captionBackgroundColor.hex + `;}</style>`);

  // change the .plyr__caption css rules background-color property, i mean the css itself
  let styleSheets = Object.values(document.styleSheets);

  let plyrStyleSheet = styleSheets.find((styleSheet)=>{ return styleSheet.href && styleSheet.href.includes("custom.css")});
  let cssRules = plyrStyleSheet.cssRules;
  let plyr__captionRule = Array.from(cssRules).find((rule)=>{ return rule.selectorText === ".plyr__caption"});
  if(plyr__captionRule){
    plyr__captionRule.style.backgroundColor = captionBackgroundColor.hex;
  }



  // get all buttons with class caption_background_color_radio and make aria-checked false for all except the clicked one
  let captionBackgroundColorButtons = document.querySelectorAll(".caption_background_color_radio");
  captionBackgroundColorButtons.forEach((button)=>{
    button.setAttribute("aria-checked", "false");
  });

  let clickedButton = document.querySelector(`.caption_background_color_radio[value="${captionBackgroundColor.hex}"]`);
  clickedButton.setAttribute("aria-checked", "true");

  // save the caption background color to the local storage
  localStorage.setItem("captionBackgroundColor", JSON.stringify(captionBackgroundColor));

  
  showPlaceholderCaption && addPlaceholderCaption();


}

function loadLocalStorageSettings(){
  let size = localStorage.getItem("captionSize");
  if(size){
    captionSize = JSON.parse(size);
  }

  let color = localStorage.getItem("captionTextColor");
  if(color){
    captionTextColor = JSON.parse(color);
  }

  let backgroundColor = localStorage.getItem("captionBackgroundColor");
  if(backgroundColor){
    captionBackgroundColor = JSON.parse(backgroundColor);
  }
}

function addPlaceholderCaption(){

  let dummyCaption = document.getElementById("dummy-caption");
  if(dummyCaption){
    return;
  }

  let isMenuOpen = player.elements.container.classList.contains("plyr--menu-open");
  if(!isMenuOpen){

    if(dummyCaption){
      dummyCaption.remove();
    }

    return;

  }

  let captionDiv = document.querySelector(".plyr__captions");
  // if there is any .plyr__caption element which is not empty, return
  let captions = captionDiv.querySelectorAll(".plyr__caption");
  for(let i = 0; i < captions.length; i++){
    if(captions[i].innerHTML.trim() !== ""){
      return;
    }
  }


  let placeholderCaption = document.createElement("span");
  placeholderCaption.classList.add("plyr__caption");
  placeholderCaption.setAttribute("id", "dummy-caption");
  placeholderCaption.innerHTML = "Altyazı böyle görünecek";
  captionDiv.appendChild(placeholderCaption);



  hidePlaceholderCaptionTimeout = setTimeout(()=>{
    clearTimeout(hidePlaceholderCaptionTimeout);
    // delete dummy caption from the dom
    let dummyCaption = document.getElementById("dummy-caption");
    if(dummyCaption){
      dummyCaption.remove();
    }
  }, 5000);


}

function fastForward(){
  player.currentTime += 10;
  hideControlsWithDelay();
}

function fastRewind(){
  player.currentTime -= 10;
  hideControlsWithDelay();
}

function hideControlsWithDelay(){

  if(player && player.playing){
    clearInterval(controlTimeout);
    controlTimeout = setTimeout(() => {
      let isMenuOpen = player.elements.container.classList.contains("plyr--menu-open");
      if(isMenuOpen){
        hideControlsWithDelay();
        return;
      }    
      player.toggleControls(false);
    }, 3000);
  }
}



function hideControlsImmediately(){
  if(player && player.playing){
    clearInterval(controlTimeout);
    player.toggleControls(false);
  }
}

function showControls(){
  if(player){
    clearInterval(controlTimeout);
    player.toggleControls(true);
  }
}

function isMouseConnected() {
  return window.matchMedia("(pointer: fine)").matches;
}

document.addEventListener("keydown", function (event) {

  // DOĞRU MU? -> buraya eğer bir modal açıksa boş return döndüren if bloğu eklenecek
  if(document.querySelector(".modal") && document.querySelector(".modal").classList.contains("show")){
    return;
  }

  // if no input is focused
  if(document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA"){
    return;
  }

  if(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey){
    return;
  }
  
  if (event.key === " ") {
    player.togglePlay();
  }
  if (event.key === "ArrowRight") {
    fastForward();
  }
  if (event.key === "ArrowLeft") {
    fastRewind();
  }
  if(event.key === "ArrowUp"){
    player.volume += 0.1;
  }
  if(event.key === "ArrowDown"){
    player.volume -= 0.1;
  }

  // if full screen active and esc key pressed, exit full screen
  if(event.key === "Escape"){
    if(player.fullscreen.active){
      player.fullscreen.exit();
    }
  }

  if(event.key === "m"){
    player.muted = !player.muted;
  }
  if(event.key === "f"){
    player.fullscreen.toggle();
  }
});

/* -------------------------------------------------------------------------- */
/*                           PLAYER İŞLEMLERİ BİTTİ                           */
/* -------------------------------------------------------------------------- */
