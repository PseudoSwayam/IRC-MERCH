# IRC Merchandise Website 🤖

Official merchandise launch website for ITER Robotics Club (IRC).

## 🚀 Features

- **Stunning Hero Section**: Animated welcome screen with gradient effects and floating tech icons
- **3D Model Placeholder**: Space reserved for interactive 3D t-shirt model (Three.js integration coming soon)
- **Order Form**: Complete form with:
  - Custom name input for t-shirt personalization
  - Size selection (XS, S, M, L, XL, XXL)
  - QR code payment display
  - Payment screenshot upload
  - Form validation with Zod
- **Smooth Animations**: Framer Motion for scroll-based reveals and interactions
- **Lazy Loading**: Optimized performance with dynamic imports
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Icons**: Lucide React

## 📋 Development Phases

### ✅ Phase 1: UI/UX Frontend (Current)
- Hero section with animations
- 3D model placeholder section
- Complete order form with validation
- Responsive design

### 🔜 Phase 2: Backend Integration
- Firebase setup
- Firestore database for orders
- Firebase Storage for payment screenshots
- Order management system

### 🔜 Phase 3: 3D Model Integration
- Three.js with React Three Fiber
- Interactive 3D t-shirt model
- Real-time customization preview
- 360° rotation and zoom

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed (v18 or higher recommended).

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
IRC_MERCH/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Main page with lazy-loaded sections
│   └── globals.css         # Global styles and Tailwind imports
├── components/
│   ├── HeroSection.tsx     # Welcome/Hero section
│   ├── ModelPlaceholder.tsx # 3D model placeholder section
│   └── OrderForm.tsx       # Order form with payment
├── public/
│   └── models/             # 3D model files (to be added)
├── .github/
│   └── copilot-instructions.md
├── package.json
├── tailwind.config.ts      # Tailwind with custom IRC theme
├── tsconfig.json
└── next.config.js
```

## 🎨 Design System

### Colors
- **IRC Blue**: `#1e40af` - Primary brand color
- **IRC Cyan**: `#06b6d4` - Accent and highlights
- **IRC Dark**: `#0f172a` - Background
- **IRC Gray**: `#1e293b` - Secondary background

### Animations
- Float animation for floating elements
- Glow animation for neon effects
- Smooth scroll-based reveals
- Micro-interactions on buttons and inputs

## 🔧 Configuration

### Tailwind Custom Classes
Custom animations and colors are defined in `tailwind.config.ts`:
- `animate-float`: Floating animation
- `animate-glow`: Glowing effect for neon elements

### Next.js Config
Image optimization and build settings in `next.config.js`.

## 📝 Form Validation

The order form includes validation for:
- **Name**: 2-50 characters
- **Size**: Must select one of XS, S, M, L, XL, XXL
- **Payment Screenshot**: Required file upload

## 🌟 Performance Optimizations

1. **Lazy Loading**: Heavy components loaded only when needed
2. **Dynamic Imports**: Reduces initial bundle size
3. **Image Optimization**: Next.js automatic image optimization
4. **Code Splitting**: Automatic route-based code splitting
5. **Suspense Boundaries**: Loading states for async components

## 🔮 Upcoming Features

- [ ] Firebase backend integration
- [ ] Three.js 3D t-shirt model
- [ ] Real-time customization preview
- [ ] Admin dashboard for order management
- [ ] Email notifications
- [ ] Order tracking system

## 📄 License

This project is for ITER Robotics Club internal use.

## 🤝 Contributing

This is a club project. For contributions, contact the IRC team.

---

**Made with ⚡ by ITER Robotics Club**
