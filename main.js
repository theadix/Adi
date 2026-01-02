// SocialBoost Pro - Pricing-First Interactive Calculator
(function() {
    'use strict';

    // Global variables
    let orderData = {};
    let totalPrice = 0;
    
    // DOM Elements
    const header = document.querySelector('.header');
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const orderSummary = document.getElementById('orderSummary');
    const totalPriceElement = document.getElementById('totalPrice');
    const summaryItems = document.getElementById('summaryItems');
    const orderWhatsAppBtn = document.getElementById('orderWhatsApp');
    const orderTelegramBtn = document.getElementById('orderTelegram');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    // Initialize the application
    function init() {
        setupHeaderScrollEffect();
        setupSmoothScrolling();
        setupActiveNavigation();
        setupPriceCalculator();
        setupOrderButtons();
        setupMobileMenu();
        setupScrollReveal();
        setupInputAnimations();
        setupFAQInteractions();
        setupInitialAnimations();
    }

    // Header scroll effect
    function setupHeaderScrollEffect() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    // Smooth scrolling for navigation links
    function setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link, .hero-cta a, .contact-buttons a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                
                if (targetId.startsWith('#')) {
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const headerHeight = header.offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                } else if (targetId.startsWith('http')) {
                    // External links (WhatsApp/Telegram)
                    window.open(targetId, '_blank');
                }
            });
        });
    }

    // Active navigation highlighting
    function setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        function updateActiveNav() {
            const scrollY = window.scrollY;
            const headerHeight = header.offsetHeight;
            
            sections.forEach(section => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - headerHeight - 100;
                const sectionId = section.getAttribute('id');
                
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        window.addEventListener('scroll', debounce(updateActiveNav, 100));
        updateActiveNav(); // Initial call
    }

    // Price calculator functionality
    function setupPriceCalculator() {
        quantityInputs.forEach(input => {
            // Add event listeners for real-time calculation
            input.addEventListener('input', handleQuantityChange);
            input.addEventListener('focus', handleInputFocus);
            input.addEventListener('blur', handleInputBlur);
            
            // Add number validation
            input.addEventListener('keypress', (e) => {
                if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete') {
                    e.preventDefault();
                }
            });
        });
    }

    // Handle quantity input changes
    function handleQuantityChange(e) {
        const input = e.target;
        const quantity = parseInt(input.value) || 0;
        const service = input.dataset.service;
        const rate = parseFloat(input.dataset.rate);
        const unit = parseInt(input.dataset.unit);
        
        // Calculate price
        const price = calculatePrice(quantity, rate, unit);
        
        // Update price display
        const priceDisplay = document.getElementById(`price-${service}`);
        if (priceDisplay) {
            priceDisplay.textContent = `₹${price.toLocaleString()}`;
            priceDisplay.setAttribute('data-price', price);
            
            // Add animation
            priceDisplay.style.transform = 'scale(1.1)';
            setTimeout(() => {
                priceDisplay.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Update order data
        if (quantity > 0) {
            orderData[service] = {
                quantity: quantity,
                price: price,
                rate: rate,
                unit: unit,
                name: getServiceName(service)
            };
        } else {
            delete orderData[service];
        }
        
        // Update order summary
        updateOrderSummary();
        
        // Show/hide order summary
        toggleOrderSummary();
    }

    // Calculate price based on quantity, rate, and unit
    function calculatePrice(quantity, rate, unit) {
        if (quantity <= 0) return 0;
        return Math.ceil((quantity / unit) * rate);
    }

    // Get service display name
    function getServiceName(service) {
        const serviceNames = {
            'instagram-followers': 'Instagram Followers',
            'instagram-likes': 'Instagram Likes',
            'instagram-views': 'Instagram Reel Views',
            'instagram-story-views': 'Instagram Story Views',
            'instagram-comments': 'Instagram Comments',
            'youtube-views': 'YouTube Views',
            'youtube-subscribers': 'YouTube Subscribers',
            'youtube-comments': 'YouTube Comments',
            'facebook-followers': 'Facebook Followers',
            'facebook-likes': 'Page Likes',
            'facebook-engagement': 'Post Engagement'
        };
        return serviceNames[service] || service;
    }

    // Update order summary
    function updateOrderSummary() {
        const items = Object.entries(orderData);
        totalPrice = items.reduce((sum, [_, data]) => sum + data.price, 0);
        
        // Update total price
        totalPriceElement.textContent = `₹${totalPrice.toLocaleString()}`;
        
        // Update items list
        if (items.length === 0) {
            summaryItems.innerHTML = '<p class="no-items">No items selected</p>';
        } else {
            const itemsHTML = items.map(([service, data]) => `
                <div class="summary-item">
                    <span class="summary-item-name">${data.name} (${data.quantity.toLocaleString()})</span>
                    <span class="summary-item-price">₹${data.price.toLocaleString()}</span>
                </div>
            `).join('');
            summaryItems.innerHTML = itemsHTML;
        }
        
        // Update order buttons state
        updateOrderButtons();
    }

    // Toggle order summary visibility
    function toggleOrderSummary() {
        const hasItems = Object.keys(orderData).length > 0;
        
        if (hasItems) {
            orderSummary.classList.add('show');
        } else {
            orderSummary.classList.remove('show');
        }
    }

    // Update order buttons state
    function updateOrderButtons() {
        const hasItems = Object.keys(orderData).length > 0;
        
        orderWhatsAppBtn.disabled = !hasItems;
        orderTelegramBtn.disabled = !hasItems;
        
        if (hasItems) {
            orderWhatsAppBtn.style.opacity = '1';
            orderTelegramBtn.style.opacity = '1';
            orderWhatsAppBtn.style.cursor = 'pointer';
            orderTelegramBtn.style.cursor = 'pointer';
        } else {
            orderWhatsAppBtn.style.opacity = '0.6';
            orderTelegramBtn.style.opacity = '0.6';
            orderWhatsAppBtn.style.cursor = 'not-allowed';
            orderTelegramBtn.style.cursor = 'not-allowed';
        }
    }

    // Handle input focus/blur for animations
    function handleInputFocus(e) {
        const input = e.target;
        input.style.borderColor = 'var(--primary-color)';
        input.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
    }

    function handleInputBlur(e) {
        const input = e.target;
        input.style.borderColor = '#e5e7eb';
        input.style.boxShadow = 'none';
    }

    // Setup order buttons
    function setupOrderButtons() {
        orderWhatsAppBtn.addEventListener('click', () => {
            if (Object.keys(orderData).length > 0) {
                sendWhatsAppOrder();
            }
        });
        
        orderTelegramBtn.addEventListener('click', () => {
            if (Object.keys(orderData).length > 0) {
                sendTelegramOrder();
            }
        });
    }

    // Send WhatsApp order
    function sendWhatsAppOrder() {
        const message = generateOrderMessage('WhatsApp');
        const phoneNumber = '919122294466';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    // Send Telegram order
    function sendTelegramOrder() {
        const message = generateOrderMessage('Telegram');
        const username = 'the_adix';
        const telegramUrl = `https://t.me/${username}?text=${encodeURIComponent(message)}`;
        window.open(telegramUrl, '_blank');
    }

    // Generate order message
    function generateOrderMessage(platform) {
        let message = `🚀 *SocialBoost Pro Order*\n\n`;
        message += `📋 *Order Details:*\n\n`;
        
        Object.entries(orderData).forEach(([service, data]) => {
            message += `• ${data.name}: ${data.quantity.toLocaleString()} units = ₹${data.price.toLocaleString()}\n`;
        });
        
        message += `\n💰 *Total Amount: ₹${totalPrice.toLocaleString()}*\n\n`;
        message += `⚡ *Delivery: Within 1 Hour*\n\n`;
        message += `👋 Hi! I'd like to place this order. Please confirm availability and payment details.`;
        
        return message;
    }

    // Mobile menu functionality
    function setupMobileMenu() {
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('mobile-active');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            });
        }
        
        // Close mobile menu when clicking on links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navLinks.classList.remove('mobile-active');
                    const icon = mobileMenuToggle.querySelector('i');
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }

    // Scroll reveal animations
    function setupScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.calculator-card, .feature-card, .metric-item, .faq-item, .order-summary');
        animateElements.forEach(el => observer.observe(el));
    }

    // Input animations
    function setupInputAnimations() {
        quantityInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                if (e.target.value > 0) {
                    e.target.classList.add('pulse');
                    setTimeout(() => {
                        e.target.classList.remove('pulse');
                    }, 1000);
                }
            });
        });
    }

    // FAQ interactions
    function setupFAQInteractions() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                answer.style.display = answer.style.display === 'none' ? 'block' : 'none';
                item.classList.toggle('active');
            });
            
            // Initially hide answers
            answer.style.display = 'none';
        });
    }

    // Initial animations
    function setupInitialAnimations() {
        // Add loading animation to calculator cards
        const calculatorCards = document.querySelectorAll('.calculator-card');
        calculatorCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Utility functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize the application when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose global functions for external use
    window.SocialBoostPro = {
        scrollToSection: function(sectionId) {
            const element = document.querySelector(sectionId);
            if (element) {
                const headerHeight = header.offsetHeight;
                const targetPosition = element.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        },
        calculatePrice: calculatePrice,
        updateOrderSummary: updateOrderSummary
    };

})();