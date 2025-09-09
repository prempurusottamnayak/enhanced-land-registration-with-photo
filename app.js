// Professional Blockchain Land Registration System - Enhanced JavaScript with Photo Upload (FIXED)

class ProfessionalLandChainRegistry {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 5;
        this.currentTab = 'registration';
        this.currentTheme = 'corporate';
        this.properties = this.loadPropertiesFromStorage();
        this.certificates = this.loadCertificatesFromStorage();
        this.registrationData = {};
        this.currentPropertyData = null;
        this.ownerPhotoData = null;
        
        // Canvas and animation properties
        this.canvas = null;
        this.ctx = null;
        this.animationFrame = null;
        this.particles = [];
        this.connections = [];
        this.mousePosition = { x: 0, y: 0 };
        
        // Photo settings
        this.photoSettings = {
            maxFileSize: 31457280, // 30MB
            allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
            compressionQuality: 0.8,
            maxWidth: 800,
            maxHeight: 800
        };
        
        // Theme configurations
        this.themes = {
            corporate: {
                name: 'Corporate Professional',
                colors: ['#0A0E27', '#1A1B3A', '#2D2E5F', '#4A4E8A'],
                accent: '#00D9FF',
                particleCount: 30,
                connectionDistance: 120,
                animationType: 'floating'
            },
            blockchain: {
                name: 'Blockchain Network',
                colors: ['#0F1419', '#1C2432', '#2A3441', '#3B4A5C'],
                accent: '#FFD700',
                particleCount: 50,
                connectionDistance: 150,
                animationType: 'network'
            },
            futuristic: {
                name: 'Futuristic Tech',
                colors: ['#0D1117', '#161B22', '#21262D', '#30363D'],
                accent: '#7C3AED',
                particleCount: 40,
                connectionDistance: 100,
                animationType: 'geometric'
            },
            elegant: {
                name: 'Elegant Minimal',
                colors: ['#111827', '#1F2937', '#374151', '#4B5563'],
                accent: '#10B981',
                particleCount: 20,
                connectionDistance: 80,
                animationType: 'minimal'
            }
        };
        
        // Certificate template data
        this.certificateTemplate = {
            companyName: "LandChain Registry",
            tagline: "Professional Blockchain-Secured Land Registration Authority",
            logo: "🏛️",
            officialSeal: "⚡",
            signatoryName: "Director of Land Registration",
            signatoryTitle: "Authorized Blockchain Registrar",
            legalText: "This certificate is issued under the authority of the Professional Blockchain Land Registration Act 2025 and serves as legal proof of property ownership.",
            verificationUrl: "https://landchain.gov/verify/",
            helpdesk: "+91-1800-LAND-REG"
        };

        // Sample data with photo
        this.sampleData = {
            "sampleLandRecords": [
                {
                    "id": "LAND001",
                    "registrationNumber": "REG2025001",
                    "certificateId": "CERT2025001",
                    "ownerName": "Arjun Patel",
                    "ownerNIC": "123456789012",
                    "ownerPhone": "+91-98765-43210",
                    "ownerEmail": "arjun.patel@email.com",
                    "propertyAddress": "Villa 42, Tech City, Whitefield, Bangalore",
                    "district": "Bangalore Urban",
                    "province": "Karnataka",
                    "landSize": 0.25,
                    "landType": "Residential",
                    "coordinates": {"latitude": 12.9716, "longitude": 77.5946},
                    "registrationDate": "2025-09-01",
                    "lastVerified": "2025-09-08",
                    "blockHash": "a7f3e9d2b8c5",
                    "previousHash": "0000000000000",
                    "transactionHash": "tx7f3e9d2b8c5",
                    "isVerified": true,
                    "ownerPhoto": null
                },
                {
                    "id": "LAND002",
                    "registrationNumber": "REG2025002",
                    "certificateId": "CERT2025002",
                    "ownerName": "Priya Sharma",
                    "ownerNIC": "987654321098",
                    "ownerPhone": "+91-87654-32109",
                    "ownerEmail": "priya.sharma@email.com",
                    "propertyAddress": "Farm House 45, Agricultural Zone, Mumbai Outskirts",
                    "district": "Thane",
                    "province": "Maharashtra",
                    "landSize": 5.0,
                    "landType": "Agricultural",
                    "coordinates": {"latitude": 19.2183, "longitude": 72.9781},
                    "registrationDate": "2025-08-15",
                    "lastVerified": "2025-09-07",
                    "blockHash": "b2c3d4e5f6g7",
                    "previousHash": "a7f3e9d2b8c5",
                    "transactionHash": "tx987654321",
                    "isVerified": true,
                    "ownerPhoto": null
                }
            ]
        };

