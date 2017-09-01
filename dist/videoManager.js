'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = videoManager;

require('gsap/src/uncompressed/TweenLite');

require('gsap/src/uncompressed/TweenMax');

require('gsap/src/uncompressed/TimelineLite');

require('gsap/src/uncompressed/TimelineMax');

var _utils = require('./utils/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function videoManager(videoKeys) {
    var _this = this;

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
    this.addVideoToDOM = function (key, element) {
        var loop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (typeof videoKeys[key] !== 'undefined') {
            if (typeof _this.videos[key] === 'undefined') {
                var video = document.createElement('video');
                video.id = key;
                video.src = videoKeys[key].blob;
                _this.muted ? video.volume = 0 : video.volume = 1;
                video.setAttribute('playsinline', '');
                loop ? video.setAttribute('loop', '') : false;

                element.appendChild(video);

                _this.videos[key] = video;
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
    this.unloadVideo = function (key) {
        if (typeof _this.videos[key] !== 'undefined') {
            if (document.querySelector("#" + key) != null) {
                _utils2.default.removeElement(document.querySelector("#" + key));
            }
            delete _this.videos[key];
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
    this.play = function (key) {
        var playOnMobile = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (typeof _this.videos[key] !== 'undefined') {
            if (isMobile.any()) {
                if (playOnMobile) {
                    _this.videos[key].play();
                }
            } else {
                _this.videos[key].play();
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
    this.pause = function (key) {
        if (typeof _this.videos[key] !== 'undefined') {
            _this.videos[key].pause();
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
    this.mute = function (key) {
        if (typeof _this.videos[key] !== 'undefined') {
            if (_this.videos[key].volume == 1) {
                TweenMax.to(_this.videos[key], _this.audioFadeOutLength, {
                    volume: 0
                });
            } else {
                TweenMax.to(_this.videos[key], _this.audioFadeInLength, {
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
    this.muteAll = function () {
        if (_this.mutedEventDone) {
            _this.mutedEventDone = false;
            if (Object.keys(_this.videos).length === 0 && _this.videos.constructor === Object) {
                console.warn("[VideoManager] There are no video's loaded in the DOM!!");
            } else {
                var items = 0;
                Object.keys(_this.videos).forEach(function (key) {
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
                }.bind(_this));
            }

            _this.muted ? _this.muted = false : _this.muted = true;
        }
    };

    /**
     * Binds the completed event to the specified video. Video needs to be loaded first.
     *
     * @see this.addVideoToDOM
     * @param key
     * @param func
     */
    this.bindCompletedEvent = function (key, func) {
        if (typeof _this.videos[key] !== 'undefined') {
            _this.videos[key].addEventListener('ended', function () {
                if (typeof this.videos[key] !== 'undefined') {
                    func();
                }
            }.bind(_this), false);
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
    this.bindTimeUpdateEvent = function (key, func) {
        if (typeof _this.videos[key] !== 'undefined') {
            _this.videos[key].addEventListener('timeupdate', function () {
                if (typeof this.videos[key] !== 'undefined') {
                    func(this.videos[key].currentTime, this.videos[key].duration);
                }
            }.bind(_this), false);
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
    this.triggerVideoPercentage = function (key, percentage, func) {
        if (typeof _this.videos[key] !== 'undefined') {
            var trigger = false;

            _this.videos[key].addEventListener('timeupdate', function () {
                if (typeof this.videos[key] !== 'undefined') {
                    var videoPercentage = this.videos[key].currentTime / this.videos[key].duration * 100;
                    if (videoPercentage >= percentage) {
                        if (!trigger) {
                            func();
                            trigger = true;
                        }
                    }
                }
            }.bind(_this), false);
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
    this.triggerVideoTime = function (key, time, func) {
        if (typeof _this.videos[key] !== 'undefined') {
            var trigger = false;

            _this.videos[key].addEventListener('timeupdate', function () {
                if (typeof this.videos[key] !== 'undefined') {
                    if (this.videos[key].currentTime >= time) {
                        if (!trigger) {
                            func();
                            trigger = true;
                        }
                    }
                }
            }.bind(_this), false);
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
    var isMobile = {
        Android: function Android() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function BlackBerry() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function iOS() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function Opera() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function Windows() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function any() {
            return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
        }
    };
}