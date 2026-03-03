# Cascarino's Pizzeria - Quick Customization Guide

This guide provides quick copy-paste solutions for the most common customizations needed.

---

## 📱 Update Contact Information

### Find & Replace in `index.html`
Replace ALL instances of:

```
212-555-1234  →  YOUR PHONE NUMBER
info@cascarinospizzeria.com  →  YOUR EMAIL
123 Mulberry Street, New York, NY 10012  →  YOUR ADDRESS
Cascarino's Pizzeria  →  YOUR BUSINESS NAME (in title, headers, etc.)
```

### Update Google Maps Link
Find this line in `index.html` (around line 230):
```html
<a href="https://maps.google.com/?q=123+Mulberry+Street,+New+York,+NY+10012" target="_blank">
```

Replace with your address in the URL format (use + instead of spaces):
```html
<a href="https://maps.google.com/?q=YOUR+ADDRESS+HERE" target="_blank">
```

### Update Google Maps Embed
Find the iframe around line 245:
```html
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.1852534375806!2d-73.99796592346922!3d40.71620571105883..."></iframe>
```

To find your embed code:
1. Go to Google Maps: https://maps.google.com
2. Search for your address
3. Click "Share" button
4. Click "Embed a map"
5. Copy the iframe code
6. Replace the entire iframe in the HTML

---

## 🎨 Change Colors

### In `styles.css`, update these CSS variables (lines 7-14):

```css
:root {
    --primary-dark: #1a1a1a;      /* Dark background - change to your color */
    --secondary-dark: #2a2a2a;    /* Section backgrounds */
    --accent-cream: #f5f1e8;      /* Light text/highlights */
    --accent-red: #c41e3a;        /* Primary red accent */
    --accent-gold: #d4af37;       /* Gold for star ratings */
    --text-light: #e8e4d8;        /* Body text */
    --text-muted: #b0a898;        /* Secondary text */
}
```

### Example: Change accent color to gold
```css
--accent-red: #d4af37;  /* Was #c41e3a */
```

### Find colors for inspiration:
- Color picker: https://htmlcolorcodes.com/
- Palette generator: https://coolors.co/
- Material Design colors: https://material.io/resources/color/

---

## ✏️ Update Business Hours

### In `index.html`, find the hours section (around line 222):

```html
<ul class="hours-list">
    <li><span>Monday - Thursday:</span> <span>11:00 AM - 11:00 PM</span></li>
    <li><span>Friday - Saturday:</span> <span>11:00 AM - 12:00 AM</span></li>
    <li><span>Sunday:</span> <span>12:00 PM - 11:00 PM</span></li>
</ul>
```

Change times to your actual hours. Example:
```html
<li><span>Monday - Thursday:</span> <span>12:00 PM - 10:00 PM</span></li>
```

### Also update in `index.html` JSON-LD structured data (around line 260):

```javascript
"openingHoursSpecification": [
    {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday"],
        "opens": "11:00",
        "closes": "23:00"
    },
    // ... etc
]
```

Use 24-hour format (11:00 = 11 AM, 23:00 = 11 PM)

---

## 🍕 Update Menu Categories

### In `index.html`, find menu cards section (around line 107):

```html
<div class="menu-card">
    <div class="menu-icon">🍕</div>
    <h3>Pizza</h3>
    <p>Classic Neapolitan and New York style pizzas...</p>
    <a href="#" class="card-link">View Pizza Menu →</a>
</div>
```

Change the emoji (icon), title, description, and link. Examples:

```html
<!-- Desserts -->
<div class="menu-card">
    <div class="menu-icon">🍰</div>
    <h3>Desserts</h3>
    <p>Authentic Italian desserts including tiramisu and panna cotta.</p>
    <a href="#" class="card-link">View Desserts →</a>
</div>

<!-- Beverages -->
<div class="menu-card">
    <div class="menu-icon">🥤</div>
    <h3>Beverages</h3>
    <p>Italian sodas, wines, and craft beers.</p>
    <a href="#" class="card-link">View Beverages →</a>
</div>
```

---

## ⭐ Update Customer Reviews

### In `index.html`, find reviews section (around line 172):

```html
<div class="review-card">
    <div class="stars">
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
    </div>
    <p class="review-text">"Your review text here..."</p>
    <div class="review-author">
        <strong>Customer Name</strong>
        <span class="review-date">Verified Customer</span>
    </div>
</div>
```

Replace with your actual review. Example:

