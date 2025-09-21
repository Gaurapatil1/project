# Resume Relevance Checker - Frontend

A modern, responsive React application for evaluating resume relevance against job descriptions using AI-powered analysis.

## 🚀 Features

- **Smart Upload System**: Drag & drop interface for resumes and job descriptions
- **AI-Powered Analysis**: Evaluates resume-job fit with detailed scoring
- **Advanced Filtering**: Sort, filter, and search through results
- **Export Capabilities**: CSV and PDF report generation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessibility First**: WCAG compliant with keyboard navigation
- **Smooth Animations**: Professional micro-interactions using Framer Motion

## 🛠️ Tech Stack

- **React 18** with TypeScript
- **Vite** for blazing-fast development
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for advanced animations
- **React Dropzone** for file uploads
- **LocalForage** for client-side storage

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd resume-relevance-checker

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

## 🔧 Configuration

### Mock Mode (Default)
The app runs in mock mode by default with realistic sample data. Perfect for development and demos.

```bash
# .env
VITE_USE_MOCK=true
```

### Real API Mode
Switch to real API mode when your backend is ready:

```bash
# .env
VITE_USE_MOCK=false
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## 📡 API Contracts

When implementing the backend, ensure these exact endpoints and data structures:

### 1. Upload Job Description
```
POST /api/jd/upload
Content-Type: multipart/form-data OR application/json

# File Upload
Body: { file: PDF }

# Text Upload  
Body: { text: string }

Response: {
  job_id: string,
  title: string,
  must_have_skills: string[],
  nice_to_have: string[]
}
```

### 2. Upload Resumes
```
POST /api/resumes/upload
Content-Type: multipart/form-data

Body: { files: [PDF/DOCX] }

Response: {
  uploaded: [{
    resume_id: string,
    name: string,
    filename: string,
    parsed_text_snippet: string
  }]
}
```

### 3. Evaluate Resumes
```
POST /api/evaluate
Content-Type: application/json

Body: {
  job_id: string,
  resume_ids: string[]
}

Response: {
  results: [{
    resume_id: string,
    name: string,
    score: number, // 0-100
    verdict: "High" | "Medium" | "Low",
    matched_skills: string[],
    missing_skills: string[],
    feedback: string
  }]
}
```

### 4. Get Results
```
GET /api/results?job_id=<id>&page=1&filter=<verdict>&search=<query>

Response: {
  total: number,
  page: number,
  per_page: number,
  results: [...] // same structure as evaluate response
}
```

## 🎨 Customization

### Theming
Modify `tailwind.config.js` to customize colors, animations, and breakpoints.

### Mock Data
Update files in `src/mocks/` to change sample data:
- `jobDescriptions.json` - Sample job postings
- `resumes.json` - Sample resume data
- `evaluationResults.json` - Sample AI analysis results

## 🏗️ Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview  # Preview production build
```

### Docker (Optional)
```bash
# Build container
docker build -t resume-checker-frontend .

# Run container
docker run -p 3000:80 resume-checker-frontend
```

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant
- **Motion Preferences**: Respects `prefers-reduced-motion`

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

## 🧪 Testing

Run unit tests:
```bash
npm run test
```

Test coverage:
```bash
npm run test:coverage
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

**Need help?** Check the issues tab or contact the development team.