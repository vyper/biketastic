function Biketastic() {
  document.addEventListener('DOMContentLoaded', function() {
    this.signInButton = document.getElementById('sign-in-button');

    this.signInButton.addEventListener('click', this.signIn.bind(this));
  }.bind(this));
}

Biketastic.prototype.signIn = function() {
  var tokenFunctionURL = 'https://us-central1-biketastic-x23.cloudfunctions.net/oauth/token';
  console.log(tokenFunctionURL);
  window.open(tokenFunctionURL, 'name', 'height=585,width=400');
};

new Biketastic();
