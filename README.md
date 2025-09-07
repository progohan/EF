# Eduardo's Construction Portfolio

A modern, responsive portfolio website showcasing Eduardo's professional experience and projects in the construction industry.

## 🚀 Live Demo

Visit the live website: [https://progohan.github.io/EF](https://progohan.github.io/EF)

## 📋 Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Interactive Components**: Smooth animations and user-friendly interface
- **Professional Sections**:
  - About & Hero section
  - Professional Experience
  - Key Projects showcase
  - Core Competencies
  - Education & Certifications
  - Contact Information

## 🛠️ Technologies Used

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Deployment**: GitHub Pages

## 🚀 Quick Start

### Prerequisites
- Node.js (version 18 or higher)
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/progohan/EF.git
cd EfernandezOrtiz
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Start the development server:
```bash
pnpm dev
# or
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

## 📦 Build for Production

```bash
pnpm build
# or
npm run build
```

The built files will be generated in the `dist/` directory.

## 🌐 Deployment

This website is automatically deployed to GitHub Pages. Any push to the `main` branch will trigger a new deployment.

### Manual Deployment

To deploy manually:

1. Build the project:
```bash
pnpm build
```

2. The `dist/` folder contains all the static files ready for deployment.

## 📁 Project Structure

```
EF/
├── public/                 # Static assets
│   ├── data.json          # Portfolio data
│   ├── profile.jpg        # Profile image
│   └── ...
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # UI components (Radix UI)
│   │   ├── About.tsx     # About section
│   │   ├── Contact.tsx   # Contact section
│   │   ├── Experience.tsx # Experience section
│   │   └── ...
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── dist/                 # Production build (GitHub Pages serves from here)
└── ...
```

## 🎨 Customization

### Updating Portfolio Content

Edit the `public/data.json` file to update:
- Personal information
- Professional experience
- Projects
- Skills and competencies
- Education details

### Styling

The project uses Tailwind CSS for styling. Customize the design by:
- Modifying component styles in individual `.tsx` files
- Updating Tailwind configuration in `tailwind.config.js`
- Adding custom CSS in `src/index.css`

## 📧 Contact

For any questions or suggestions regarding this portfolio, please reach out through the contact form on the website.

## 📄 License

This project is created for Eduardo's professional portfolio. All rights reserved.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
