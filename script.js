import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCU7zzXKmd079Me-7ds2grJ6HD8dSwDidA",
    authDomain: "skyiee.firebaseapp.com",
    projectId: "skyiee",
    storageBucket: "skyiee.appspot.com",
    messagingSenderId: "985209933455",
    appId: "1:985209933455:web:5635141c298bdd5167aafa",
    measurementId: "G-5T40LG9HXW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
                    document.getElementById("signup-form").classList.add('hidden');
                    document.getElementById("signup-formtxt").classList.add('hidden');
                    document.getElementById("verification-message").classList.remove('hidden');
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
    const verifyForm = document.getElementById("verification-message");

    if (signupForm.classList.contains('hidden')) {
        loginForm.classList.add('fade-out');
        loginFormtxt.classList.add('fade-out');

        setTimeout(() => {
            loginForm.classList.add('hidden');
            loginFormtxt.classList.add('hidden');
            signupForm.classList.remove('hidden');
            signupFormtxt.classList.remove('hidden');

            signupForm.classList.remove('fade-out');
            signupForm.classList.add('fade-in');
            signupFormtxt.classList.remove('fade-out');
            signupFormtxt.classList.add('fade-in');
        }, 400);

        verifyForm.classList.add('hidden');
        formTitle.innerText = "Create Account";
    } else {
        signupForm.classList.add('fade-out');
        signupFormtxt.classList.add('fade-out');

        setTimeout(() => {
            signupForm.classList.add('hidden');
            signupFormtxt.classList.add('hidden');
            loginForm.classList.remove('hidden');
            loginFormtxt.classList.remove('hidden');

            loginForm.classList.remove('fade-out');
            loginForm.classList.add('fade-in');
            loginFormtxt.classList.remove('fade-out');
            loginFormtxt.classList.add('fade-in');
        }, 400);

        verifyForm.classList.add('hidden');
        formTitle.innerText = "Sign In";
    }
}

function showLogin() {
    document.getElementById("verification-message").classList.add('hidden');
    document.getElementById("login-form").classList.remove('hidden');
}

let resendCooldown = false;

function resendVerification() {
    if (resendCooldown) {
        alert("Please wait before resending the verification email.");
        return;
    }

    const user = auth.currentUser;
    if (user) {
        sendEmailVerification(user)
            .then(() => {
                alert("Verification email resent. Please check your inbox.");
                resendCooldown = true;
                setTimeout(() => {
                    resendCooldown = false;
                }, 60000); // 60-second cooldown
            })
            .catch((error) => {
                alert("Error resending verification email: " + error.message);
            });
    } else {
        alert("No user found. Please sign up again.");
    }
}

document.getElementById("signup-button").addEventListener("click", signUp);
document.getElementById("login-button").addEventListener("click", login);
document.getElementById("resend-button").addEventListener("click", resendVerification);

window.toggleForm = toggleForm;
window.showLogin = showLogin;
window.resendVerification = resendVerification;