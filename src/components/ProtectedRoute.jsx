@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-soft-white text-charcoal font-english antialiased;
    background-image:
      radial-gradient(circle at top left, rgba(59, 130, 246, 0.06), transparent 22%),
      linear-gradient(180deg, #fafafa 0%, #f8fafc 100%);
  }

  ::selection {
    background: rgba(37, 99, 235, 0.18);
  }
}

@layer components {
  .btn-primary {
    @apply bg-deep-burgundy text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-opacity-90 hover:shadow-lg;
  }

  .btn-secondary {
    @apply border-2 border-deep-burgundy text-deep-burgundy px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-deep-burgundy hover:text-white;
  }

  .card-shadow {
    @apply shadow-md hover:shadow-xl transition-shadow duration-300;
  }
}
