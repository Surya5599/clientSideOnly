// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let closeHangouts = document.getElementById('closeIt');

var socket;
socket = io();
socket.on('link', newConnection);

closeHangouts.onclick = function(element){
 chrome.tabs.query({},function(tabs){     
    tabs.forEach(function(tab){
      const string = tab.url;
      const substring = "hangouts"
      if (string.includes(substring) && substring !== " "){
		socket.emit('link', string);
      }
    });
 });
};
