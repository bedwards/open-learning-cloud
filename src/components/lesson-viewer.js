import * as THREE from 'three';

class LessonViewer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  set lesson(data) {
    this._lesson = data;
    this.render();
  }

  render() {
    if (!this._lesson) return;

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 1rem;
        }
        .lesson-header {
          margin-bottom: 2rem;
        }
        .lesson-content {
          line-height: 1.6;
        }
        .lesson-media {
          margin: 2rem 0;
        }
        #three-container {
          width: 100%;
          height: 400px;
          background: #f0f0f0;
        }
      </style>
      <div class="lesson-header">
        <h2>${this._lesson.title}</h2>
        <p>${this._lesson.description}</p>
      </div>
      <div class="lesson-content">
        ${this._lesson.content}
      </div>
      ${
        this._lesson.has3D
          ? '<div class="lesson-media"><div id="three-container"></div></div>'
          : ''
      }
    `;

    if (this._lesson.has3D) {
      this.init3DVisualization();
    }
  }

  init3DVisualization() {
    const container = this.shadowRoot.getElementById('three-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add a simple cube as demonstration
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    function animate() {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    animate();
  }
}

customElements.define('lesson-viewer', LessonViewer);
