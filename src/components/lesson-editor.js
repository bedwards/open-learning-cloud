import { queueOperation } from '../services/sync.js';

class LessonEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.lessonData = {
      title: '',
      description: '',
      content: '',
      visibility: 'public',
    };
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 1rem;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
        input, textarea, select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        textarea {
          min-height: 200px;
          font-family: inherit;
        }
        button {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 4px;
          background: #28a745;
          color: white;
          cursor: pointer;
          font-size: 1rem;
        }
        button:hover {
          background: #218838;
        }
        .actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }
      </style>
      <div class="editor-container">
        <h2>Create New Lesson</h2>
        <form id="lesson-form">
          <div class="form-group">
            <label for="title">Title</label>
            <input type="text" id="title" required />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <input type="text" id="description" required />
          </div>
          <div class="form-group">
            <label for="content">Content</label>
            <textarea id="content" required></textarea>
          </div>
          <div class="form-group">
            <label for="visibility">Visibility</label>
            <select id="visibility">
              <option value="public">Public</option>
              <option value="restricted">Restricted</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div class="actions">
            <button type="submit">Save Lesson</button>
            <button type="button" id="preview">Preview</button>
          </div>
        </form>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const form = this.shadowRoot.getElementById('lesson-form');
    const preview = this.shadowRoot.getElementById('preview');

    form.addEventListener('submit', (e) => this.handleSubmit(e));
    preview.addEventListener('click', () => this.handlePreview());
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const lessonData = {
      id: `lesson_${Date.now()}`,
      title: formData.get('title'),
      description: formData.get('description'),
      content: formData.get('content'),
      visibility: formData.get('visibility'),
    };

    try {
      await queueOperation({
        type: 'LESSON_CREATE',
        data: lessonData,
      });

      alert('Lesson saved successfully!');
      e.target.reset();
    } catch (error) {
      console.error('Failed to save lesson:', error);
      alert('Failed to save lesson. It has been queued for sync.');
    }
  }

  handlePreview() {
    const title = this.shadowRoot.getElementById('title').value;
    const content = this.shadowRoot.getElementById('content').value;

    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
      <html>
        <head><title>Preview: ${title}</title></head>
        <body>
          <h1>${title}</h1>
          <div>${content}</div>
        </body>
      </html>
    `);
  }
}

customElements.define('lesson-editor', LessonEditor);
