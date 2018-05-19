function Biketastic() {
  document.addEventListener('DOMContentLoaded', function() {
    this.signInButton = document.getElementById('sign-in-button');
    this.signOutButton = document.getElementById('sign-out-button');
    this.emailContainer = document.getElementById('email-container');
    this.nameContainer = document.getElementById('name-container');
    this.signedOutCard = document.getElementById('signed-out-card');
    this.signedInCard = document.getElementById('signed-in-card');

    this.signedOutCard.style.display = 'none';
    this.signedInCard.style.display = 'block';

    this.signInButton.addEventListener('click', this.signIn.bind(this));
    this.signOutButton.addEventListener('click', this.signOut.bind(this));
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
  }.bind(this));
}

Biketastic.prototype.signIn = function() {
  var tokenFunctionURL = 'popup.html';
  window.open(tokenFunctionURL, 'name', 'height=585,width=400');
};

// Signs-out of Firebase.
Biketastic.prototype.signOut = function() {
  firebase.auth().signOut();
};

// Triggered on Firebase auth state change.
Biketastic.prototype.onAuthStateChanged = function(user) {
  if (user) {
    this.nameContainer.innerText = user.displayName;
    this.signedOutCard.style.display = 'none';
    this.signedInCard.style.display = 'block';
  } else {
    this.signedOutCard.style.display = 'block';
    this.signedInCard.style.display = 'none';
  }
};

new Biketastic();
