_DPDK Video Manager_
============

Functionalities
-----------
* A simple video module for playing video's on desktop and mobile.
* Now works for Desktop/Mobile (iOS 10 Inline support).

Setup
-----------
Install the videoManager:
```
npm install dpdk-videomanager
```
Import the videoManager somewhere in your code:
```
import videoManager from 'dpdk-videomanager/dist/videoManager.js';
```
Create an new instance of the videoManager and assign the videoKeys object to it:
```
const videoManager = new videoManager(videoKeys);
```
>The videoKeys could be a preloader object containing blobs or just a static object. Example:
```
const staticBlobs = {
    videoKey: {
        blob: '/path/to/video/a-video.mp4'
    },
    otherVideoKey: {
        blob: '/path/to/video/b-video.mp4'
    }
};
```

Usage
-----------
Adding a video to the DOM:
```
videoManager.addVideoToDOM("videoKey", document.querySelector("#video-container"), (loop true/false));
```
Removing a video to the DOM:
```
videoManager.unloadVideo("videoKey");
```
Playing a video:
```
videoManager.play("videoKey", (playOnMobile true/false));
```
Pausing a video:
```
videoManager.pause("videoKey");
```
Muting a specific video:
```
videoManager.mute("videoKey");
```
Muting all video's including video's that are added later:
```
videoManager.muteAll();
```
Binding events:
```
videoManager.bindCompletedEvent("videoKey", function () {
    console.log("Video ended!");
});

videoManager.bindTimeUpdateEvent("videoKey", function (currentTime, duration) {
    console.log("Video time update! New Time: "+currentTime+", Total duration: "+duration);
});
```
Binding triggers:
```
videoManager.triggerVideoPercentage("videoKey", percentage, function () {
    console.log("Video is at percentage of play time");
});

videoManager.triggerVideoTime("videoKey", time, function () {
    console.log("Video time is at time");
});
```

Changelog
-----------
* v0.2.9 | 2017-09-01: Making the year dynamic
* v0.2.8 | 2017-09-01: Making the package github ready
* v0.2.7 | 2017-04-10: Fixed the video unload function for IE11
* v0.2.6 | 2017-04-05: Added the loop param for a video
* v0.2.5 | 2017-02-22: Implementing ES6 flow
* v0.2.4 | 2017-02-17: Updated the documentation
* v0.2.3 | 2017-02-08: let/var bugfix and changed the video element from string to element
* v0.2.2 | 2017-02-06: Fixed the gsap dependency issue
* v0.2.1 | 2017-02-01: Updated the way of exporting the modules
* v0.2.0 | 2017-01-10: Added support for preloader blobs or static videoKey object #standaloneversionready. Also added the new test package.
* v0.1.4 | 2017-01-05: Updated the readme.
* v0.1.3 | 2017-01-05: Added the 2 video triggers (time, percentage). Updated the readme. And added the new test package.
* v0.1.2 | 2017-01-05: Bugfixes, Added extra playOnMobile option to play function, also added the pause function and code cleanup.
* v0.1.1 | 2016-12-20: Changed readme that now includes a usage section also included a test application
* v0.1.0 | 2016-12-19: Added support for events and working on mobile detection
* v0.0.5 | 2016-12-19: Testing jenkins workflow
* v0.0.4 | 2016-12-19: Testing jenkins workflow
* v0.0.3 | 2016-12-19: Testing jenkins workflow
* v0.0.2 | 2016-12-19: Testing jenkins workflow
* v0.0.1 | 2016-12-16: First add to NPM manager
