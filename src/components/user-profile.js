import {
  onAuthStateChanged,
  signInAnonymousUser,
  signInWithGoogle,
  signInWithGithub,
  getFirebaseAuth,
} from '../services/firebase.js';

class UserProfile extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    onAuthStateChanged((user) => {
      this.currentUser = user;
      this.render();
    });
  }

  render() {
    const { currentUser } = this;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        .profile-container {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
        button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          background: #007bff;
          color: white;
          cursor: pointer;
        }
        button:hover {
          background: #0056b3;
        }
      </style>
      <div class="profile-container">
        ${
          currentUser
            ? `
          <div class="user-info">
            ${
              currentUser.photoURL
                ? `<img class="avatar" src="${currentUser.photoURL}" alt="Profile" />`
                : ''
            }
            <span>${currentUser.displayName || currentUser.email || 'Anonymous User'}</span>
          </div>
          <button id="signout">Sign Out</button>
        `
            : `
          <button id="signin-anon">Browse as Guest</button>
          <button id="signin-google">Sign in with Google</button>
          <button id="signin-github">Sign in with GitHub</button>
        `
        }
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const signinAnon = this.shadowRoot.getElementById('signin-anon');
    const signinGoogle = this.shadowRoot.getElementById('signin-google');
    const signinGithub = this.shadowRoot.getElementById('signin-github');
    const signout = this.shadowRoot.getElementById('signout');

    if (signinAnon) {
      signinAnon.addEventListener('click', () => this.handleSignInAnonymous());
    }
    if (signinGoogle) {
      signinGoogle.addEventListener('click', () => this.handleSignInGoogle());
    }
    if (signinGithub) {
      signinGithub.addEventListener('click', () => this.handleSignInGithub());
    }
    if (signout) {
      signout.addEventListener('click', () => this.handleSignOut());
    }
  }

  async handleSignInAnonymous() {
    try {
      await signInAnonymousUser();
    } catch (error) {
      console.error('Anonymous sign-in failed:', error);
      alert('Failed to sign in anonymously');
    }
  }

  async handleSignInGoogle() {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google sign-in failed:', error);
      alert('Failed to sign in with Google');
    }
  }

  async handleSignInGithub() {
    try {
      await signInWithGithub();
    } catch (error) {
      console.error('GitHub sign-in failed:', error);
      alert('Failed to sign in with GitHub');
    }
  }

  async handleSignOut() {
    try {
      const auth = getFirebaseAuth();
      await auth.signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }
}

customElements.define('user-profile', UserProfile);