```html
<div class="review-card">
    <div class="stars">
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
        <span class="star">★</span>
    </div>
    <p class="review-text">"Best pizza I've had in 10 years! The crust is perfectly crispy and the ingredients are so fresh. Will definitely be coming back!"</p>
    <div class="review-author">
        <strong>John Smith</strong>
        <span class="review-date">Verified Customer</span>
    </div>
</div>
```

---

## 🖼️ Update Images

### Hero Image
Find in `index.html` (line 65):
```html
<img src="https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=1920&h=1080&fit=crop" alt="..." class="hero-image">
```

Replace the URL with your image. Use services like:
- Unsplash: https://unsplash.com/
- Pexels: https://www.pexels.com/
- Pixabay: https://pixabay.com/

Or use your own image URL.

### Featured Item Image
Find in `index.html` (line 68):
```html
<img src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&h=600&fit=crop" alt="...">
```

Replace with your image URL. Recommended size: 600x600px

### Update Alt Text
Always update the `alt=""` attribute with descriptive text:
```html
<!-- Bad -->
<img src="..." alt="">

<!-- Good -->
<img src="..." alt="Delicious wood-fired pizza with fresh mozzarella">
```

---

## 📝 Update Featured Item Section

### In `index.html` (around line 71):

```html
<h2 class="section-title">Our Signature Specialty</h2>
<h3 class="featured-name">Focaccia al Tartufo</h3>
<p class="featured-description">
    Elevate your meal with our signature Focaccia...
</p>
<ul class="featured-highlights">
    <li><strong>Premium Truffle Oil:</strong> Imported from Piedmont, Italy</li>
    <!-- ... -->
</ul>
```

Replace with your featured item:

```html
<h2 class="section-title">Our Signature Specialty</h2>
<h3 class="featured-name">Margherita Supreme</h3>
<p class="featured-description">
    Our most acclaimed pizza. San Marzano tomatoes, fresh buffalo mozzarella, 
    basil, and olive oil on a wood-fired crust.
</p>
<ul class="featured-highlights">
    <li><strong>San Marzano Tomatoes:</strong> Direct from Naples, Italy</li>
    <li><strong>Buffalo Mozzarella:</strong> Imported fresh</li>
    <li><strong>Hand-Tossed Dough:</strong> Prepared fresh hourly</li>
    <li><strong>Wood-Fired:</strong> Cooked at 900°F</li>
</ul>
```

---

## 🏙️ Update About Section

### In `index.html` (around line 139):

```html
<h2 class="section-title">Our Story</h2>
<div class="about-text">
    <p>
        Cascarino's Pizzeria was founded in 1989 by Giuseppe and Maria Cascarino...
    </p>
    <!-- ... more paragraphs ... -->
</div>
```

Replace with your business story. Example:

```html
<h2 class="section-title">Our Story</h2>
<div class="about-text">
    <p>
        Founded in 2010, Joe's Pizza has been a neighborhood staple for over 10 years.
        Our commitment to quality, authenticity, and customer satisfaction defines everything we do.
    </p>
    <p>
        We start fresh every morning, preparing our dough using time-honored techniques 
        passed down through our family. Every ingredient is carefully selected to ensure 
        the highest quality.
    </p>
    <p>
        We're proud to be part of this community and grateful for the support of our 
        loyal customers who keep us going.
    </p>
</div>
```

### Update stats (around line 152):

```html
<div class="stat">
    <div class="stat-number">35+</div>
    <div class="stat-label">Years of Excellence</div>
</div>
```

Change the numbers to match your business:

```html
<div class="stat">
    <div class="stat-number">10+</div>
    <div class="stat-label">Years in Business</div>
</div>
<div class="stat">
    <div class="stat-number">50K+</div>
    <div class="stat-label">Pizzas Served</div>
</div>
<div class="stat">
    <div class="stat-number">5,000+</div>
    <div class="stat-label">Regular Customers</div>
</div>
```

---

## 🔗 Update Social Media & Delivery Links

### In `index.html`, find social links in footer (around line 265):

```html
<div class="social-links">
    <a href="#" aria-label="Facebook">f</a>
    <a href="#" aria-label="Instagram">📷</a>
    <a href="#" aria-label="Twitter">𝕏</a>
</div>
```

Replace with your links:

```html
<div class="social-links">
    <a href="https://www.facebook.com/yourpage" aria-label="Facebook">f</a>
    <a href="https://www.instagram.com/yourprofile" aria-label="Instagram">📷</a>
    <a href="https://twitter.com/yourhandle" aria-label="Twitter">𝕏</a>
</div>
```

