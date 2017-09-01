import 'gsap/src/uncompressed/TweenLite';
import 'gsap/src/uncompressed/TweenMax';
import 'gsap/src/uncompressed/TimelineLite';
import 'gsap/src/uncompressed/TimelineMax';

import Utils from './utils/utils';

export default function videoManager(videoKeys) {
    // Used for videos elements
    this.videos = {};

    this.muted = false;
    this.mutedEventDone = true;
    this.audioFadeInLength = 2; // Seconds.
    this.audioFadeOutLength = 1; // Seconds.

    /**
     * Adds a video to the DOM based on the videoKey key. And the element.
     *
     * @param key
     * @param element
     * @param loop
     */
    this.addVideoToDOM = (key, element, loop = false) => {
        if (typeof videoKeys[key] !== 'undefined') {
            if (typeof this.videos[key] === 'undefined') {
                let video = document.createElement('video');
                video.id = key;
                video.src = videoKeys[key].blob;
                this.muted ? video.volume = 0 : video.volume = 1;
                video.setAttribute('playsinline', '');
                loop ? video.setAttribute('loop', '') : false;

                element.appendChild(video);

                this.videos[key] = video;
            } else {
                console.warn("[VideoManager] This video is already loaded in the DOM!!");
            }
        } else {
            console.warn("[VideoManager] Video with provided key not found!!");
        }
    };

    /**
     * Removed the video from the DOM and destroy's the object
     *
     * @param key
     */
    this.unloadVideo = (key) => {
        if (typeof this.videos[key] !== 'undefined') {
            if (document.querySelector("#" + key) != null) {
                Utils.removeElement(document.querySelector("#" + key));
            }
            delete this.videos[key];
        } else {
            console.warn("[VideoManager] This video isn't in the DOM!!");
        }
    };

    /**
     * Plays a video based on the key. Video needs to be loaded first
     *
     * @see this.addVideoToDOM
     * @param key
     * @param playOnMobile
     */
    this.play = (key, playOnMobile = false) => {
        if (typeof this.videos[key] !== 'undefined') {
            if (isMobile.any()) {
                if (playOnMobile) {
                    this.videos[key].play();
                }
            } else {
                this.videos[key].play();
            }
        } else {
            console.warn("[VideoManager] This video isn't in the DOM!!");
        }
    };

    /**
     * Pauses a video based on the key. Video needs to be loaded first
     *
     * @see this.addVideoToDOM
     * @param key
     */
    this.pause = (key) => {
        if (typeof this.videos[key] !== 'undefined') {
            this.videos[key].pause();
        } else {
            console.warn("[VideoManager] This video isn't in the DOM!!");
        }
    };

    /**
     * (Un)mutes a video based on the key. Video needs to be loaded first
     *
     * @see this.addVideoToDOM
     * @param key
     */
    this.mute = (key) => {
        if (typeof this.videos[key] !== 'undefined') {
            if (this.videos[key].volume == 1) {
                TweenMax.to(this.videos[key], this.audioFadeOutLength, {
                    volume: 0
                });
            } else {
                TweenMax.to(this.videos[key], this.audioFadeInLength, {
                    volume: 1
                });
            }
        } else {
            console.warn("[VideoManager] This video isn't in the DOM!!");
        }
    };

    /**
     * (Un)mutes all the videos. Videos needs to be loaded first. This also mutes future added videos.
     *
     * @see this.addVideoToDOM
     */
    this.muteAll = () => {
        if (this.mutedEventDone) {
            this.mutedEventDone = false;
            if (Object.keys(this.videos).length === 0 && this.videos.constructor === Object) {
                console.warn("[VideoManager] There are no video's loaded in the DOM!!");
            } else {
                let items = 0;
                Object.keys(this.videos).forEach(function (key) {
                    items++;

                    if (this.videos[key].volume == 1) {
                        TweenMax.to(this.videos[key], this.audioFadeOutLength, {
                            volume: 0,
                            onComplete: function () {
                                if (items == Object.keys(this.videos).length) {
                                    this.mutedEventDone = true;
                                }
                            }.bind(this)
                        });
                    } else {
                        TweenMax.to(this.videos[key], this.audioFadeInLength, {
                            volume: 1,
                            onComplete: function () {
                                if (items == Object.keys(this.videos).length) {
                                    this.mutedEventDone = true;
                                }
                            }.bind(this)
                        });
                    }
                }.bind(this));
            }

            this.muted ? this.muted = false : this.muted = true;
        }
    };

    /**
     * Binds the completed event to the specified video. Video needs to be loaded first.
     *
     * @see this.addVideoToDOM
     * @param key
     * @param func
     */
    this.bindCompletedEvent = (key, func) => {
        if (typeof this.videos[key] !== 'undefined') {
            this.videos[key].addEventListener('ended', function () {
                if (typeof this.videos[key] !== 'undefined') {
                    func();
                }
            }.bind(this), false);
        } else {
            console.warn("[VideoManager] This video isn't in the DOM!!");
        }
    };

    /**
     * Binds the timeupdate event to the specified video. Video needs to be loaded first.
     *
     * @see this.addVideoToDOM
     * @param key
     * @param func
     * @return currentTime
     * @return duration
     */
    this.bindTimeUpdateEvent = (key, func) => {
        if (typeof this.videos[key] !== 'undefined') {
            this.videos[key].addEventListener('timeupdate', function () {
                if (typeof this.videos[key] !== 'undefined') {
                    func(this.videos[key].currentTime, this.videos[key].duration);
                }
            }.bind(this), false);
        } else {
            console.warn("[VideoManager] This video isn't in the DOM!!");
        }
    };

    /**
     * Creates a trigger when a video progress passes a certain percentage
     *
     * @see this.addVideoToDOM
     * @param key
     * @param percentage
     * @param func
     */
    this.triggerVideoPercentage = (key, percentage, func) => {
        if (typeof this.videos[key] !== 'undefined') {
            let trigger = false;

            this.videos[key].addEventListener('timeupdate', function () {
                if (typeof this.videos[key] !== 'undefined') {
                    let videoPercentage = ((this.videos[key].currentTime / this.videos[key].duration) * 100);
                    if (videoPercentage >= percentage) {
                        if (!trigger) {
                            func();
                            trigger = true;
                        }
                    }
                }
            }.bind(this), false);
        } else {
            console.warn("[VideoManager] This video isn't in the DOM!!");
        }
    };

    /**
     * Creates a trigger when a video progress passes a certain time
     *
     * @param key
     * @param time
     * @param func
     */
    this.triggerVideoTime = (key, time, func) => {
        if (typeof this.videos[key] !== 'undefined') {
            let trigger = false;

            this.videos[key].addEventListener('timeupdate', function () {
                if (typeof this.videos[key] !== 'undefined') {
                    if (this.videos[key].currentTime >= time) {
                        if (!trigger) {
                            func();
                            trigger = true;
                        }
                    }
                }
            }.bind(this), false);
        } else {
            console.warn("[VideoManager] This video isn't in the DOM!!");
        }
    };

    /**
     * UTIL
     *
     * Mobile tester
     * Checks on all mobile platforms or checks one platform
     */
    const isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
}
