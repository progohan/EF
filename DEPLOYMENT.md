# GitHub Pages Deployment Guide

This guide explains how to deploy Eduardo's portfolio website to GitHub Pages.

## Quick Deployment Steps

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and log in to your account.
2. Click the "+" icon in the top right corner and select "New repository".
3. Name your repository `EF`, or choose another repository name and update `base` in `vite.config.ts`.
4. Make sure the repository is public if you are using free GitHub Pages.
5. Do not initialize with README, `.gitignore`, or license because this repo already has them.
6. Click "Create repository".

### Step 2: Push Code to GitHub

After creating the repository, GitHub will show you commands to push existing code. Run these commands in your local project directory:

```bash
git remote add origin https://github.com/YOUR_USERNAME/EF.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub.
2. Click the "Settings" tab.
3. Select "Pages" in the left sidebar.
4. Under "Source", select "GitHub Actions".
5. The site will deploy using the included GitHub Actions workflow.

### Step 4: Access Your Website

After deployment completes, your website will be available at:

```text
https://YOUR_USERNAME.github.io/EF
```

## Advanced Configuration

### Custom Domain

To use a custom domain:

1. In your repository, go to Settings > Pages.
2. Under "Custom domain", enter your domain, such as `eduardo.yourdomain.com`.
3. Add a `CNAME` file to the repository root with your domain name.
4. Configure your domain DNS to point to `YOUR_USERNAME.github.io`.

### Automatic Deployment

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) automatically:

1. Triggers on every push to the `main` branch.
2. Installs dependencies with `npm ci`.
3. Builds the site with `npm run build`.
4. Uploads the `dist/` folder to GitHub Pages.

### Manual Deployment

If you prefer to deploy manually:

```bash
npm install
npm run build
```

Then push your changes:

```bash
git add .
git commit -m "Update portfolio"
git push
```

## Updating Content

### Portfolio Data

Edit `public/data.json` to update:

- Personal information
- Work experience
- Projects
- Skills
- Education

### Images

Replace or add image assets in `src/assets` or `public`. Use high-quality, optimized images for the public site.

### Styling

- Modify component files in `src/components/`.
- Update Tailwind classes for design changes.
- Add custom CSS in `src/index.css`.

## Monitoring

### Deployment Status

- Check deployment status in the "Actions" tab of your GitHub repository.
- A green check means deployment succeeded.
- A red X means deployment failed; check the workflow logs for details.

### Analytics

Add analytics by updating `index.html` or adding the relevant React integration, then rebuilding the project.

## Troubleshooting

### Build Fails

- Check GitHub Actions logs in the "Actions" tab.
- Ensure all dependencies are in `package.json`.
- Verify Node.js version compatibility.

### 404 Error

- Ensure GitHub Pages source is set to "GitHub Actions".
- Check if the repository is public when using free GitHub Pages.
- Verify the Vite `base` path matches the repository name.

### Styling Issues

- Clear browser cache.
- Check if all CSS files are properly built.
- Verify Tailwind CSS content paths include the source files.

## Repository Structure

```text
EF/
|-- .github/workflows/deploy.yml  # Automatic deployment
|-- dist/                         # Built files
|-- public/                       # Static assets
|-- src/                          # Source code
|-- README.md                     # Project documentation
|-- DEPLOYMENT.md                 # This file
`-- package.json                  # Dependencies and scripts
```

## Next Steps

After successful deployment:

1. Test all sections and links on the live website.
2. Verify responsive design on mobile devices.
3. Update the GitHub repository description.
4. Add topics and tags to the repository for discoverability.
5. Share the portfolio URL on LinkedIn and other professional networks.

---

For more details, check the GitHub Pages documentation or the workflow logs in this repository.
