var initialized = false;
var firstPlay = false;
var player;
var currentTime = 0;

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
      time: 50, // saniye
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
      time: 68, // saniye
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

// sayfa yüklenir yüklenmez playerı başlat
document.addEventListener("DOMContentLoaded", function () {
  initPlayer({
    applications: applications,
    topicListButtonClicked: topicListButtonClicked,
    pauseOnApplication: true, // uygulamaların zamanına gelindiğinde videoyu duraklat
    subject: subject,
    subTopic: subTopic,
  }).then((player) => {
    var duration = player.duration; // Duration almak için
    console.log("duration ", duration);

    var durationTime = durationToTime(duration);
    console.log("durationTime ", durationTime);
  });
});

togglePlay = function (event) {
  // Videoya tıklanıldığında oynat/duraklat
  event.preventDefault();
  if (event.target.classList.contains("plyr__poster")) {
    if (player && player.playing) {
      player.pause();
    } else if (player && !player.playing) {
      player.play();
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

    var playerElement = document.getElementById("player");
    player = new Plyr(playerElement, {
      clickToPlay: false,
      invertTime: false,
      playsinline: true,

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

        let videoContainer = document.getElementById("video-container");
        let width = videoContainer.offsetWidth;
        let fastForwardArea = document.createElement("div");
        let fastRewindArea = document.createElement("div");


        player.on("play", (event) => {
          if (!firstPlay) {
            firstPlay = true;
            subjectDiv.style.display = "none";
            subTopicDiv.style.display = "none";

            fastForwardArea.classList.add("fast-forward-area");
            fastForwardArea.innerHTML = `<button class="" type="button" aria-pressed="false"><svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#e8eaed"><path d="M360-320v-180h-60v-60h120v240h-60Zm140 0q-17 0-28.5-11.5T460-360v-160q0-17 11.5-28.5T500-560h80q17 0 28.5 11.5T620-520v160q0 17-11.5 28.5T580-320h-80Zm20-60h40v-120h-40v120ZM480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-800h6l-62-62 56-58 160 160-160 160-56-58 62-62h-6q-117 0-198.5 81.5T200-440q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440h80q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80Z"/></svg><span class="plyr__sr-only">İleri Sar</span></button>`;
            fastForwardArea.addEventListener("click", (event) => {
              player.currentTime += 10;
            });
            playerContainer.appendChild(fastForwardArea);

            fastRewindArea.classList.add("fast-rewind-area");
            fastRewindArea.innerHTML = `<button class="" type="button" aria-pressed="false"><svg xmlns="http://www.w3.org/2000/svg" height="34px" viewBox="0 -960 960 960" width="34px" fill="#e8eaed"><path d="M480-80q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-440h80q0 117 81.5 198.5T480-160q117 0 198.5-81.5T760-440q0-117-81.5-198.5T480-720h-6l62 62-56 58-160-160 160-160 56 58-62 62h6q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-440q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-80ZM360-320v-180h-60v-60h120v240h-60Zm140 0q-17 0-28.5-11.5T460-360v-160q0-17 11.5-28.5T500-560h80q17 0 28.5 11.5T620-520v160q0 17-11.5 28.5T580-320h-80Zm20-60h40v-120h-40v120Z"/></svg><span class="plyr__sr-only">Geri Sar</span></button>`;
            fastRewindArea.addEventListener("click", (event) => {
              player.currentTime -= 10;
            });
            playerContainer.appendChild(fastRewindArea);
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

        if (width < 768) {
          var volumeInput = document.querySelector('input[data-plyr="volume"]');
          volumeInput.style.display = "none";
          var captionButton = document.querySelector(
            'button[data-plyr="captions"]'
          );
          captionButton.style.display = "none";

          var fullscreenButton = document.querySelector(
            'button[data-plyr="fullscreen"]'
          );
          fullscreenButton.classList.add("floating-button-0");
          var settingsButton = document.querySelector(".plyr__menu");
          settingsButton.classList.add("floating-button-1");
          var pipButton = document.querySelector('button[data-plyr="pip"]');
          pipButton.classList.add("floating-button-2");

          topMenuContainer.classList.add("top-menu-container");
          // add fullscreen button to the top menu
          topMenuContainer.appendChild(fullscreenButton);
          // add settings button to the top menu
          topMenuContainer.appendChild(settingsButton);
          // add pip button to the top menu
          topMenuContainer.appendChild(pipButton);
          topicListButton.classList.add("topic-list-button");
          topMenuContainer.appendChild(topicListButton);

          // if player container doesnt contain top menu container, add it
          if (!playerContainer.contains(topMenuContainer)) {
            console.log("topMenuContainer added");
            playerContainer.appendChild(topMenuContainer);
          }

          var playerMenu = document.querySelector(".plyr__menu__container");
          playerMenu.classList.add("top-menu");

          
        } else {
          // add the topic list button to the player before captionButton
          var captionButton = document.querySelector(
            'button[data-plyr="captions"]'
          );
          topicListButton.classList.add("plyr__controls__item");
          captionButton.parentNode.insertBefore(topicListButton, captionButton);
        }

        player.on("controlshidden", (event) => {
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

        
      }
    });
  });
}

/* -------------------------------------------------------------------------- */
/*                           PLAYER İŞLEMLERİ BİTTİ                           */
/* -------------------------------------------------------------------------- */
