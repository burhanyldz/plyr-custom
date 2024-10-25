var initialized = false;
var player;
var currentTime = 0;

    var subject = 'Konu Başlığı'; // konu başlığı
    var subTopic = 'Konu Açıklaması'; // konu açıklaması
    
    // videonun içerisinde bulunan uygulamalar ve işlemler burada tanımlanır // İŞLEM YAPILACAK
    var applications = [
    {
            actionFx: function (marker) {
                console.log('video buraya ulaştı, eylemi yapabilirsin', marker); //İŞLEM YAPILACAK
                alert(marker.label);
            },
            pauseOnTime: true,
            marker: {
                time: 10, // saniye
                label: 'İşaretçi Başlığı 1',
            }
        },
        {
            actionFx: function (marker) {
                console.log('video buraya ulaştı, eylemi yapabilirsin', marker); //İŞLEM YAPILACAK
                alert(marker.label);
            },
            pauseOnTime: true,
            marker: {
                time: 28, // saniye
                label: 'İşaretçi Başlığı 2',
            }
        },

    ];

    var topicListButtonClicked = function () { // konu başlıklarını gösterme fonksiyonu
        player.pause();
        console.log('konu başlıkları gösterilecek');
        alert('konu başlıkları');
         // İŞLEM YAPILACAK
    }

    // sayfa yüklenir yüklenmez playerı başlat
    document.addEventListener('DOMContentLoaded', function () {

        initPlayer({
            applications: applications,
            topicListButtonClicked: topicListButtonClicked,
            pauseOnApplication: true, // uygulamaların zamanına gelindiğinde videoyu duraklat
            subject: subject,
            subTopic: subTopic
        }).then(player => {
            var duration = player.duration; // Duration almak için
            console.log("duration ", duration);
            
            var durationTime = durationToTime(duration);
            console.log("durationTime ", durationTime);
            
        });
    });




    togglePlay = function (event) { // Videoya tıklanıldığında oynat/duraklat
        event.preventDefault();
        if(event.target.classList.contains('plyr__poster')){
            if (player && player.playing) {
                player.pause();
            } else if(player && !player.playing) {
                player.play();
            }
        }
    }


    function durationToTime(seconds){
        if(seconds < 3600){
            return new Date(seconds * 1000).toISOString().substring(14, 19)
        }else{
            return new Date(seconds * 1000).toISOString().substring(11, 19)
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

            var playerElement = document.getElementById('player');
            player = new Plyr(playerElement, {
                clickToPlay: false,
                invertTime: false,
                playsinline: true,
                
                i18n: { restart: 'Tekrar başlat', rewind: '{seektime}s geri', play: 'Oynat', pause: 'Duraklat', fastForward: '{seektime}s İleri', seek: 'Git', seekLabel: '{currentTime}/{duration}', played: 'Oynatılan', buffered: 'Önbellek', currentTime: 'Şimdiki zaman', duration: 'Süre', volume: 'Ses', mute: 'Sessiz', unmute: 'Ses aç', enableCaptions: 'Altyazıları aç', disableCaptions: 'Altyazıları kapat', download: 'İndir', enterFullscreen: 'Tam ekran', exitFullscreen: 'Tam ekranı kapat', frameTitle: 'Player for {title}', captions: 'Altyazılar', settings: 'Ayarlar', pip: "Resim içinde resim", menuBack: 'Önceki menüye dön', speed: 'Hız', normal: 'Normal', quality: 'Kalite', loop: 'Döngü', start: 'Başlangıç', end: 'Son', all: 'Tümü', reset: 'Sıfırla', disabled: 'Kapalı', enabled: 'Açık', },
                markers: {enabled: true, points: points }
            });


            player.on('ready', event => {
                console.log("ready ");
                resolve(player);
                if (!initialized) {
                    initialized = true;

                

                    const player = event.detail.plyr;
                    var playerContainer = document.querySelector('.plyr');

                    let subjectDiv = document.createElement('div');
                    subjectDiv.classList.add('player_subject');
                    subjectDiv.innerHTML = `<span>${options.subject}</span>`;

                    let subTopicDiv = document.createElement('div');
                    subTopicDiv.classList.add('player_sub_topic');
                    subTopicDiv.innerHTML = `<span>${options.subTopic}</span>`;
                    playerContainer.appendChild(subjectDiv);
                    playerContainer.appendChild(subTopicDiv);

                    var topMenuContainer = document.createElement('div');
                    var topicListButton = document.createElement('div');
                    topicListButton.innerHTML = `<button class="plyr__controls__item plyr__control" type="button" aria-pressed="false"><svg height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed"><path d="M320-280q17 0 28.5-11.5T360-320q0-17-11.5-28.5T320-360q-17 0-28.5 11.5T280-320q0 17 11.5 28.5T320-280Zm0-160q17 0 28.5-11.5T360-480q0-17-11.5-28.5T320-520q-17 0-28.5 11.5T280-480q0 17 11.5 28.5T320-440Zm0-160q17 0 28.5-11.5T360-640q0-17-11.5-28.5T320-680q-17 0-28.5 11.5T280-640q0 17 11.5 28.5T320-600Zm120 320h240v-80H440v80Zm0-160h240v-80H440v80Zm0-160h240v-80H440v80ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z"/></svg><span class="plyr__sr-only">Resim içinde resim</span></button>`;
                    topicListButton.addEventListener('click', options.topicListButtonClicked);

                    // EĞER MOBİL İSE EKRAN KÜÇÜKSE
                    if (window.innerWidth < 768) {
                        var volumeInput = document.querySelector('input[data-plyr="volume"]');
                        volumeInput.style.display = 'none';
                        var captionButton = document.querySelector('button[data-plyr="captions"]');
                        captionButton.style.display = 'none';

                        var fullscreenButton = document.querySelector('button[data-plyr="fullscreen"]');
                        fullscreenButton.classList.add('floating-button-0');
                        var settingsButton = document.querySelector('.plyr__menu');
                        settingsButton.classList.add('floating-button-1');
                        var pipButton = document.querySelector('button[data-plyr="pip"]');
                        pipButton.classList.add('floating-button-2');

                        topMenuContainer.classList.add('top-menu-container');
                        // add fullscreen button to the top menu
                        topMenuContainer.appendChild(fullscreenButton);
                        // add settings button to the top menu
                        topMenuContainer.appendChild(settingsButton);
                        // add pip button to the top menu
                        topMenuContainer.appendChild(pipButton);
                        topicListButton.classList.add('topic-list-button');
                        topMenuContainer.appendChild(topicListButton);


                        // if player container doesnt contain top menu container, add it
                        if (!playerContainer.contains(topMenuContainer)) {
                            console.log('topMenuContainer added');
                            playerContainer.appendChild(topMenuContainer);
                        }

                        var playerMenu = document.querySelector('.plyr__menu__container');
                        playerMenu.classList.add('top-menu');

                        player.on('controlshidden', event => {
                            if (topMenuContainer) {
                                topMenuContainer.classList.add('hidden');
                            }
                        });

                        player.on('controlsshown', event => {
                            if (topMenuContainer) {
                                topMenuContainer.classList.remove('hidden');
                            }
                        });
                    }else{
                        // add the topic list button to the player before captionButton
                        var captionButton = document.querySelector('button[data-plyr="captions"]');
                        topicListButton.classList.add('plyr__controls__item');
                        captionButton.parentNode.insertBefore(topicListButton, captionButton);
                    }

                    player.on('play', event => {
                        subjectDiv.style.display = 'none';
                        subTopicDiv.style.display = 'none';
                    });
                    

                    if(pauseOnApplication){
    
                        player.on('timeupdate', event => {
                            currentTime = parseInt(event.detail.plyr.currentTime);
                            applications.forEach(application => {
                                if(!application.stoppedBefore && application.pauseOnTime){
                                    if(currentTime == application.marker.time){
                                        application.stoppedBefore = true;
                                        player.pause();
                                        application.actionFx(application.marker);
                                    }
                                }
                            });
                            
                        });
                    }
                    
                }

            });

        });

    }

    /* -------------------------------------------------------------------------- */
    /*                           PLAYER İŞLEMLERİ BİTTİ                           */
    /* -------------------------------------------------------------------------- */

