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

var database = firebase.database()

let uid;
let vraagCount = 1;
let buttonid = 0;
let aantalVragen = 1;
let goed = 0;
let laatsteVraag = false;
let quizVragen = '';
let quizNaam = '';
let seconden = 0;
let minuten = 0;
let restSeconden = 0;
let timerInterval;
const selectedAntwoord = [];
const AGoed = [];
const vraagElement = document.getElementById("vraag");
const antwoordButtons = document.getElementById("antwoord-buttons");
const volgendeButton = document.getElementById("volgende-btn");
const vorigeButton = document.getElementById("vorige-btn");
const imgDiv = document.getElementById("imagediv");
const vraagNummer = document.getElementById("vraagnr");
const buttonA = document.getElementById("0");
const buttonB = document.getElementById("1");
const buttonC = document.getElementById("2");
const timer = document.getElementById("timertxt");
const eindeTitel = document.getElementById("eindeTitel");
const letOp = document.getElementById("letOp");
const eindeForm = document.getElementById("eindeForm");
const formInput = document.getElementById("formInput");
const resultaatDiv = document.getElementById("resultaatDiv");
const resultaatTxt = document.getElementById("resultaatTxt");
const naamInput = document.getElementById("naamInput");
const submitBtn = document.getElementById("submitBtn");
const terugBtn = document.getElementById("terugBtn");

document.addEventListener('DOMContentLoaded', startTimer);

