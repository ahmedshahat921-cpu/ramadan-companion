// Check authentication
const username = localStorage.getItem('username');
if (!username) {
    window.location.href = 'login.html';
}

const app = {
    // ... existing app methods ...
    init: function () {
        // ...
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        });

        // Greeting with username
        const greeting = document.querySelector('.greeting-card h2');
        if (greeting && username) {
            greeting.innerHTML = `Ramadan Kareem, <br>${username}`;
        }
    }
};