### Update delivery platform links (around line 255):

```html
<a href="#" class="btn btn-secondary">Grubhub</a>
<a href="#" class="btn btn-secondary">DoorDash</a>
<a href="#" class="btn btn-secondary">Uber Eats</a>
```

Replace with your links:

```html
<a href="https://www.grubhub.com/restaurant/your-pizzeria" class="btn btn-secondary">Grubhub</a>
<a href="https://www.doordash.com/restaurant/your-pizzeria" class="btn btn-secondary">DoorDash</a>
<a href="https://www.ubereats.com/restaurant/your-pizzeria" class="btn btn-secondary">Uber Eats</a>
```

---

## 🔤 Change Fonts

### In `styles.css`, find font declarations:

**Headline fonts** (around line 41):
```css
h1, h2, h3, h4, h5, h6 {
    font-family: 'Georgia', 'Garamond', serif;  /* Change this */
}
```

**Body fonts** (around line 33):
```css
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;  /* Change this */
}
```

### Popular combinations:
```css
/* Modern & Clean */
font-family: 'Inter', 'Helvetica Neue', sans-serif;

/* Elegant & Traditional */
font-family: 'Playfair Display', 'Georgia', serif;

/* Fun & Casual */
font-family: 'Comic Sans MS', cursive;

/* Professional */
font-family: 'Roboto', 'Arial', sans-serif;
```

Import from Google Fonts (add to `<head>` in HTML):
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
```

---

## 📧 Update Schema.org Data

### In `index.html`, find JSON-LD schema (around line 250):

```javascript
{
    "@type": "Restaurant",
    "name": "Cascarino's Pizzeria",
    "telephone": "+12125551234",
    "email": "info@cascarinospizzeria.com",
    "address": {
        "streetAddress": "123 Mulberry Street",
        "addressLocality": "New York",
        "addressRegion": "NY",
        "postalCode": "10012"
    },
    "geo": {
        "latitude": "40.7162",
        "longitude": "-73.9980"
    }
}
```

Update all values to match your business. Find your coordinates:
1. Go to Google Maps
2. Right-click your address
3. First number = latitude, second = longitude

---

## 🎯 Update Meta Tags for SEO

### In `index.html` `<head>` section (lines 5-8):

```html
<meta name="description" content="Cascarino's Pizzeria - Authentic New York Pizza...">
<meta name="keywords" content="New York pizza, authentic pizza, Manhattan pizzeria...">
<meta property="og:title" content="Cascarino's Pizzeria - Authentic New York Pizza">
<meta property="og:description" content="Experience authentic New York pizza...">
```

### Update with your information:
- **Description**: 155-160 characters, compelling summary
- **Keywords**: Comma-separated relevant terms
- **OG Title**: What appears on social media when shared
- **OG Description**: Preview text on social media

Example:
```html
<meta name="description" content="Joe's Pizza - Authentic New York pizza in Boston since 2010. Fresh daily with premium ingredients.">
<meta name="keywords" content="Boston pizza, New York style pizza, authentic pizza, wood-fired pizza">
<meta property="og:title" content="Joe's Pizza - Best Pizza in Boston">
<meta property="og:description" content="Authentic New York pizza made fresh daily with premium ingredients.">
```

---

## 🌙 Enable Dark Mode Detection (Optional)

### In `script.js`, uncomment line ~290:

```javascript
// Uncomment to enable dark mode detection
initDarkMode();
```

Remove the `//` to enable:
```javascript
initDarkMode();
```

---

## 📊 Add Google Analytics

### In `index.html`, add this before closing `</head>` tag:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

Replace `GA_MEASUREMENT_ID` with your Google Analytics 4 ID (find in Analytics > Data streams)

---

## 🚀 Quick Deployment Steps

1. **Update all content** using guides above
2. **Optimize images** (compress them)
3. **Test on mobile** (use Chrome DevTools)
4. **Validate HTML** (use https://validator.w3.org/)
5. **Check links** (make sure all are working)
6. **Upload files** to your web server
7. **Test live website** thoroughly
8. **Submit to Google Search Console**
9. **Submit to Google Business Profile**

---

## ✅ Need Help?

All sections are clearly labeled with line numbers. Use Ctrl+G in your code editor to jump to specific lines.

Look for comments like:
```html
<!-- Hero Section -->
<!-- Navigation -->
<!-- Featured Section -->
<!-- Menu Preview -->
<!-- About Section -->
```

These mark the beginning of each major section.

---

**Happy customizing! 🍕**
