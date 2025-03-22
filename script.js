import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "AIzaSyBgSruvz9mP4VWdyXDlz4v39JY62JwDWXE",
    authDomain: "cmmskr2002.firebaseapp.com",
    projectId: "cmmskr2002",
    storageBucket: "cmmskr2002.firebasestorage.app",
    messagingSenderId: "679863056081",
    appId: "1:679863056081:web:d201489d80940a3025b7f0",
    measurementId: "G-709LXJ7VRV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
        return "Password must be at least 8 characters long.";
    }
    if (!hasUpperCase) {
        return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowerCase) {
        return "Password must contain at least one lowercase letter.";
    }
    if (!hasNumber) {
        return "Password must contain at least one number.";
    }
    if (!hasSpecialChar) {
        return "Password must contain at least one special character.";
    }
    return "";
}

// signup
function signUp() {
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirmPassword = document.getElementById("signup-confirm-password").value.trim();
    const emailError = document.getElementById("signup-email-error");
    const passwordError = document.getElementById("signup-password-error");

    let isValid = true;
    emailError.style.display = 'none';
    passwordError.style.display = 'none';

    if (!email) {
        emailError.innerText = "Email is required.";
        emailError.style.display = 'block';
        isValid = false;
    }

    if (password !== confirmPassword) {
        passwordError.innerText = "Passwords do not match.";
        passwordError.style.display = 'block';
        isValid = false;
    }

    // validate pass strength
    const passwordValidationMessage = validatePassword(password);
    if (passwordValidationMessage) {
        passwordError.innerText = passwordValidationMessage;
        passwordError.style.display = 'block';
        isValid = false;
    }

    if (!isValid) return;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            sendEmailVerification(user)
                .then(() => {
                    alert("A verification email has been sent. Please check your inbox.");
                    document.getElementById("signup-form").style.display = "none";
                    document.getElementById("verification-message").style.display = "block";
                })
                .catch((error) => {
                    emailError.innerText = error.message;
                    emailError.style.display = 'block';
                });
        })
        .catch((error) => {
            emailError.innerText = error.message;
            emailError.style.display = 'block';
        });
}

// login
function login() {
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-password").value.trim();
    const loginError = document.getElementById("login-error");

    loginError.style.display = 'none';

    if (!email || !password) {
        loginError.innerText = "Email and password are required.";
        loginError.style.display = 'block';
        return;
    }

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;

            if (!user.emailVerified) {
                loginError.innerText = "Please verify your email before logging in.";
                loginError.style.display = 'block';
                return;
            }

            alert("Login successful!");
            window.location.href = "https://kopyolmao.github.io/ACLC_Profile_Project";
        })
        .catch((error) => {
            loginError.innerText = error.message;
            loginError.style.display = 'block';
        });
}

function toggleForm() {
    const signupForm = document.getElementById("signup-form");
    const signupFormtxt = document.getElementById("signup-formtxt");
    const loginForm = document.getElementById("login-form");
    const loginFormtxt = document.getElementById("login-formtxt");
    const formTitle = document.getElementById("form-title");
    const switchText = document.querySelector('.switch-text a');
    const verifyForm = document.getElementById("verification-message");

    if (signupForm.style.display === "none") {
        signupForm.style.display = "block";
        signupFormtxt.style.display = "block";
        loginForm.style.display = "none";
        loginFormtxt.style.display = "none";
        verifyForm.style.display = "none";
        formTitle.innerText = "Create Account";
        switchText.innerText = "Already have an account?";
    } else {
        signupForm.style.display = "none";
        signupFormtxt.style.display = "none";
        loginForm.style.display = "block";
        loginFormtxt.style.display = "block";
        verifyForm.style.display = "none";
        formTitle.innerText = "Sign In";
        switchText.innerText = "Dont have an account yet?";
    }
}

function showLogin() {
    document.getElementById("verification-message").style.display = "none";
    document.getElementById("login-form").style.display = "block";
}

window.toggleForm = toggleForm;
window.showLogin = showLogin;
window.signUp = signUp;
window.login = login;