        this.init();
    }

    init() {
        this.initializeStorage();
        this.showLoadingScreen();
        this.initializeCanvas();
        setTimeout(() => {
            this.hideLoadingScreen();
            this.startBackgroundAnimation();
            // Setup event listeners after DOM is ready
            this.setupEventListeners();
            this.setupPhotoUpload();
        }, 4000);
    }

    initializeStorage() {
        if (this.properties.length === 0) {
            this.properties = this.sampleData.sampleLandRecords;
            this.savePropertiesToStorage();
        }
        
        // Initialize certificates for existing properties
        this.properties.forEach(property => {
            if (!this.certificates.find(cert => cert.registrationNumber === property.registrationNumber)) {
                this.certificates.push({
                    ...property,
                    certificateId: property.certificateId || this.generateCertificateId(),
                    issueDate: property.registrationDate,
                    qrCode: null
                });
            }
        });
        this.saveCertificatesToStorage();
    }

    // Photo Upload System
    setupPhotoUpload() {
        const photoInput = document.getElementById('ownerPhoto');
        const dropZone = document.getElementById('photoDropZone');

        if (!photoInput || !dropZone) return;

        // File input change handler
        photoInput.addEventListener('change', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (e.target.files && e.target.files[0]) {
                this.handlePhotoFile(e.target.files[0]);
            }
        });

        // Drag and drop handlers
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handlePhotoFile(files[0]);
            }
        });

        // Click handler for drop zone
        dropZone.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            photoInput.click();
        });
    }

    async handlePhotoFile(file) {
        // Clear previous errors
        this.hidePhotoError();

        // Validate file
        const validation = this.validatePhotoFile(file);
        if (!validation.valid) {
            this.showPhotoError(validation.error);
            return;
        }

        try {
            // Show loading state
            this.showPhotoProcessing();

            // Compress and convert to base64
            const compressedPhoto = await this.compressPhoto(file);
            
            // Store photo data
            this.ownerPhotoData = {
                data: compressedPhoto,
                fileName: file.name,
                fileSize: file.size,
                originalFile: file
            };

            // Show preview
            this.showPhotoPreview(compressedPhoto, file);
            
            this.showToast('Photo uploaded and processed successfully!', 'success');
            
        } catch (error) {
            console.error('Photo processing error:', error);
            this.showPhotoError('Failed to process photo. Please try again.');
        }
    }

    validatePhotoFile(file) {
        // Check file type
        if (!this.photoSettings.allowedFormats.includes(file.type)) {
            return {
                valid: false,
                error: 'Invalid file format. Please use JPG, PNG, or WEBP format.'
            };
        }

        // Check file size
        if (file.size > this.photoSettings.maxFileSize) {
            return {
                valid: false,
                error: 'File size too large. Maximum size allowed is 30MB.'
            };
        }

        return { valid: true };
    }

    async compressPhoto(file) {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // Calculate dimensions while maintaining aspect ratio
                let { width, height } = img;
                const maxWidth = this.photoSettings.maxWidth;
                const maxHeight = this.photoSettings.maxHeight;

                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;

                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to base64 with compression
                const compressedDataUrl = canvas.toDataURL('image/jpeg', this.photoSettings.compressionQuality);
                resolve(compressedDataUrl);
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = URL.createObjectURL(file);
        });
    }

    showPhotoPreview(photoData, file) {
        const previewSection = document.getElementById('photoPreviewSection');
        const previewImage = document.getElementById('photoPreview');
        const fileName = document.getElementById('photoFileName');
        const fileSize = document.getElementById('photoFileSize');
        const dropZone = document.getElementById('photoDropZone');

        if (previewImage) {
            previewImage.src = photoData;
        }

        if (fileName) {
            fileName.textContent = file.name;
        }

        if (fileSize) {
            fileSize.textContent = this.formatFileSize(file.size);
        }

        if (previewSection) {
            previewSection.classList.remove('hidden');
        }

        if (dropZone) {
            dropZone.style.display = 'none';
        }
    }

    showPhotoProcessing() {
        const dropZone = document.getElementById('photoDropZone');
        if (dropZone) {
            const content = dropZone.querySelector('.drop-zone-content');
            if (content) {
                content.innerHTML = `
                    <i class="fas fa-spinner fa-spin upload-icon"></i>
                    <h4>Processing Photo...</h4>
                    <p>Please wait while we process your image</p>
                `;
            }
        }
    }

    showPhotoError(message) {
        const errorElement = document.getElementById('photoErrorMessage');
        if (errorElement) {
            errorElement.querySelector('span').textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    hidePhotoError() {
        const errorElement = document.getElementById('photoErrorMessage');
        if (errorElement) {
            errorElement.classList.add('hidden');
        }
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Canvas Background Animation System
    initializeCanvas() {
        this.canvas = document.getElementById('background-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
        window.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
        });
        
        this.initializeParticles();
    }

    resizeCanvas() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initializeParticles() {
        const theme = this.themes[this.currentTheme];
        this.particles = [];
        
        for (let i = 0; i < theme.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.8 + 0.2,
                color: theme.colors[Math.floor(Math.random() * theme.colors.length)],
                pulsePhase: Math.random() * Math.PI * 2
            });
        }
    }

    startBackgroundAnimation() {
        if (!this.ctx) return;
        
        const animate = () => {
            this.clearCanvas();
            this.updateParticles();
            this.drawParticles();
            this.drawConnections();
            this.drawGeometricShapes();
            
            this.animationFrame = requestAnimationFrame(animate);
        };
        
        animate();
    }

    clearCanvas() {
        const theme = this.themes[this.currentTheme];
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        
        gradient.addColorStop(0, theme.colors[0]);
        gradient.addColorStop(0.5, theme.colors[1]);
        gradient.addColorStop(1, theme.colors[2]);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateParticles() {
        const theme = this.themes[this.currentTheme];
        
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Boundary collision
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Keep in bounds
            particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
            particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
            
            // Update pulse
            particle.pulsePhase += 0.02;
            
            // Mouse interaction
            const dx = this.mousePosition.x - particle.x;
            const dy = this.mousePosition.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100 * 0.01;
                particle.vx += dx * force * 0.01;
                particle.vy += dy * force * 0.01;
            }
        });
    }

    drawParticles() {
        const theme = this.themes[this.currentTheme];
        
        this.particles.forEach(particle => {
            this.ctx.save();
            
            // Pulsing effect
            const pulse = Math.sin(particle.pulsePhase) * 0.3 + 0.7;
            const alpha = particle.opacity * pulse;
            
            // Glow effect
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = theme.accent;
            
            this.ctx.globalAlpha = alpha;
            this.ctx.fillStyle = particle.color;
            
            this.ctx.beginPath();
            
            if (theme.animationType === 'geometric') {
                // Draw hexagons for futuristic theme
                this.drawHexagon(particle.x, particle.y, particle.size * pulse);
            } else {
                // Draw circles for other themes
                this.ctx.arc(particle.x, particle.y, particle.size * pulse, 0, Math.PI * 2);
            }
            
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawConnections() {
        const theme = this.themes[this.currentTheme];
        
        if (theme.animationType !== 'network' && theme.animationType !== 'geometric') return;
        
        this.ctx.save();
        this.ctx.strokeStyle = theme.accent;
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < theme.connectionDistance) {
                    const opacity = (theme.connectionDistance - distance) / theme.connectionDistance * 0.3;
                    this.ctx.globalAlpha = opacity;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        this.ctx.restore();
    }

    drawGeometricShapes() {
        const theme = this.themes[this.currentTheme];
        
        if (theme.animationType !== 'geometric' && theme.animationType !== 'floating') return;
        
        this.ctx.save();
        this.ctx.strokeStyle = theme.accent;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.1;
        
        // Draw grid pattern
        const gridSize = 50;
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }

    drawHexagon(x, y, size) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const hx = x + size * Math.cos(angle);
            const hy = y + size * Math.sin(angle);
            if (i === 0) {
                this.ctx.moveTo(hx, hy);
            } else {
                this.ctx.lineTo(hx, hy);
            }
        }
        this.ctx.closePath();
    }

    // Theme Switching System
    setupThemeSystem() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeOptions = document.getElementById('theme-options');
        const themeOptionButtons = document.querySelectorAll('.theme-option');

        if (themeToggle && themeOptions) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                themeOptions.classList.toggle('hidden');
            });

            document.addEventListener('click', (e) => {
                if (!themeToggle.contains(e.target) && !themeOptions.contains(e.target)) {
                    themeOptions.classList.add('hidden');
                }
            });
        }

        themeOptionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const theme = e.currentTarget.getAttribute('data-theme');
                this.switchTheme(theme);
                themeOptions.classList.add('hidden');
            });
        });
    }

    switchTheme(themeName) {
        if (!this.themes[themeName]) return;
        
        this.currentTheme = themeName;
        const theme = this.themes[themeName];
        
        // Update CSS custom properties
        const root = document.documentElement;
        root.style.setProperty('--current-primary', theme.colors[0]);
        root.style.setProperty('--current-secondary', theme.colors[1]);
        root.style.setProperty('--current-accent', theme.accent);
        root.style.setProperty('--current-highlight', theme.colors[2]);
        
        // Update background overlay gradient
        const overlay = document.querySelector('.background-overlay');
        if (overlay) {
            overlay.style.background = `linear-gradient(135deg, 
                ${theme.colors[0]}30 0%, 
                ${theme.colors[1]}20 50%, 
                ${theme.colors[2]}30 100%)`;
        }
        
        // Reinitialize particles with new theme
        this.initializeParticles();
        
        this.showToast(`Switched to ${theme.name} theme`, 'success');
        
        // Save theme preference
        localStorage.setItem('landchain_theme', themeName);
    }

    loadThemePreference() {
        const savedTheme = localStorage.getItem('landchain_theme');
        if (savedTheme && this.themes[savedTheme]) {
            this.switchTheme(savedTheme);
        }
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen) loadingScreen.style.display = 'flex';
        if (app) app.classList.add('hidden');
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            loadingScreen.style.visibility = 'hidden';
        }
        
        setTimeout(() => {
            if (loadingScreen) loadingScreen.style.display = 'none';
            if (app) app.classList.remove('hidden');
            this.initializeDashboard();
            this.setupThemeSystem();
            this.loadThemePreference();
        }, 800);
    }

    setupEventListeners() {
        // Tab navigation - FIXED
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const tabName = e.currentTarget.getAttribute('data-tab');
                if (tabName) {
                    this.switchTab(tabName);
                }
            });
        });

        // Registration form validation - FIXED
        const registrationForm = document.getElementById('registration-form');
        if (registrationForm) {
            const inputs = registrationForm.querySelectorAll('.form-control');
            inputs.forEach(input => {
                // Clear any existing event listeners first
                input.removeEventListener('blur', this.validateFieldHandler);
                input.removeEventListener('input', this.clearErrorsHandler);
                
                // Add properly bound event listeners
                const validateHandler = (e) => this.validateField(e.target);
                const clearHandler = (e) => this.clearErrors(e.target);
                
                input.addEventListener('blur', validateHandler);
                input.addEventListener('input', clearHandler);
            });
        }

        // Verification form
        const verificationForm = document.getElementById('verification-form');
        if (verificationForm) {
            verificationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.verifyProperty();
            });
        }

        // Dashboard filters
        const searchInput = document.getElementById('search-properties');
        const filterType = document.getElementById('filter-type');
        
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterProperties());
        }
        
        if (filterType) {
            filterType.addEventListener('change', () => this.filterProperties());
        }

        // Mobile menu
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        // Modal close handlers
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCertificateModal();
            }
        });
    }

    switchTab(tabName) {
        if (!tabName) return;
        
        // Update nav tabs
        const navTabs = document.querySelectorAll('.nav-tab');
        navTabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === tabName) {
                tab.classList.add('active');
            }
        });

        // Update content sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        const activeSection = document.getElementById(tabName);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        this.currentTab = tabName;

        // Initialize specific sections
        if (tabName === 'dashboard') {
            setTimeout(() => this.initializeDashboard(), 100);
        } else if (tabName === 'certificates') {
            setTimeout(() => this.initializeCertificatesTab(), 100);
        }
    }

    // Enhanced Validation - FIXED
    validateField(field) {
        if (!field) return false;
        
        const value = field.value ? field.value.trim() : '';
        const fieldName = field.id;
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'ownerName':
                if (!value) {
                    errorMessage = 'Owner name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                } else if (!/^[a-zA-Z\s\.]+$/.test(value)) {
                    errorMessage = 'Name can only contain letters, spaces, and periods';
                    isValid = false;
                }
                break;

            case 'ownerNIC':
                if (!value) {
                    errorMessage = 'NIC number is required';
                    isValid = false;
                } else if (!/^\d+$/.test(value)) {
                    errorMessage = 'NIC must contain only numbers';
                    isValid = false;
                } else if (value.length !== 12) {
                    errorMessage = 'NIC must be exactly 12 digits';
                    isValid = false;
                }
                break;

            case 'ownerPhone':
                if (!value) {
                    errorMessage = 'Phone number is required';
                    isValid = false;
                } else if (!/^\+?[\d\s\-\(\)]{10,15}$/.test(value)) {
                    errorMessage = 'Please enter a valid phone number';
                    isValid = false;
                }
                break;

            case 'ownerEmail':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'propertyAddress':
                if (!value) {
                    errorMessage = 'Property address is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Please provide a complete address (minimum 10 characters)';
                    isValid = false;
                }
                break;

            case 'district':
                if (!value) {
                    errorMessage = 'District is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Please enter a valid district name';
                    isValid = false;
                }
                break;

            case 'province':
                if (!value) {
                    errorMessage = 'Province selection is required';
                    isValid = false;
                }
                break;

            case 'landSize':
                if (!value) {
                    errorMessage = 'Land size is required';
                    isValid = false;
                } else if (parseFloat(value) <= 0) {
                    errorMessage = 'Land size must be greater than 0';
                    isValid = false;
                } else if (parseFloat(value) > 10000) {
                    errorMessage = 'Please verify land size (seems too large)';
                    isValid = false;
                }
                break;

            case 'landType':
                if (!value) {
                    errorMessage = 'Land type selection is required';
                    isValid = false;
                }
                break;

            case 'latitude':
                if (!value) {
                    errorMessage = 'Latitude is required';
                    isValid = false;
                } else {
                    const lat = parseFloat(value);
                    if (isNaN(lat) || Math.abs(lat) > 90) {
                        errorMessage = 'Latitude must be between -90 and 90 degrees';
                        isValid = false;
                    }
                }
                break;

            case 'longitude':
                if (!value) {
                    errorMessage = 'Longitude is required';
                    isValid = false;
                } else {
                    const lng = parseFloat(value);
                    if (isNaN(lng) || Math.abs(lng) > 180) {
                        errorMessage = 'Longitude must be between -180 and 180 degrees';
                        isValid = false;
                    }
                }
                break;
        }

        this.showFieldError(field, errorMessage, !isValid);
        return isValid;
    }

    showFieldError(field, message, show) {
        if (!field || !field.parentNode) return;
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            if (show) {
                errorElement.classList.add('show');
            } else {
                errorElement.classList.remove('show');
            }
        }
        
        if (show) {
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    }

    clearErrors(field) {
        if (!field || !field.parentNode) return;
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
        field.classList.remove('error');
    }

    validateStep(step) {
        let fields;

        switch (step) {
            case 1:
                fields = ['ownerName', 'ownerNIC', 'ownerPhone', 'ownerEmail'];
                break;
            case 2:
                fields = ['propertyAddress', 'district', 'province', 'landSize', 'landType'];
                break;
            case 3:
                // Photo step validation
                if (!this.ownerPhotoData) {
                    this.showPhotoError('Please upload an owner photo before proceeding');
                    return false;
                }
                return true;
            case 4:
                fields = ['latitude', 'longitude'];
                break;
            default:
                return true;
        }

        let isValid = true;
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && !this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    nextStep() {
        if (this.validateStep(this.currentStep)) {
            if (this.currentStep < this.totalSteps) {
                this.collectStepData();
                this.currentStep++;
                this.updateStepDisplay();

                if (this.currentStep === 5) {
                    this.processBlockchainRegistration();
                }
            }
        } else {
            this.showToast('Please fix the validation errors before proceeding', 'error');
        }
    }

    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
        }
    }

    collectStepData() {
        const currentStepElement = document.querySelector(`#step-${this.currentStep}`);
        if (!currentStepElement) return;
        
        const inputs = currentStepElement.querySelectorAll('.form-control');
        
        inputs.forEach(input => {
            if (input.id) {
                this.registrationData[input.id] = input.value ? input.value.trim() : '';
            }
        });

        // Include photo data in step 3
        if (this.currentStep === 3 && this.ownerPhotoData) {
            this.registrationData.ownerPhoto = this.ownerPhotoData.data;
        }
    }

    updateStepDisplay() {
        // Update progress stepper
        const steps = document.querySelectorAll('.step');
        steps.forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
                const numberElement = step.querySelector('.step-number');
                if (numberElement) {
                    numberElement.innerHTML = '<i class="fas fa-check"></i>';
                }
            } else {
                const numberElement = step.querySelector('.step-number');
                if (numberElement) {
                    numberElement.textContent = stepNumber;
                }
            }
        });

        // Update form steps
        const formSteps = document.querySelectorAll('.form-step');
        formSteps.forEach((formStep, index) => {
            formStep.classList.remove('active');
            if (index + 1 === this.currentStep) {
                formStep.classList.add('active');
            }
        });
    }

    async processBlockchainRegistration() {
        const steps = [
            { id: 'hash-generation', text: 'Cryptographic Hash Generated', delay: 1200 },
            { id: 'block-creation', text: 'Immutable Block Created', delay: 1800 },
            { id: 'network-broadcast', text: 'Broadcasted to Network', delay: 2400 },
            { id: 'confirmation', text: 'Network Confirmation Received', delay: 3000 }
        ];

        for (let i = 0; i < steps.length; i++) {
            await this.updateProcessingStep(steps[i]);
        }

        // Generate comprehensive blockchain data
        const registrationNumber = this.generateRegistrationNumber();
        const certificateId = this.generateCertificateId();
        const blockHash = this.generateHash(JSON.stringify(this.registrationData) + Date.now());
        const transactionHash = this.generateTransactionHash();
        const previousHash = this.getLastBlockHash();

        // Create complete property record
        const propertyRecord = {
            id: `LAND${(this.properties.length + 1).toString().padStart(3, '0')}`,
            registrationNumber: registrationNumber,
            certificateId: certificateId,
            ownerName: this.registrationData.ownerName,
            ownerNIC: this.registrationData.ownerNIC,
            ownerPhone: this.registrationData.ownerPhone,
            ownerEmail: this.registrationData.ownerEmail,
            propertyAddress: this.registrationData.propertyAddress,
            district: this.registrationData.district,
            province: this.registrationData.province,
            landSize: parseFloat(this.registrationData.landSize),
            landType: this.registrationData.landType,
            coordinates: {
                latitude: parseFloat(this.registrationData.latitude),
                longitude: parseFloat(this.registrationData.longitude)
            },
            registrationDate: new Date().toISOString().split('T')[0],
            lastVerified: new Date().toISOString().split('T')[0],
            blockHash: blockHash,
            previousHash: previousHash,
            transactionHash: transactionHash,
            isVerified: true,
            ownerPhoto: this.registrationData.ownerPhoto || null
        };

        // Store current property data for certificate generation
        this.currentPropertyData = propertyRecord;

        // Add to properties and certificates arrays
        this.properties.push(propertyRecord);
        this.certificates.push({
            ...propertyRecord,
            issueDate: propertyRecord.registrationDate,
            qrCode: null
        });
        
        this.savePropertiesToStorage();
        this.saveCertificatesToStorage();

        // Show success result
        setTimeout(() => {
            this.showRegistrationResult(propertyRecord);
        }, 3500);
    }

    async updateProcessingStep(step) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const stepElement = document.getElementById(step.id);
                if (stepElement) {
                    stepElement.classList.add('active');
                    stepElement.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${step.text}`;
                    
                    setTimeout(() => {
                        stepElement.classList.remove('active');
                        stepElement.classList.add('completed');
                        stepElement.innerHTML = `<i class="fas fa-check-circle"></i> ${step.text}`;
                    }, 800);
                }
                resolve();
            }, step.delay);
        });
    }

    showRegistrationResult(propertyRecord) {
        const processingElement = document.querySelector('.blockchain-processing');
        if (processingElement) {
            processingElement.style.display = 'none';
        }
        
        const resultElement = document.querySelector('.registration-result');
        if (resultElement) {
            const regNumber = document.getElementById('reg-number');
            const certificateId = document.getElementById('certificate-id');
            const blockHash = document.getElementById('block-hash');
            const txHash = document.getElementById('tx-hash');
            
            if (regNumber) regNumber.textContent = propertyRecord.registrationNumber;
            if (certificateId) certificateId.textContent = propertyRecord.certificateId;
            if (blockHash) blockHash.textContent = propertyRecord.blockHash;
            if (txHash) txHash.textContent = propertyRecord.transactionHash;
            
            resultElement.classList.remove('hidden');
        }
        
        this.showToast('Property successfully registered on professional blockchain network!', 'success');
    }

    // Certificate System
    generateCertificateId() {
        const year = new Date().getFullYear();
        const sequence = (this.certificates.length + 1).toString().padStart(3, '0');
        return `CERT${year}${sequence}`;
    }

    async showCertificatePreview() {
        if (!this.currentPropertyData) {
            this.showToast('No property data available for certificate generation', 'error');
            return;
        }

        const modal = document.getElementById('certificate-modal');
        const preview = document.getElementById('certificate-preview');
        const qrCanvas = document.getElementById('qr-canvas');

        if (!modal || !preview || !qrCanvas) return;

        // Generate certificate HTML
        const certificateHTML = this.generateCertificateHTML(this.currentPropertyData);
        preview.innerHTML = certificateHTML;

        // Generate QR code
        const verificationData = {
            registrationNumber: this.currentPropertyData.registrationNumber,
            certificateId: this.currentPropertyData.certificateId,
            blockHash: this.currentPropertyData.blockHash,
            verifyUrl: `${this.certificateTemplate.verificationUrl}${this.currentPropertyData.registrationNumber}`
        };

        try {
            await QRCode.toCanvas(qrCanvas, JSON.stringify(verificationData), {
                width: 200,
                height: 200,
                colorDark: '#0A0E27',
                colorLight: '#ffffff',
                margin: 2
            });
        } catch (error) {
            console.error('QR Code generation failed:', error);
        }

        // Show modal
        modal.classList.remove('hidden');
    }

    generateCertificateHTML(propertyData) {
        const template = this.certificateTemplate;
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Photo section HTML
        const photoSection = propertyData.ownerPhoto ? `
            <div style="display: flex; align-items: center; gap: 30px; margin: 30px 0; padding: 20px; background: #f8f9ff; border-radius: 15px; border: 1px solid #E5E7EB;">
                <div style="flex-shrink: 0;">
                    <div style="width: 120px; height: 120px; border-radius: 50%; overflow: hidden; border: 3px solid #0A0E27; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);">
                        <img src="${propertyData.ownerPhoto}" style="width: 100%; height: 100%; object-fit: cover;" alt="Property Owner">
                    </div>
                </div>
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 10px 0; color: #0A0E27; font-size: 18px;">Property Owner Verification</h4>
                    <p style="margin: 0; color: #1A1B3A; line-height: 1.6;">This photograph serves as official identification of the registered property owner and is part of the immutable blockchain record.</p>
                </div>
            </div>
        ` : '';

        return `
            <div style="max-width: 800px; margin: 0 auto; padding: 40px; background: linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%); border: 3px solid #0A0E27; border-radius: 20px; font-family: 'Times New Roman', serif; position: relative; overflow: hidden;">
                <!-- Header with decorative border -->
                <div style="text-align: center; border-bottom: 3px double #0A0E27; padding-bottom: 30px; margin-bottom: 30px; position: relative;">
                    <div style="font-size: 48px; margin-bottom: 10px;">${template.logo}</div>
                    <h1 style="font-size: 32px; color: #0A0E27; margin: 0; font-weight: bold; text-transform: uppercase; letter-spacing: 3px;">${template.companyName}</h1>
                    <p style="font-size: 16px; color: #1A1B3A; margin: 10px 0; font-style: italic;">${template.tagline}</p>
                </div>

                <!-- Certificate Title -->
                <div style="text-align: center; margin: 40px 0;">
                    <h2 style="font-size: 28px; color: #0A0E27; margin: 0; text-transform: uppercase; letter-spacing: 2px; border: 2px solid #00D9FF; padding: 15px 30px; display: inline-block; background: linear-gradient(135deg, #00D9FF10, #FFD70010);">
                        Professional Property Certificate
                    </h2>
                    <p style="font-size: 18px; color: #1A1B3A; margin: 20px 0; font-weight: bold;">Certificate of Blockchain Registration</p>
                </div>

                <!-- Photo Section -->
                ${photoSection}

                <!-- Certificate Body -->
                <div style="margin: 40px 0; line-height: 1.8; font-size: 16px; color: #1A1B3A;">
                    <p style="margin-bottom: 25px; text-align: justify;">
                        This is to certify that the property described below has been successfully registered and verified on our professional blockchain network, establishing immutable proof of ownership and legal title.
                    </p>
                    
                    <!-- Property Details Table -->
                    <table style="width: 100%; border-collapse: collapse; margin: 30px 0; background: #f8f9ff; border: 2px solid #E5E7EB;">
                        <tr style="background: #0A0E27; color: white;">
                            <td colspan="2" style="padding: 15px; text-align: center; font-weight: bold; font-size: 18px; text-transform: uppercase; letter-spacing: 1px;">Property Registration Details</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB; font-weight: bold; width: 35%; background: #f1f5f9;">Registration Number:</td>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB; font-family: 'Courier New', monospace; font-weight: bold; color: #0A0E27;">${propertyData.registrationNumber}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB; font-weight: bold; background: #f1f5f9;">Certificate ID:</td>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB; font-family: 'Courier New', monospace; font-weight: bold; color: #0A0E27;">${propertyData.certificateId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB; font-weight: bold; background: #f1f5f9;">Property Owner:</td>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB; font-weight: bold; text-transform: uppercase;">${propertyData.ownerName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB; font-weight: bold; background: #f1f5f9;">National ID:</td>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB; font-family: 'Courier New', monospace;">${propertyData.ownerNIC}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB; font-weight: bold; background: #f1f5f9;">Property Address:</td>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB;">${propertyData.propertyAddress}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB; font-weight: bold; background: #f1f5f9;">District/Province:</td>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB;">${propertyData.district}, ${propertyData.province}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB; font-weight: bold; background: #f1f5f9;">Land Size:</td>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB; font-weight: bold;">${propertyData.landSize} acres</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB; font-weight: bold; background: #f1f5f9;">Land Type:</td>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB; font-weight: bold;">${propertyData.landType}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB; font-weight: bold; background: #f1f5f9;">Registration Date:</td>
                            <td style="padding: 12px 20px; border: 1px solid #E5E7EB; font-weight: bold;">${new Date(propertyData.registrationDate).toLocaleDateString()}</td>
                        </tr>
                        <tr style="background: #0A0E27; color: white;">
                            <td style="padding: 12px 20px; font-weight: bold;">Blockchain Hash:</td>
                            <td style="padding: 12px 20px; font-family: 'Courier New', monospace; font-size: 12px; word-break: break-all;">${propertyData.blockHash}</td>
                        </tr>
                    </table>
                </div>

                <!-- Legal Text -->
                <div style="margin: 40px 0; padding: 20px; background: #f1f5f9; border-left: 4px solid #00D9FF; font-size: 14px; line-height: 1.6; color: #374151;">
                    <p style="margin: 0; text-align: justify; font-style: italic;">${template.legalText}</p>
                </div>

                <!-- Signatures Section -->
                <div style="display: flex; justify-content: space-between; margin-top: 60px; align-items: flex-end;">
                    <div style="text-align: center; width: 45%;">
                        <div style="border-bottom: 2px solid #0A0E27; margin-bottom: 10px; height: 50px; display: flex; align-items: flex-end; justify-content: center;">
                            <span style="font-size: 30px; color: #00D9FF; margin-bottom: 5px;">${template.officialSeal}</span>
                        </div>
                        <p style="margin: 5px 0; font-weight: bold; color: #0A0E27;">${template.signatoryName}</p>
                        <p style="margin: 0; font-size: 14px; color: #6B7280;">${template.signatoryTitle}</p>
                        <p style="margin: 5px 0 0 0; font-size: 12px; color: #9CA3AF;">Date: ${currentDate}</p>
                    </div>
                    
                    <div style="text-align: center; width: 45%;">
                        <div style="border: 2px solid #0A0E27; padding: 20px; border-radius: 10px; background: linear-gradient(135deg, #00D9FF05, #FFD70005);">
                            <p style="margin: 0; font-weight: bold; color: #0A0E27; font-size: 14px;">BLOCKCHAIN VERIFIED</p>
                            <p style="margin: 5px 0; font-size: 12px; color: #6B7280;">Transaction ID:</p>
                            <p style="margin: 0; font-family: 'Courier New', monospace; font-size: 10px; word-break: break-all; color: #374151;">${propertyData.transactionHash}</p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #E5E7EB; text-align: center; font-size: 12px; color: #6B7280;">
                    <p style="margin: 5px 0;">For verification, visit: <strong style="color: #0A0E27;">${template.verificationUrl}${propertyData.registrationNumber}</strong></p>
                    <p style="margin: 5px 0;">Helpdesk: <strong style="color: #0A0E27;">${template.helpdesk}</strong></p>
                    <p style="margin: 10px 0 0 0; font-style: italic;">This certificate is digitally secured and verified on the blockchain network.</p>
                </div>

                <!-- Watermark -->
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 120px; color: rgba(0, 217, 255, 0.03); font-weight: bold; pointer-events: none; z-index: -1;">CERTIFIED</div>
            </div>
        `;
    }

    async downloadProfessionalCertificate() {
        if (!this.currentPropertyData) {
            this.showToast('No certificate data available', 'error');
            return;
        }

        try {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Add professional certificate content
            await this.generateProfessionalPDF(doc, this.currentPropertyData);
            
            // Save the PDF
            const fileName = `Professional_Certificate_${this.currentPropertyData.registrationNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);
            
            this.showToast('Professional certificate downloaded successfully!', 'success');
            this.closeCertificateModal();
            
        } catch (error) {
            console.error('PDF generation error:', error);
            this.showToast('Failed to generate certificate PDF', 'error');
        }
    }

    async generateProfessionalPDF(doc, propertyData) {
        const template = this.certificateTemplate;
        const currentDate = new Date().toLocaleDateString();
        
        // Set background color
        doc.setFillColor(248, 249, 255);
        doc.rect(0, 0, 210, 297, 'F');
        
        // Add border
        doc.setDrawColor(10, 14, 39);
        doc.setLineWidth(2);
        doc.rect(10, 10, 190, 277);
        
        // Header
        doc.setFontSize(24);
        doc.setTextColor(10, 14, 39);
        doc.setFont(undefined, 'bold');
        doc.text(template.companyName, 105, 35, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'italic');
        doc.text(template.tagline, 105, 45, { align: 'center' });
        
        // Certificate title
        doc.setFontSize(20);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(10, 14, 39);
        doc.text('PROFESSIONAL PROPERTY CERTIFICATE', 105, 65, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setFont(undefined, 'normal');
        doc.text('Certificate of Blockchain Registration', 105, 75, { align: 'center' });
        
        let yPos = 85;
        
        // Add photo if available
        if (propertyData.ownerPhoto) {
            try {
                doc.addImage(propertyData.ownerPhoto, 'JPEG', 160, yPos, 30, 30);
                doc.setDrawColor(10, 14, 39);
                doc.setLineWidth(1);
                doc.circle(175, yPos + 15, 15);
                
                doc.setFontSize(10);
                doc.setTextColor(107, 114, 128);
                doc.text('Owner Photo', 175, yPos + 35, { align: 'center' });
                yPos += 50;
            } catch (error) {
                console.error('Error adding photo to PDF:', error);
                yPos += 10;
            }
        } else {
            yPos += 10;
        }
        
        // Certificate content
        const leftMargin = 25;
        
        doc.setFontSize(11);
        doc.setTextColor(26, 27, 58);
        
        const introText = 'This is to certify that the property described below has been successfully registered and verified on our professional blockchain network, establishing immutable proof of ownership and legal title.';
        const splitIntro = doc.splitTextToSize(introText, 160);
        doc.text(splitIntro, leftMargin, yPos);
        yPos += splitIntro.length * 5 + 10;
        
        // Property details table
        const tableData = [
            ['Registration Number:', propertyData.registrationNumber],
            ['Certificate ID:', propertyData.certificateId],
            ['Property Owner:', propertyData.ownerName.toUpperCase()],
            ['National ID:', propertyData.ownerNIC],
            ['Property Address:', propertyData.propertyAddress],
            ['District/Province:', `${propertyData.district}, ${propertyData.province}`],
            ['Land Size:', `${propertyData.landSize} acres`],
            ['Land Type:', propertyData.landType],
            ['Registration Date:', new Date(propertyData.registrationDate).toLocaleDateString()],
            ['Blockchain Hash:', propertyData.blockHash]
        ];
        
        tableData.forEach(([label, value], index) => {
            if (index % 2 === 0) {
                doc.setFillColor(241, 245, 249);
                doc.rect(leftMargin, yPos - 3, 160, 8, 'F');
            }
            
            doc.setFont(undefined, 'bold');
            doc.setTextColor(10, 14, 39);
            doc.text(label, leftMargin + 3, yPos + 2);
            
            doc.setFont(undefined, 'normal');
            doc.setTextColor(55, 65, 81);
            
            if (label === 'Blockchain Hash:') {
                doc.setFont('courier');
                doc.setFontSize(9);
            }
            
            const valueText = doc.splitTextToSize(value, 100);
            doc.text(valueText, leftMargin + 65, yPos + 2);
            
            doc.setFontSize(11);
            doc.setFont(undefined, 'normal');
            
            yPos += 8;
        });
        
        yPos += 10;
        
        // Legal text
        doc.setFillColor(241, 245, 249);
        doc.rect(leftMargin, yPos, 160, 25, 'F');
        doc.setDrawColor(0, 217, 255);
        doc.setLineWidth(2);
        doc.line(leftMargin, yPos, leftMargin, yPos + 25);
        
        doc.setFontSize(10);
        doc.setTextColor(55, 65, 81);
        doc.setFont(undefined, 'italic');
        const legalTextSplit = doc.splitTextToSize(template.legalText, 150);
        doc.text(legalTextSplit, leftMargin + 5, yPos + 8);
        
        yPos += 35;
        
        // Signatures
        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.setTextColor(10, 14, 39);
        doc.text(template.signatoryName, 60, yPos + 20, { align: 'center' });
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128);
        doc.text(template.signatoryTitle, 60, yPos + 26, { align: 'center' });
        doc.text(`Date: ${currentDate}`, 60, yPos + 32, { align: 'center' });
        
        // Verification box
        doc.setDrawColor(10, 14, 39);
        doc.setLineWidth(1);
        doc.rect(130, yPos + 10, 50, 25);
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(10, 14, 39);
        doc.text('BLOCKCHAIN VERIFIED', 155, yPos + 18, { align: 'center' });
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
        doc.setTextColor(107, 114, 128);
        doc.text('Transaction ID:', 155, yPos + 24, { align: 'center' });
        
        doc.setFont('courier');
        doc.setFontSize(6);
        const shortTxHash = propertyData.transactionHash.substring(0, 20) + '...';
        doc.text(shortTxHash, 155, yPos + 30, { align: 'center' });
        
        // Footer
        yPos = 260;
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(107, 114, 128);
        doc.text(`Verification URL: ${template.verificationUrl}${propertyData.registrationNumber}`, 105, yPos, { align: 'center' });
        doc.text(`Helpdesk: ${template.helpdesk}`, 105, yPos + 6, { align: 'center' });
        
        doc.setFont(undefined, 'italic');
        doc.setFontSize(9);
        doc.text('This certificate is digitally secured and verified on the blockchain network.', 105, yPos + 15, { align: 'center' });
    }

    closeCertificateModal() {
        const modal = document.getElementById('certificate-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Certificates Tab Management
    initializeCertificatesTab() {
        const certificatesList = document.getElementById('certificates-list');
        if (!certificatesList) return;
        
        certificatesList.innerHTML = '';
        
        if (this.certificates.length === 0) {
            certificatesList.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--color-text-secondary);">
                    <i class="fas fa-certificate" style="font-size: 4rem; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3>No Certificates Available</h3>
                    <p>Register a property to generate your first certificate.</p>
                </div>
            `;
            return;
        }
        
        this.certificates.forEach(certificate => {
            const certificateCard = this.createCertificateCard(certificate);
            certificatesList.appendChild(certificateCard);
        });
    }

    createCertificateCard(certificate) {
        const card = document.createElement('div');
        card.className = 'certificate-item';
        
        const photoPreview = certificate.ownerPhoto ? `
            <div style="width: 60px; height: 60px; border-radius: 50%; overflow: hidden; border: 2px solid var(--current-accent); margin-right: 15px; flex-shrink: 0;">
                <img src="${certificate.ownerPhoto}" style="width: 100%; height: 100%; object-fit: cover;" alt="Owner">
            </div>
        ` : '';
        
        card.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                <div style="display: flex; align-items: center;">
                    ${photoPreview}
                    <div>
                        <h4 style="margin: 0 0 5px 0; color: var(--color-text); font-size: 1.1rem;">
                            ${certificate.propertyAddress}
                        </h4>
                        <p style="margin: 0; color: var(--color-text-secondary); font-size: 0.9rem;">
                            Owner: ${certificate.ownerName} | ${certificate.landSize} acres | ${certificate.landType}
                        </p>
                    </div>
                </div>
                <span class="status-badge status-verified">
                    <i class="fas fa-certificate"></i> Certified
                </span>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 15px; font-size: 0.85rem;">
                <div>
                    <strong>Reg. Number:</strong><br>
                    <span class="mono">${certificate.registrationNumber}</span>
                </div>
                <div>
                    <strong>Certificate ID:</strong><br>
                    <span class="mono">${certificate.certificateId}</span>
                </div>
                <div>
                    <strong>Issue Date:</strong><br>
                    ${new Date(certificate.issueDate).toLocaleDateString()}
                </div>
                <div>
                    <strong>Block Hash:</strong><br>
                    <span class="mono">${certificate.blockHash.substring(0, 12)}...</span>
                </div>
            </div>
            
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button class="professional-btn btn-primary" style="padding: 8px 16px; font-size: 0.9rem;" onclick="landChain.previewCertificate('${certificate.registrationNumber}')">
                    <i class="fas fa-eye"></i> Preview
                </button>
                <button class="professional-btn btn-accent" style="padding: 8px 16px; font-size: 0.9rem;" onclick="landChain.downloadCertificateById('${certificate.registrationNumber}')">
                    <i class="fas fa-download"></i> Download PDF
                </button>
            </div>
        `;
        
        return card;
    }

    previewCertificate(registrationNumber) {
        const certificate = this.certificates.find(cert => cert.registrationNumber === registrationNumber);
        if (certificate) {
            this.currentPropertyData = certificate;
            this.showCertificatePreview();
        }
    }

    downloadCertificateById(registrationNumber) {
        const certificate = this.certificates.find(cert => cert.registrationNumber === registrationNumber);
        if (certificate) {
            this.currentPropertyData = certificate;
            this.downloadProfessionalCertificate();
        }
    }

    // Blockchain utility functions
    generateRegistrationNumber() {
        const year = new Date().getFullYear();
        const sequence = (this.properties.length + 1).toString().padStart(3, '0');
        return `REG${year}${sequence}`;
    }

    generateHash(data) {
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(12, '0').substring(0, 12);
    }

    generateTransactionHash() {
        const timestamp = Date.now();
        const random = Math.random();
        return 'tx' + this.generateHash(`${timestamp}${random}`);
    }

    getLastBlockHash() {
        if (this.properties.length === 0) {
            return '000000000000';
        }
        return this.properties[this.properties.length - 1].blockHash;
    }

    // GPS Location
    getCurrentLocation() {
        if (navigator.geolocation) {
            const button = document.querySelector('.btn-accent');
            const originalText = button ? button.innerHTML : '';
            if (button) {
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Getting Location...';
                button.disabled = true;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latField = document.getElementById('latitude');
                    const lngField = document.getElementById('longitude');
                    
                    if (latField) latField.value = position.coords.latitude.toFixed(6);
                    if (lngField) lngField.value = position.coords.longitude.toFixed(6);
                    
                    if (button) {
                        button.innerHTML = originalText;
                        button.disabled = false;
                    }
                    this.showToast('GPS location obtained successfully!', 'success');
                },
                (error) => {
                    if (button) {
                        button.innerHTML = originalText;
                        button.disabled = false;
                    }
                    
                    let errorMsg = 'Unable to get location. Please enter manually.';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMsg = 'Location access denied. Please enter coordinates manually.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMsg = 'Location information unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMsg = 'Location request timed out.';
                            break;
                    }
                    this.showToast(errorMsg, 'error');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        } else {
            this.showToast('Geolocation is not supported by this browser.', 'error');
        }
    }

    // Verification Functions
    verifyProperty() {
        const regNumberField = document.getElementById('searchRegNumber');
        const ownerNICField = document.getElementById('searchOwnerNIC');
        
        const regNumber = regNumberField ? regNumberField.value.trim() : '';
        const ownerNIC = ownerNICField ? ownerNICField.value.trim() : '';

        if (!regNumber && !ownerNIC) {
            this.showToast('Please enter registration number or owner NIC', 'error');
            return;
        }

        const property = this.properties.find(p => 
            (regNumber && p.registrationNumber.toLowerCase() === regNumber.toLowerCase()) ||
            (ownerNIC && p.ownerNIC === ownerNIC)
        );

        if (property) {
            this.showVerificationResult(property);
            this.showToast('Property record found and professionally verified!', 'success');
        } else {
            this.hideVerificationResult();
            this.showToast('No matching property record found in blockchain', 'error');
        }
    }

    showVerificationResult(property) {
        const elements = {
            owner: document.getElementById('verified-owner'),
            regNumber: document.getElementById('verified-reg-number'),
            address: document.getElementById('verified-address'),
            size: document.getElementById('verified-size'),
            type: document.getElementById('verified-type'),
            date: document.getElementById('verified-date'),
            hash: document.getElementById('verified-hash')
        };

        if (elements.owner) elements.owner.textContent = property.ownerName;
        if (elements.regNumber) elements.regNumber.textContent = property.registrationNumber;
        if (elements.address) elements.address.textContent = property.propertyAddress;
        if (elements.size) elements.size.textContent = `${property.landSize} acres`;
        if (elements.type) elements.type.textContent = property.landType;
        if (elements.date) elements.date.textContent = new Date(property.registrationDate).toLocaleDateString();
        if (elements.hash) elements.hash.textContent = property.blockHash;

        const resultElement = document.getElementById('verification-result');
        if (resultElement) {
            resultElement.classList.remove('hidden');
        }
    }

    hideVerificationResult() {
        const resultElement = document.getElementById('verification-result');
        if (resultElement) {
            resultElement.classList.add('hidden');
        }
    }

    // Dashboard Functions
    initializeDashboard() {
        this.updateStatistics();
        this.populatePropertiesTable();
    }

    updateStatistics() {
        const totalProperties = this.properties.length;
        const verifiedProperties = this.properties.filter(p => p.isVerified).length;
        const currentMonth = new Date().getMonth();
        const recentRegistrations = this.properties.filter(p => {
            const regDate = new Date(p.registrationDate);
            return regDate.getMonth() === currentMonth;
        }).length;
        const totalCertificates = this.certificates.length;

        this.animateCounter('total-properties', totalProperties);
        this.animateCounter('verified-properties', verifiedProperties);
        this.animateCounter('recent-registrations', recentRegistrations);
        this.animateCounter('total-certificates', totalCertificates);
    }

    animateCounter(elementId, target) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(easeOutQuart * target);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }

    populatePropertiesTable() {
        const tbody = document.getElementById('properties-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        this.properties.forEach(property => {
            const row = this.createPropertyRow(property);
            tbody.appendChild(row);
        });
    }

    createPropertyRow(property) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="mono">${property.registrationNumber}</td>
            <td>${property.ownerName}</td>
            <td>${property.district}, ${property.province}</td>
            <td>${property.landSize} acres</td>
            <td>${property.landType}</td>
            <td><span class="status-badge ${property.isVerified ? 'status-verified' : 'status-pending'}">
                ${property.isVerified ? '<i class="fas fa-check-circle"></i> Verified' : '<i class="fas fa-clock"></i> Pending'}
            </span></td>
            <td>${new Date(property.registrationDate).toLocaleDateString()}</td>
            <td>
                <button class="professional-btn btn-accent" style="padding: 4px 8px; font-size: 0.8rem;" onclick="landChain.previewCertificate('${property.registrationNumber}')">
                    <i class="fas fa-certificate"></i>
                </button>
            </td>
        `;
        return row;
    }

    filterProperties() {
        const searchInput = document.getElementById('search-properties');
        const filterType = document.getElementById('filter-type');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const filterTypeValue = filterType ? filterType.value : '';

        let filteredProperties = this.properties;

        if (searchTerm) {
            filteredProperties = filteredProperties.filter(property =>
                property.ownerName.toLowerCase().includes(searchTerm) ||
                property.registrationNumber.toLowerCase().includes(searchTerm) ||
                property.propertyAddress.toLowerCase().includes(searchTerm) ||
                property.district.toLowerCase().includes(searchTerm) ||
                property.province.toLowerCase().includes(searchTerm)
            );
        }

        if (filterTypeValue) {
            filteredProperties = filteredProperties.filter(property =>
                property.landType === filterTypeValue
            );
        }

        this.updatePropertiesTable(filteredProperties);
    }

    updatePropertiesTable(properties) {
        const tbody = document.getElementById('properties-tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        properties.forEach(property => {
            const row = this.createPropertyRow(property);
            tbody.appendChild(row);
        });
    }

    // Form Reset Functions
    resetForm() {
        this.currentStep = 1;
        this.registrationData = {};
        this.currentPropertyData = null;
        this.ownerPhotoData = null;
        
        const form = document.getElementById('registration-form');
        if (form) {
            form.reset();
        }

        // Reset photo section
        const photoDropZone = document.getElementById('photoDropZone');
        const photoPreviewSection = document.getElementById('photoPreviewSection');
        
        if (photoDropZone) {
            photoDropZone.style.display = 'block';
            const content = photoDropZone.querySelector('.drop-zone-content');
            if (content) {
                content.innerHTML = `
                    <i class="fas fa-cloud-upload-alt upload-icon"></i>
                    <h4>Upload Owner Photo</h4>
                    <p>Drag and drop your photo here, or click to browse</p>
                    <button type="button" class="professional-btn btn-accent" onclick="triggerPhotoUpload()">
                        <i class="fas fa-folder-open"></i> Choose Photo
                    </button>
                `;
            }
        }
        
        if (photoPreviewSection) {
            photoPreviewSection.classList.add('hidden');
        }

        this.hidePhotoError();

        // Clear all error messages
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.classList.remove('show'));
        
        const errorFields = document.querySelectorAll('.form-control.error');
        errorFields.forEach(field => field.classList.remove('error'));

        this.updateStepDisplay();

        const resultElement = document.querySelector('.registration-result');
        const processingElement = document.querySelector('.blockchain-processing');
        
        if (resultElement) resultElement.classList.add('hidden');
        if (processingElement) processingElement.style.display = 'block';

        // Reset processing steps
        const processingSteps = document.querySelectorAll('.processing-step');
        processingSteps.forEach(step => {
            step.classList.remove('active', 'completed');
            const stepId = step.id;
            const stepTexts = {
                'hash-generation': 'Generating Cryptographic Hash...',
                'block-creation': 'Creating Immutable Block...',
                'network-broadcast': 'Broadcasting to Network...',
                'confirmation': 'Awaiting Network Confirmation...'
            };
            if (stepTexts[stepId]) {
                step.innerHTML = `<i class="fas fa-clock"></i> ${stepTexts[stepId]}`;
            }
        });

        this.showToast('Form reset successfully. Ready for new registration.', 'info');
    }

    // Storage Functions
    loadPropertiesFromStorage() {
        try {
            const stored = localStorage.getItem('landchain_professional_properties');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading properties from storage:', error);
            return [];
        }
    }

    savePropertiesToStorage() {
        try {
            localStorage.setItem('landchain_professional_properties', JSON.stringify(this.properties));
        } catch (error) {
            console.error('Error saving properties to storage:', error);
            this.showToast('Error saving property data', 'error');
        }
    }

    loadCertificatesFromStorage() {
        try {
            const stored = localStorage.getItem('landchain_professional_certificates');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading certificates from storage:', error);
            return [];
        }
    }

    saveCertificatesToStorage() {
        try {
            localStorage.setItem('landchain_professional_certificates', JSON.stringify(this.certificates));
        } catch (error) {
            console.error('Error saving certificates to storage:', error);
            this.showToast('Error saving certificate data', 'error');
        }
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toast-container');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas fa-${this.getToastIcon(type)}" style="font-size: 1.2rem;"></i>
                <span style="flex: 1;">${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; font-size: 1.1rem; padding: 4px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }

    // Mobile Menu
    toggleMobileMenu() {
        const navTabs = document.querySelector('.nav-tabs');
        if (navTabs) {
            navTabs.classList.toggle('mobile-open');
        }
    }

    // Cleanup
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        window.removeEventListener('resize', this.resizeCanvas);
        window.removeEventListener('mousemove', this.updateMousePosition);
    }
}

// Global functions for HTML onclick handlers
function nextStep() {
    if (landChain) {
        landChain.nextStep();
    }
}

function previousStep() {
    if (landChain) {
        landChain.previousStep();
    }
}

function getCurrentLocation() {
    if (landChain) {
        landChain.getCurrentLocation();
    }
}

function showCertificatePreview() {
    if (landChain) {
        landChain.showCertificatePreview();
    }
}

function closeCertificateModal() {
    if (landChain) {
        landChain.closeCertificateModal();
    }
}

function downloadProfessionalCertificate() {
    if (landChain) {
        landChain.downloadProfessionalCertificate();
    }
}

function resetForm() {
    if (landChain) {
        landChain.resetForm();
    }
}

// Photo upload global functions
function triggerPhotoUpload() {
    const photoInput = document.getElementById('ownerPhoto');
    if (photoInput) {
        photoInput.click();
    }
}

function removePhoto() {
    const photoDropZone = document.getElementById('photoDropZone');
    const photoPreviewSection = document.getElementById('photoPreviewSection');
    const photoInput = document.getElementById('ownerPhoto');
    
    if (photoDropZone) {
        photoDropZone.style.display = 'block';
        const content = photoDropZone.querySelector('.drop-zone-content');
        if (content) {
            content.innerHTML = `
                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                <h4>Upload Owner Photo</h4>
                <p>Drag and drop your photo here, or click to browse</p>
                <button type="button" class="professional-btn btn-accent" onclick="triggerPhotoUpload()">
                    <i class="fas fa-folder-open"></i> Choose Photo
                </button>
            `;
        }
    }
    
    if (photoPreviewSection) {
        photoPreviewSection.classList.add('hidden');
    }
    
    if (photoInput) {
        photoInput.value = '';
    }

    // Clear photo data
    if (landChain) {
        landChain.ownerPhotoData = null;
        landChain.hidePhotoError();
    }
}

// Initialize the application
let landChain;

document.addEventListener('DOMContentLoaded', () => {
    landChain = new ProfessionalLandChainRegistry();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (landChain) {
        landChain.destroy();
    }
});

// Additional responsive handling
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const navTabs = document.querySelector('.nav-tabs');
        if (navTabs) {
            navTabs.classList.remove('mobile-open');
        }
    }
});

// Performance optimization
window.addEventListener('visibilitychange', () => {
    if (landChain && landChain.animationFrame) {
        if (document.hidden) {
            cancelAnimationFrame(landChain.animationFrame);
            landChain.animationFrame = null;
        } else {
            landChain.startBackgroundAnimation();
        }
    }
});