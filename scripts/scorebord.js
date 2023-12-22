const firebaseConfig = {
    apiKey: "AIzaSyDv61az4_Xo4aTlQB7RdLWCwfVgAMF4Faw",
    authDomain: "tataquizzen.firebaseapp.com",
    databaseURL: "https://tataquizzen-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "tataquizzen",
    storageBucket: "tataquizzen.appspot.com",
    messagingSenderId: "601340020695",
    appId: "1:601340020695:web:eb8372d5464be2b6caed92",
    measurementId: "G-295KRN0CPH"
};

firebase.initializeApp(firebaseConfig);

var usersRef = firebase.database().ref('users');

let minuten = 0;
let restSeconden = 0;
let aantalVragen = 1;
let quizVragen = '';
let quizNaam = '';
var usersData = [];
const appElement = document.getElementById("app");

function formatTimer(num){
    return num < 10 ? '0' + num : '' + num; 
}

function startScorebord(){
    if (document.title === "Gereedschappen Scorebord | Tata Quiz"){
        quizVragen = '../vragen/vragengs.json';
        quizNaam = 'gsvragen';
    } else if (document.title === "Pompen Scorebord | Tata Quiz"){
        quizVragen = '../vragen/vragenpp.json';
        quizNaam = 'ppvragen';
    }
    fetch(quizVragen)
    .then(res => res.json())
    .then(data => {
        while (data.vragen[aantalVragen].laatste != "ja"){
            aantalVragen++;
        }
    });
    getUsers();
}

function getUsers(){
    usersRef.once('value').then(function(snapshot) {
        snapshot.forEach(function(userSnapshot) {
            var naam = userSnapshot.child(quizNaam + '/naam').val();
            var goed = userSnapshot.child(quizNaam + '/goed').val();
            var tijd = userSnapshot.child(quizNaam + '/tijd').val();

            usersData.push({
                naam: naam,
                goed: goed,
                tijd: tijd
            });
        });

        usersData.sort(function(a, b) {
            if (b.goed !== a.goed) {
                return b.goed - a.goed;
            } else {
                return a.tijd - b.tijd;
            }
        });
        usersData.forEach(function(user){
            if (user.naam !== null){
            const scorebalk = document.createElement("div");
            scorebalk.classList.add("scorebalk");
            appElement.appendChild(scorebalk);
            const naamElement = document.createElement("p");
            naamElement.classList.add("naam")
            const scoreElement = document.createElement("p");
            scoreElement.classList.add("score")
            const tijdElement = document.createElement("p");
            tijdElement.classList.add("tijd")
            scorebalk.appendChild(naamElement)
            scorebalk.appendChild(scoreElement)
            scorebalk.appendChild(tijdElement)
            naamElement.innerHTML = user.naam;
            scoreElement.innerHTML = user.goed + '/' + aantalVragen;
            minuten = Math.floor(user.tijd / 60);
    
            restSeconden = user.tijd % 60;
    
            tijdElement.innerHTML = `${formatTimer(minuten)}:${formatTimer(restSeconden)}`; 
        }
        })
    }).catch(function(error){
        console.error('Er is een fout opgetreden bij het ophalen van gegevens:', error);
    });
}
startScorebord();