function startQuiz(){
    if (document.title === "Gereedschappen Quiz | Tata Quiz"){
        quizVragen = '../vragen/vragengs.json';
        quizNaam = 'gsvragen';
    } else if (document.title === "Pompen Quiz | Tata Quiz"){
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
    getType();
}
function formatTimer(num){
    return num < 10 ? '0' + num : '' + num; 
}
function startTimer(){
    timerInterval = setInterval(function () {
        seconden++;

        minuten = Math.floor(seconden / 60);

        restSeconden = seconden % 60;

        timer.textContent = `${formatTimer(minuten)}:${formatTimer(restSeconden)}`; 
    }, 1000);
}

function getType(){
    if (AGoed[vraagCount] == null){
        checkGoed();
    }
    volgendeButton.disabled = true;
    fetch(quizVragen)
    .then(res => res.json())
    .then(data => {
        if(vraagCount == aantalVragen){
            volgendeButton.innerHTML = "Inleveren";
        }
        else{
            volgendeButton.innerHTML = "Volgende";
        }
        if (data.vragen[vraagCount].type == "normal"){
            imgDiv.classList.remove("imagestyle");
            NormaalVraag();
        } else if (data.vragen[vraagCount].type == "image"){
            imgDiv.classList.add("imagestyle");
            ImageVraag();
        }
    })
    if (vraagCount == 1){
        vorigeButton.disabled = true;
    }
    else{
        vorigeButton.disabled = false;
    }
    Opgeslagen();
}

function NormaalVraag(){
    fetch(quizVragen)
    .then(res => res.json())
    .then(data => {
        vraagElement.innerHTML =  data.vragen[vraagCount].vraag;
        data.vragen[vraagCount].antwoorden.forEach(antwoord => {
            var button = document.getElementById(buttonid)
            button.innerHTML = antwoord.text;
            buttonid++;
     });
     if (vraagCount < 10){
        vraagNummer.innerHTML = "0" + vraagCount + "/" + aantalVragen;
     }
     else {
        vraagNummer.innerHTML = vraagCount + "/" + aantalVragen;
     }
     buttonid = 0;
    })
    isSelected();
}

function ImageVraag(){
    fetch(quizVragen)
    .then(res => res.json())
    .then(data => {
        vraagElement.innerHTML =  data.vragen[vraagCount].vraag;
        data.vragen[vraagCount].antwoorden.forEach(antwoord => {
            var button = document.getElementById(buttonid)
            button.innerHTML = antwoord.text;
            buttonid++;
     });
     if (vraagCount < 10){
        vraagNummer.innerHTML = "0" + vraagCount + "/" + aantalVragen;
     }
     else {
        vraagNummer.innerHTML = vraagCount + "/" + aantalVragen;
     }
     const imagesrc = data.vragen[vraagCount].image;
     const img = document.createElement("img");
     img.classList.add('image');
     imgDiv.appendChild(img);
     const preloadedImg = new Image();
     preloadedImg.src = '../images/' + imagesrc + '.png';
     preloadedImg.addEventListener('load', function() {
        img.src = preloadedImg.src;
     })
     if (preloadedImg.complete) {
        preloadedImg.dispatchEvent(new Event('load'));
     }
    //  img.src = '../images/' + imagesrc + '.png';
    //  img.classList.add('image');
    //  imgDiv.appendChild(img);
     buttonid = 0;
    })
    isSelected();
}

function isSelected(){
    if (buttonA.classList.contains("selected")){
        volgendeButton.disabled = false;
    }
    if (buttonB.classList.contains("selected")){
        volgendeButton.disabled = false;
    }    
    if (buttonC.classList.contains("selected")){
        volgendeButton.disabled = false;
    }
}

function checkGoed(){
    var agoed_ref = database.ref(quizNaam + '/' + vraagCount + '/goed')
    agoed_ref.on('value', function(snapshot){
        var data = snapshot.val()
        AGoed[vraagCount] = data;
    })
}
volgendeButton.addEventListener("click", ()=>{
    fetch(quizVragen)
    .then(res => res.json())
    .then(data => {
        if (!laatsteVraag){
            if(vraagCount+1 == aantalVragen){
                laatsteVraag = !laatsteVraag;
            }
            vraagCount++;
            buttonSelect();
            while(imgDiv.firstChild){
            imgDiv.removeChild(imgDiv.firstChild);
            }
            getType();
        }
        else {
            getForm();
        }
    })
});

vorigeButton.addEventListener("click", ()=>{
    fetch(quizVragen)
    .then(res => res.json())
    .then(data => {
        if (volgendeButton.disabled){
            volgendeButton.disabled = false;
            volgendeButton.innerHTML = "Volgende"
        }
        if (laatsteVraag){
            laatsteVraag = !laatsteVraag
        }
        if (vraagCount >= 2){
            vraagCount--;
            buttonSelect();
            while(imgDiv.firstChild){
                imgDiv.removeChild(imgDiv.firstChild);
            }
            getType();
        }
    })
    Opgeslagen();
});

buttonA.onclick = function (){
    buttonSelect();
    buttonA.classList.add("selected");
    selectedAntwoord[vraagCount] = "A";
}
buttonB.onclick = function (){
    buttonSelect();
    buttonB.classList.add("selected");
    selectedAntwoord[vraagCount] = "B";
}
buttonC.onclick = function (){
    buttonSelect();
    buttonC.classList.add("selected");
    selectedAntwoord[vraagCount] = "C";
}

function buttonSelect(){
    buttonA.classList.remove("selected");
    buttonB.classList.remove("selected");
    buttonC.classList.remove("selected");
    volgendeButton.disabled = false;
}

function Opgeslagen(){
    if (selectedAntwoord[vraagCount] == "A"){
        buttonA.classList.add("selected");
    }
    if (selectedAntwoord[vraagCount] == "B"){
        buttonB.classList.add("selected");
    }
    if (selectedAntwoord[vraagCount] == "C"){
        buttonC.classList.add("selected");
    }
}

function countScore(){
    let i = 1;
    while (i <= aantalVragen){
        if (selectedAntwoord[i] == AGoed[i] && selectedAntwoord[i] != null){
            goed++;
        }
        i++;
    }
}

function getForm(){
    clearInterval(timerInterval);
    uid = localStorage.getItem("UID");
    if (uid == null){
        uid = Date.now().toString(36) + Math.random().toString(36).substring(2,12).padStart(12, 0);
        localStorage.setItem("UID", JSON.stringify(uid))
    }
    timer.remove();
    vraagElement.remove();
    vorigeButton.disabled = true;
    imgDiv.remove();
    antwoordButtons.remove();
    vorigeButton.remove();
    vraagNummer.remove();
    volgendeButton.remove();
    eindeForm.hidden = false;
    countScore();
}

submitBtn.onclick = function () {checkScore()};

function checkScore(){
    var goed_ref = database.ref('users/' + uid + '/' + quizNaam + '/goed')
    goed_ref.on('value', function(snapshot){
        var data = snapshot.val()
        if (goed > data){
            postScore();
        }
        if (goed == data){
            var tijd_ref = database.ref('users/' + uid + '/' + quizNaam + '/tijd')
            tijd_ref.on('value', function(snapshot){
                    var data = snapshot.val()
                    if (seconden < data){
                        postScore();
                    }
                })
            }
        })
    loadScore();
}
function postScore(){
    database.ref('users/' + uid + '/' + quizNaam).set({
        naam: naamInput.value,
        goed: goed,
        tijd: seconden
    })
}
function loadScore(){
    formInput.remove();
    eindeTitel.remove();
    letOp.remove();
    eindeForm.classList.add("centerResultaat");
    resultaatDiv.hidden = false;
    resultaatTxt.innerHTML = "Je hebt " + goed + " van de " + aantalVragen + " vragen goed en een tijd behaald van " + `${formatTimer(minuten)}:${formatTimer(restSeconden)}` + "!";
    terugBtn.hidden = false;
}
startQuiz();