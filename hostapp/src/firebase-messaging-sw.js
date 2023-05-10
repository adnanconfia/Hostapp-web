importScripts('https://www.gstatic.com/firebasejs/9.4.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.4.0/firebase-messaging-compat.js');

const firebaseConfig = {
  //  firebase: {
    projectId: 'hostapp-e1c06',
    appId: '1:485746307642:web:f4b179b8cd8167f35f3b03',
    storageBucket: 'hostapp-e1c06.appspot.com',
    locationId: 'europe-west',
    apiKey: 'AIzaSyCTcgHBb-TcjM0CJybsmkXb4sTLa70Rb9w',
    authDomain: 'hostapp-e1c06.firebaseapp.com',
    messagingSenderId: '485746307642',
    measurementId: 'G-3DVDLWGGLV',
  
  production: false
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();