let countSpan = document.querySelector(".count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answers-area");
let submitButton = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");

let currentIndex = 0;
let rightAnswer = 0;
let intrevalTime;

function getQuestions() {
  let myRequest = new XMLHttpRequest();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questionsObject = JSON.parse(this.responseText);
      let questionsCount = questionsObject.length;

      createBullets(questionsCount);

      addQuestionData(questionsObject[currentIndex], questionsCount);
      countdown(10, questionsCount);

      submitButton.onclick = function () {
        let TheRightAnswer = questionsObject[currentIndex].right_answer;
        // console.log(TheRightAnswer);
        currentIndex++;
        checkAnswer(TheRightAnswer, questionsCount);
        quizArea.innerHTML = "";
        answersArea.innerHTML = "";
        addQuestionData(questionsObject[currentIndex], questionsCount);

        handleBullets();

        showResults(questionsCount);
        clearInterval(intrevalTime);
        countdown(10, questionsCount);
      };
    }
  };
  myRequest.open("GET", "html_questions.json", true);
  myRequest.send();
}
getQuestions();

function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    let spans = document.createElement("span");
    if (i === 0) {
      spans.className = "on";
    }
    bulletsSpanContainer.appendChild(spans);
  }
}
function addQuestionData(Obj, count) {
  if (currentIndex < count) {
    // console.log(Obj);
    let h2 = document.createElement("h2");
    let h2Text = document.createTextNode(Obj.title);
    h2.appendChild(h2Text);
    quizArea.appendChild(h2);
    for (let i = 1; i <= 4; i++) {
      let div = document.createElement("div");
      div.className = "answer";
      let input = document.createElement("input");
      input.name = "questions";
      input.id = `answer_${i}`;
      input.type = "radio";
      input.dataset.answer = Obj[`answer_${i}`];
      if (i === 1) {
        input.checked = true;
      }
      div.appendChild(input);
      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      let labelText = document.createTextNode(Obj[`answer_${i}`]);
      label.appendChild(labelText);
      div.appendChild(label);
      answersArea.appendChild(div);
    }
  }
}
function checkAnswer(rAnswer, count) {
  let answers = document.getElementsByName("questions");
  let theChoosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  // console.log(theChoosenAnswer);
  // console.log(rAnswer);
  if (rAnswer === theChoosenAnswer) {
    rightAnswer++;
    console.log("rAnswer");
  }
}
function handleBullets() {
  let bulletsSpan = document.querySelectorAll(".bullets .spans span");
  let arraybulletsSpan = Array.from(bulletsSpan);
  arraybulletsSpan.forEach((el, index) => {
    if (currentIndex === index) {
      el.className = "on";
    }
  });
}
function showResults(count) {
  let theResults;
  if (currentIndex === count) {
    quizArea.remove();
    submitButton.remove();
    answersArea.remove();
    bullets.remove();
    if (rightAnswer > count / 2 && rightAnswer < count) {
      theResults = `<span class="good">Good</span>, ${rightAnswer} From ${count}`;
    } else if (rightAnswer === count) {
      theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
    } else {
      theResults = `<span class="bad">Bad</span>, ${rightAnswer} From ${count}`;
    }

    resultsContainer.innerHTML = theResults;
    resultsContainer.style.padding = "10px";
    resultsContainer.style.backgroundColor = "white";
    resultsContainer.style.marginTop = "10px";
  }
}
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    intrevalTime = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
      countdownElement.innerHTML = `${minutes} : ${seconds}`;
      if (--duration < 0) {
        clearInterval(intrevalTime);
        submitButton.onclick();
      }
    }, 1000);
  }
}
