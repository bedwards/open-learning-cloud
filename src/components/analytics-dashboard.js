import * as d3 from 'd3';

class AnalyticsDashboard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.loadAnalytics();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 1rem;
        }
        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        .metric-card {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1.5rem;
        }
        .metric-value {
          font-size: 2rem;
          font-weight: bold;
          color: #007bff;
        }
        #chart {
          width: 100%;
          height: 300px;
          margin-top: 2rem;
        }
      </style>
      <div class="dashboard-container">
        <h2>Learning Analytics</h2>
        <div class="dashboard-grid">
          <div class="metric-card">
            <h3>Total Lessons</h3>
            <div class="metric-value" id="total-lessons">-</div>
          </div>
          <div class="metric-card">
            <h3>Hours Watched</h3>
            <div class="metric-value" id="hours-watched">-</div>
          </div>
          <div class="metric-card">
            <h3>Active Learners</h3>
            <div class="metric-value" id="active-learners">-</div>
          </div>
        </div>
        <div id="chart"></div>
      </div>
    `;
  }

  async loadAnalytics() {
    // Simulated data - in production, load from Firestore
    const data = {
      totalLessons: 42,
      hoursWatched: 1250,
      activeLearners: 87,
      engagement: [
        { date: '2024-01-01', views: 120 },
        { date: '2024-01-02', views: 150 },
        { date: '2024-01-03', views: 180 },
        { date: '2024-01-04', views: 140 },
        { date: '2024-01-05', views: 200 },
      ],
    };

    this.shadowRoot.getElementById('total-lessons').textContent =
      data.totalLessons;
    this.shadowRoot.getElementById('hours-watched').textContent =
      data.hoursWatched;
    this.shadowRoot.getElementById('active-learners').textContent =
      data.activeLearners;

    this.renderChart(data.engagement);
  }

  renderChart(data) {
    const container = this.shadowRoot.getElementById('chart');
    const width = container.clientWidth;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const svg = d3
      .select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    const x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => new Date(d.date)))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.views)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x((d) => x(new Date(d.date)))
      .y((d) => y(d.views));

    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#007bff')
      .attr('stroke-width', 2)
      .attr('d', line);

    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  }
}

customElements.define('analytics-dashboard', AnalyticsDashboard);
