// Mobile Navigation Toggle - Updated
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('header');
const navItems = document.querySelectorAll('.nav-links a');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
}

// Close mobile menu when clicking on a nav link
navItems.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Remove active class from all links
        navItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
    });
});

// Add scroll effect to header
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Active link based on scroll position
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY + 100;
    
    // Check each section's position and update active link
    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href') === `#${sectionId}`) {
                    item.classList.add('active');
                }
            });
        }
    });
});

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add Formspree AJAX handling (optional enhancement)
const contactForm = document.querySelector('.contact-form form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const messageInput = document.getElementById('message');
        
        let isValid = true;
        
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Name is required');
            isValid = false;
        } else {
            removeError(nameInput);
        }
        
        if (emailInput.value.trim() === '') {
            showError(emailInput, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(emailInput.value)) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else {
            removeError(emailInput);
        }
        
        if (messageInput.value.trim() === '') {
            showError(messageInput, 'Message is required');
            isValid = false;
        } else {
            removeError(messageInput);
        }
        
        if (isValid) {
            // Send form data to Formspree
            const formData = new FormData(contactForm);
            
            fetch('https://formspree.io/f/xqapgabz', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Show styled confirmation message instead of alert
                    showConfirmation();
                    contactForm.reset();
                } else {
                    // Show error message
                    response.json().then(data => {
                        alert('Submission failed: ' + (data.error || 'Please try again later.'));
                    });
                }
            })
            .catch(error => {
                alert('Submission failed: Please try again later.');
                console.error(error);
            });
        }
    });
}

function showError(input, message) {
    const formGroup = input.parentElement;
    let errorElement = formGroup.querySelector('.error-message');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.color = 'red';
        errorElement.style.fontSize = '0.85rem';
        errorElement.style.marginTop = '5px';
        formGroup.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    input.style.borderColor = 'red';
}

function removeError(input) {
    const formGroup = input.parentElement;
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        formGroup.removeChild(errorElement);
    }
    
    input.style.borderColor = '';
}

function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

// Scroll animation for elements
const fadeInElements = document.querySelectorAll('.feature-card, .product-card, .about-content, .about-image');

const fadeInOptions = {
    threshold: 0.3,
    rootMargin: "0px 0px -100px 0px"
};

const fadeInOnScroll = new IntersectionObserver(function(entries, fadeInOnScroll) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) {
            return;
        } else {
            entry.target.classList.add('fade-in');
            fadeInOnScroll.unobserve(entry.target);
        }
    });
}, fadeInOptions);

fadeInElements.forEach(element => {
    element.style.opacity = "0";
    element.style.transition = "opacity 0.5s ease-in, transform 0.6s ease-out";
    element.style.transform = "translateY(30px)";
    fadeInOnScroll.observe(element);
});

// Add this CSS style dynamically
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Lightbox functionality for product images
document.addEventListener("DOMContentLoaded", function() {
    // Get all product images
    const productImages = document.querySelectorAll('.product-image img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightbox = document.querySelector('.close-lightbox');
    
    // Add click event to each product image
    productImages.forEach(img => {
        img.addEventListener('click', function() {
            lightbox.style.display = 'block';
            lightboxImg.src = this.src;
            lightboxCaption.innerHTML = this.alt;
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Close lightbox when clicking the close button
    closeLightbox.addEventListener('click', function() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scrolling
    });
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scrolling
        }
    });
    
    // Close lightbox when pressing ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'block') {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto'; // Enable scrolling
        }
    });
});

// Add confirmation functions
function showConfirmation() {
    const confirmation = document.getElementById('formConfirmation');
    confirmation.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function hideConfirmation() {
    const confirmation = document.getElementById('formConfirmation');
    confirmation.style.display = 'none';
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

// Add event listeners for confirmation message
document.addEventListener('DOMContentLoaded', function() {
    const closeBtn = document.querySelector('.close-confirmation');
    const okBtn = document.getElementById('confirmationOkBtn');
    const confirmation = document.getElementById('formConfirmation');
    
    if (closeBtn && okBtn && confirmation) {
        closeBtn.addEventListener('click', hideConfirmation);
        okBtn.addEventListener('click', hideConfirmation);
        
        // Close when clicking outside the confirmation box
        confirmation.addEventListener('click', function(e) {
            if (e.target === confirmation) {
                hideConfirmation();
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && confirmation.style.display === 'flex') {
                hideConfirmation();
            }
        });
    }
});

// Gallery images lightbox
document.addEventListener("DOMContentLoaded", function() {
    // Add gallery images to the lightbox functionality
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    // Add click event to each gallery image
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            lightbox.style.display = 'block';
            lightboxImg.src = this.src;
            lightboxCaption.innerHTML = this.alt;
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
}); 
