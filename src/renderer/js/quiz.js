class RizalTriviaQuiz {
    constructor() {
        this.allQuestions = [];
        this.selectedQuestions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.score = 0;
        this.quizStarted = false;
        this.numberOfQuestions = 10;
    }

    async loadQuestions() {
        try {
            const response = await fetch('../../data/trivia_quiz.json');
            const data = await response.json();
            this.allQuestions = data.quiz_questions;
            return true;
        } catch (error) {
            console.error('Error loading quiz questions:', error);
            return false;
        }
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    selectRandomQuestions() {
        const shuffled = this.shuffleArray(this.allQuestions);
        this.selectedQuestions = shuffled.slice(0, this.numberOfQuestions);
        this.userAnswers = new Array(this.numberOfQuestions).fill(null);
    }

    startQuiz() {
        this.selectRandomQuestions();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.quizStarted = true;
        this.renderQuestion();
        this.updateProgressBar();
    }

    renderQuestion() {
        const question = this.selectedQuestions[this.currentQuestionIndex];
        const quizContainer = document.getElementById('quiz-container');
        
        const shuffledOptions = this.shuffleArray(
            question.options.map((option, index) => ({ text: option, originalIndex: index }))
        );

        quizContainer.innerHTML = `
            <div class="quiz-question-container">
                <div class="quiz-header">
                    <h3>Question ${this.currentQuestionIndex + 1} of ${this.numberOfQuestions}</h3>
                    <div class="quiz-progress-bar">
                        <div class="quiz-progress-fill" style="width: ${((this.currentQuestionIndex + 1) / this.numberOfQuestions) * 100}%"></div>
                    </div>
                </div>
                
                <div class="quiz-question">
                    <p>${question.question}</p>
                </div>
                
                <div class="quiz-options">
                    ${shuffledOptions.map((option, index) => `
                        <button class="quiz-option ${this.userAnswers[this.currentQuestionIndex] === option.originalIndex ? 'selected' : ''}" 
                                data-answer="${option.originalIndex}"
                                onclick="quiz.selectAnswer(${option.originalIndex})">
                            <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                            <span class="option-text">${option.text}</span>
                        </button>
                    `).join('')}
                </div>
                
                <div class="quiz-navigation">
                    <button class="quiz-btn quiz-btn-secondary" 
                            onclick="quiz.previousQuestion()" 
                            ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
                        ← Previous
                    </button>
                    
                    ${this.currentQuestionIndex === this.numberOfQuestions - 1 
                        ? `<button class="quiz-btn quiz-btn-primary" onclick="quiz.submitQuiz()">Submit Quiz</button>`
                        : `<button class="quiz-btn quiz-btn-primary" onclick="quiz.nextQuestion()">Next →</button>`
                    }
                </div>
            </div>
        `;
    }

    selectAnswer(answerIndex) {
        this.userAnswers[this.currentQuestionIndex] = answerIndex;
        
        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        const selectedButton = document.querySelector(`[data-answer="${answerIndex}"]`);
        if (selectedButton) {
            selectedButton.classList.add('selected');
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.numberOfQuestions - 1) {
            this.currentQuestionIndex++;
            this.renderQuestion();
            this.updateProgressBar();
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.renderQuestion();
            this.updateProgressBar();
        }
    }

    updateProgressBar() {
        const progressFill = document.querySelector('.quiz-progress-fill');
        if (progressFill) {
            progressFill.style.width = `${((this.currentQuestionIndex + 1) / this.numberOfQuestions) * 100}%`;
        }
    }

    calculateScore() {
        this.score = 0;
        this.selectedQuestions.forEach((question, index) => {
            if (this.userAnswers[index] === question.correct_answer) {
                this.score++;
            }
        });
        return this.score;
    }

    getScoreMessage(score, total) {
        const percentage = (score / total) * 100;
        
        if (percentage === 100) {
            return {
                title: "Perfect Score! 🎉",
                message: "Outstanding! You're a true Rizal expert!",
                class: "perfect"
            };
        } else if (percentage >= 80) {
            return {
                title: "Excellent! 🌟",
                message: "Great job! You have excellent knowledge about Dr. José Rizal.",
                class: "excellent"
            };
        } else if (percentage >= 60) {
            return {
                title: "Good Job! 👍",
                message: "Well done! You have a good understanding of Rizal's life and works.",
                class: "good"
            };
        } else if (percentage >= 40) {
            return {
                title: "Keep Learning! 📚",
                message: "You're on the right track. Review the materials to improve your knowledge.",
                class: "fair"
            };
        } else {
            return {
                title: "Keep Trying! 💪",
                message: "Don't give up! Explore the museum more to learn about our national hero.",
                class: "needs-improvement"
            };
        }
    }

    submitQuiz() {
        const unanswered = this.userAnswers.filter(answer => answer === null).length;
        
        if (unanswered > 0) {
            const confirmSubmit = confirm(`You have ${unanswered} unanswered question(s). Do you want to submit anyway?`);
            if (!confirmSubmit) return;
        }

        this.calculateScore();
        this.showResults();
    }

    showResults() {
        const quizContainer = document.getElementById('quiz-container');
        const scoreInfo = this.getScoreMessage(this.score, this.numberOfQuestions);
        const percentage = ((this.score / this.numberOfQuestions) * 100).toFixed(1);

        let resultsHTML = `
            <div class="quiz-results">
                <div class="results-header ${scoreInfo.class}">
                    <h2>${scoreInfo.title}</h2>
                    <div class="score-display">
                        <div class="score-circle">
                            <span class="score-number">${this.score}</span>
                            <span class="score-total">/ ${this.numberOfQuestions}</span>
                        </div>
                        <p class="score-percentage">${percentage}%</p>
                    </div>
                    <p class="score-message">${scoreInfo.message}</p>
                </div>

                <div class="answer-key">
                    <h3>📋 Answer Key & Explanations</h3>
                    <div class="answer-key-list">
        `;

        this.selectedQuestions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === question.correct_answer;
            const userAnswerText = userAnswer !== null ? question.options[userAnswer] : 'Not answered';
            const correctAnswerText = question.options[question.correct_answer];

            resultsHTML += `
                <div class="answer-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="answer-header">
                        <span class="question-number">Question ${index + 1}</span>
                        <span class="answer-status">${isCorrect ? '✓ Correct' : '✗ Incorrect'}</span>
                    </div>
                    
                    <p class="answer-question"><strong>${question.question}</strong></p>
                    
                    <div class="answer-details">
                        ${!isCorrect ? `
                            <p class="user-answer">
                                <span class="label">Your answer:</span> 
                                <span class="value incorrect-answer">${userAnswerText}</span>
                            </p>
                        ` : ''}
                        <p class="correct-answer">
                            <span class="label">Correct answer:</span> 
                            <span class="value correct-answer-text">${correctAnswerText}</span>
                        </p>
                    </div>
                    
                    <div class="answer-explanation">
                        <p><strong>Explanation:</strong> ${question.explanation}</p>
                    </div>
                </div>
            `;
        });

        resultsHTML += `
                    </div>
                </div>

                <div class="quiz-actions">
                    <button class="quiz-btn quiz-btn-primary" onclick="quiz.restartQuiz()">
                        🔄 Take Another Quiz
                    </button>
                    <button class="quiz-btn quiz-btn-secondary" onclick="window.location.reload()">
                        🏠 Back to Interactive Zone
                    </button>
                </div>
            </div>
        `;

        quizContainer.innerHTML = resultsHTML;
        quizContainer.scrollTop = 0;
    }

    restartQuiz() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.startQuiz();
    }

    showStartScreen() {
        const quizContainer = document.getElementById('quiz-container');
        quizContainer.innerHTML = `
            <div class="quiz-start-screen">
                <div class="quiz-intro">
                    <h2>🎯 Rizal Trivia Quiz</h2>
                    <p class="quiz-description">
                        Test your knowledge about Dr. José Rizal, the Philippines' national hero. 
                        This quiz will randomly select ${this.numberOfQuestions} questions from our question bank.
                    </p>
                    
                    <div class="quiz-info">
                        <div class="info-item">
                            <span class="info-icon">📝</span>
                            <div>
                                <strong>Questions:</strong>
                                <p>${this.numberOfQuestions} random questions</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">⏱️</span>
                            <div>
                                <strong>Time:</strong>
                                <p>No time limit - take your time!</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <span class="info-icon">🎓</span>
                            <div>
                                <strong>Topics:</strong>
                                <p>Life, works, travels, and legacy</p>
                            </div>
                        </div>
                    </div>

                    <div class="quiz-tips">
                        <h4>💡 Tips:</h4>
                        <ul>
                            <li>Read each question carefully</li>
                            <li>You can navigate back to review your answers</li>
                            <li>Detailed explanations will be provided at the end</li>
                            <li>The quiz randomizes every time you start!</li>
                        </ul>
                    </div>

                    <button class="quiz-btn quiz-btn-primary quiz-btn-large" onclick="quiz.startQuiz()">
                        🚀 Start Quiz
                    </button>
                </div>
            </div>
        `;
    }
}

let quiz;

document.addEventListener('DOMContentLoaded', async () => {
    quiz = new RizalTriviaQuiz();
    const loaded = await quiz.loadQuestions();
    
    if (loaded) {
        quiz.showStartScreen();
    } else {
        document.getElementById('quiz-container').innerHTML = `
            <div class="quiz-error">
                <h3>⚠️ Error Loading Quiz</h3>
                <p>Unable to load quiz questions. Please refresh the page and try again.</p>
            </div>
        `;
    }
});
