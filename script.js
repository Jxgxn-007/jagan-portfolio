/**
 * Jagan M — 3D Interactive Creative Developer Portfolio
 * Core Script: Three.js 3D Scene, Tactile Parallax, Chatbot & Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =========================================================================
    // 1. Reading Progress & Header Scroll States
    // =========================================================================
    const scrollProgress = document.getElementById('scroll-progress');
    const siteHeader = document.getElementById('site-header');

    const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
        }

        if (siteHeader) {
            if (scrollTop > 40) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // =========================================================================
    // 2. Mobile Navigation Toggle
    // =========================================================================
    const menuBtn = document.getElementById('menu-btn');
    const navMenuWrapper = document.getElementById('nav-menu-wrapper');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuBtn && navMenuWrapper) {
        menuBtn.addEventListener('click', () => {
            const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', String(!isExpanded));
            menuBtn.classList.toggle('open', !isExpanded);
            navMenuWrapper.classList.toggle('active', !isExpanded);
        });

        // Close on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.classList.remove('open');
                navMenuWrapper.classList.remove('active');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!siteHeader.contains(e.target) && navMenuWrapper.classList.contains('active')) {
                menuBtn.setAttribute('aria-expanded', 'false');
                menuBtn.classList.remove('open');
                navMenuWrapper.classList.remove('active');
            }
        });
    }

    // Active Section Navigation Highlight
    const sections = document.querySelectorAll('section[id]');
    const updateActiveNav = () => {
        const scrollY = window.pageYOffset + 140;
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    };
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // =========================================================================
    // 3. Rotating Role Ticker Animation
    // =========================================================================
    const roleRotator = document.getElementById('role-rotator');
    if (roleRotator) {
        const roles = [
            'Software Developer',
            'Full-Stack Developer',
            'Cybersecurity Enthusiast'
        ];
        let roleIndex = 0;

        setInterval(() => {
            roleRotator.style.opacity = '0';
            roleRotator.style.transform = 'translateY(-6px)';

            setTimeout(() => {
                roleIndex = (roleIndex + 1) % roles.length;
                roleRotator.textContent = roles[roleIndex];
                roleRotator.style.opacity = '1';
                roleRotator.style.transform = 'translateY(0)';
            }, 250);
        }, 2800);
    }

    // =========================================================================
    // 4. Three.js 3D Hero Interactive Scene
    // =========================================================================
    const canvas = document.getElementById('three-hero-canvas');
    const heroSection = document.getElementById('hero');
    const stageViewport = document.querySelector('.hero-stage-viewport');
    const portraitCard = document.getElementById('portrait-stage-card');
    const tactileChips = document.querySelectorAll('.tactile-chip');

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = window.matchMedia('(hover: hover)').matches;

    if (canvas && typeof THREE !== 'undefined') {
        let renderer, scene, camera;
        let objectsGroup;
        let torus, sphere, cube, octahedron, ring;
        let animFrameId = null;
        let isHeroVisible = true;

        // Pointer coords normalized [-1, 1]
        let mouseX = 0;
        let mouseY = 0;
        let targetMouseX = 0;
        let targetMouseY = 0;

        const initThreeScene = () => {
            const width = stageViewport ? stageViewport.clientWidth : 460;
            const height = stageViewport ? stageViewport.clientHeight : 520;

            // Scene
            scene = new THREE.Scene();

            // Camera
            camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
            camera.position.set(0, 0, 7.5);

            // Renderer
            renderer = new THREE.WebGLRenderer({
                canvas: canvas,
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance'
            });
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

            // Studio Lighting
            const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.85);
            scene.add(ambientLight);

            const keyLight = new THREE.DirectionalLight(0xFFFFFF, 1.2);
            keyLight.position.set(5, 7, 6);
            scene.add(keyLight);

            const fillLight = new THREE.DirectionalLight(0x315CFF, 0.6);
            fillLight.position.set(-6, -4, -3);
            scene.add(fillLight);

            const warmLight = new THREE.DirectionalLight(0xFF6B4A, 0.4);
            warmLight.position.set(4, -5, 2);
            scene.add(warmLight);

            // Container Group
            objectsGroup = new THREE.Group();
            scene.add(objectsGroup);

            // 1. Cobalt Blue Torus (Signature Shape)
            const torusGeo = new THREE.TorusGeometry(1.5, 0.38, 24, 60);
            const torusMat = new THREE.MeshStandardMaterial({
                color: 0x315CFF,
                roughness: 0.3,
                metalness: 0.15
            });
            torus = new THREE.Mesh(torusGeo, torusMat);
            torus.position.set(0.2, 0.1, -1.2);
            torus.rotation.set(0.6, 0.4, 0);
            objectsGroup.add(torus);

            // 2. Lavender Sphere (Upper Right Accent)
            const sphereGeo = new THREE.SphereGeometry(0.72, 32, 32);
            const sphereMat = new THREE.MeshStandardMaterial({
                color: 0x8B5CF6,
                roughness: 0.25,
                metalness: 0.1
            });
            sphere = new THREE.Mesh(sphereGeo, sphereMat);
            sphere.position.set(1.9, 1.6, -0.6);
            objectsGroup.add(sphere);

            // 3. Soft Orange Cube (Lower Left Accent)
            const cubeGeo = new THREE.BoxGeometry(0.85, 0.85, 0.85);
            const cubeMat = new THREE.MeshStandardMaterial({
                color: 0xFF6B4A,
                roughness: 0.35,
                metalness: 0.05
            });
            cube = new THREE.Mesh(cubeGeo, cubeMat);
            cube.position.set(-1.8, -1.5, -0.4);
            cube.rotation.set(0.5, 0.7, 0.2);
            objectsGroup.add(cube);

            // 4. Mint Green Octahedron (Upper Left Accent)
            const octGeo = new THREE.OctahedronGeometry(0.55, 0);
            const octMat = new THREE.MeshStandardMaterial({
                color: 0x10B981,
                roughness: 0.2,
                metalness: 0.2
            });
            octahedron = new THREE.Mesh(octGeo, octMat);
            octahedron.position.set(-1.9, 1.4, -0.8);
            objectsGroup.add(octahedron);

            // 5. Translucent Outer Ring (Subtle Depth)
            const ringGeo = new THREE.TorusGeometry(2.3, 0.06, 16, 60);
            const ringMat = new THREE.MeshStandardMaterial({
                color: 0x315CFF,
                roughness: 0.1,
                metalness: 0.3,
                transparent: true,
                opacity: 0.45
            });
            ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.set(0, 0, -1.8);
            ring.rotation.set(1.1, 0.3, 0.2);
            objectsGroup.add(ring);
        };

        initThreeScene();

        // Pointer Parallax Handler
        if (canHover) {
            window.addEventListener('mousemove', (e) => {
                const normX = (e.clientX / window.innerWidth) * 2 - 1;
                const normY = -(e.clientY / window.innerHeight) * 2 + 1;
                targetMouseX = normX;
                targetMouseY = normY;
            }, { passive: true });
        }

        // Animation Loop with Performance Throttling
        let clock = new THREE.Clock();

        const animate = () => {
            if (!isHeroVisible) return;

            animFrameId = requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Smooth mouse coordinate lerping
            mouseX += (targetMouseX - mouseX) * 0.05;
            mouseY += (targetMouseY - mouseY) * 0.05;

            // Parallax response on 3D objects
            if (!prefersReducedMotion) {
                // Continuous gentle floating
                torus.rotation.x = 0.6 + Math.sin(elapsedTime * 0.6) * 0.15;
                torus.rotation.y += 0.005;
                torus.position.y = 0.1 + Math.sin(elapsedTime * 0.8) * 0.12;

                sphere.position.y = 1.6 + Math.cos(elapsedTime * 0.7) * 0.15;
                sphere.rotation.y += 0.008;

                cube.rotation.x += 0.006;
                cube.rotation.y += 0.009;
                cube.position.y = -1.5 + Math.sin(elapsedTime * 0.75) * 0.1;

                octahedron.rotation.y += 0.01;
                octahedron.rotation.z += 0.007;
                octahedron.position.y = 1.4 + Math.cos(elapsedTime * 0.9) * 0.12;

                ring.rotation.z += 0.002;
            }

            // Pointer Parallax on Three.js Scene
            if (canHover) {
                objectsGroup.rotation.y = mouseX * 0.4;
                objectsGroup.rotation.x = -mouseY * 0.4;
                objectsGroup.position.x = mouseX * 0.3;
                objectsGroup.position.y = mouseY * 0.3;

                // Tactile 3D Tilt on the Portrait Card
                if (portraitCard) {
                    const tiltX = -mouseY * 7;
                    const tiltY = mouseX * 7;
                    portraitCard.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateZ(10px)`;
                }

                // Subtle parallax shift on floating chips
                tactileChips.forEach(chip => {
                    const depth = parseFloat(chip.getAttribute('data-depth')) || 0.4;
                    const moveX = mouseX * 20 * depth;
                    const moveY = -mouseY * 20 * depth;
                    chip.style.transform = `translate(${moveX.toFixed(1)}px, ${moveY.toFixed(1)}px)`;
                });
            }

            renderer.render(scene, camera);
        };

        animate();

        // Pause rendering when hero is not in viewport (Battery & GPU Saver)
        if ('IntersectionObserver' in window && heroSection) {
            const heroObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    isHeroVisible = entry.isIntersecting;
                    if (isHeroVisible && !animFrameId) {
                        clock.start();
                        animate();
                    } else if (!isHeroVisible && animFrameId) {
                        cancelAnimationFrame(animFrameId);
                        animFrameId = null;
                    }
                });
            }, { threshold: 0.05 });

            heroObserver.observe(heroSection);
        }

        // Responsive Resize Handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (stageViewport && renderer && camera) {
                    const newW = stageViewport.clientWidth;
                    const newH = stageViewport.clientHeight;
                    camera.aspect = newW / newH;
                    camera.updateProjectionMatrix();
                    renderer.setSize(newW, newH);
                }
            }, 100);
        });
    }

    // =========================================================================
    // 5. Tactile 3D Tilt for Project Cards (Restrained & Accessible)
    // =========================================================================
    const tiltCards = document.querySelectorAll('.project-card[data-tilt]');
    if (canHover && !prefersReducedMotion) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((centerY - y) / centerY) * 4; // Max 4 deg
                const rotateY = ((x - centerX) / centerX) * 4; // Max 4 deg

                card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
            });
        });
    }

    // =========================================================================
    // 6. GitHub Repository Feed & Graceful Fallback
    // =========================================================================
    const githubContainer = document.getElementById('github-repos');

    const renderRepoCard = (name, desc, language, url) => `
        <div class="repo-card">
            <div>
                <h4>${name}</h4>
                <p>${desc || 'Software repository under active development on GitHub.'}</p>
            </div>
            <div class="repo-footer">
                <span class="repo-lang-tag">
                    <span class="lang-dot"></span>
                    <span>${language || 'Code'}</span>
                </span>
                <a href="${url}" target="_blank" rel="noopener noreferrer" class="repo-link-btn" aria-label="View ${name} repository">
                    <span>View Repo</span>
                    <i class="fas fa-arrow-right" aria-hidden="true"></i>
                </a>
            </div>
        </div>
    `;

    const loadFallbackRepos = () => {
        if (!githubContainer) return;
        githubContainer.innerHTML = `
            ${renderRepoCard(
                'AI-Invoice-Payment-Fraud-Sentinel',
                'Intelligent invoice payment anomaly and fraud detection framework.',
                'Python',
                'https://github.com/Jxgxn-007/AI-Invoice-Payment-Fraud-Sentinel'
            )}
            ${renderRepoCard(
                'Enhanced-SPIN-IDS',
                'Wireshark-integrated real-time intrusion detection and traffic classification system.',
                'Java',
                'https://github.com/Jxgxn-007/Enhanced-SPIN-IDS-Wireshark-Integrated-Real-Time-Network-Intrusion-Detection-System'
            )}
            ${renderRepoCard(
                'axiscyberlab',
                'Cybersecurity and DevOps interactive learning platform built with React and Vite.',
                'JavaScript',
                'https://github.com/Jxgxn-007/axiscyberlab'
            )}
            ${renderRepoCard(
                'SecureMailScope',
                'Passive email network traffic analysis and forensic inspection platform.',
                'Python',
                'https://github.com/Jxgxn-007/SecureMailScope'
            )}
        `;
    };

    const fetchGitHubRepos = async () => {
        if (!githubContainer) return;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);

            const res = await fetch('https://api.github.com/users/Jxgxn-007/repos?sort=updated&per_page=4', {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!res.ok) throw new Error('Network response not ok');
            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
                githubContainer.innerHTML = data.map(repo => 
                    renderRepoCard(repo.name, repo.description, repo.language, repo.html_url)
                ).join('');
            } else {
                loadFallbackRepos();
            }
        } catch (e) {
            loadFallbackRepos();
        }
    };

    fetchGitHubRepos();

    // =========================================================================
    // 7. Jagan AI Assistant Chatbot (Light Theme & Preserved Knowledge)
    // =========================================================================
    const chatToggle = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatMessages = document.getElementById('chat-messages');
    const suggestBtns = document.querySelectorAll('.suggest-btn');

    const botKnowledge = {
        who: "Jagan M is a B.Tech Information Technology student at Mepco Schlenk Engineering College, expecting to graduate in 2028. He is a Creative Developer & Cybersecurity Enthusiast passionate about building interactive software and exploring network security.",
        skills: "Confirmed Technical Skills:\n• Programming: C, C++, Python, Java\n• Frontend: HTML5, CSS3, React, JavaScript (ES6+)\n• Security & Analysis: Wireshark, PCAP Analysis, Network Traffic Inspection\n• Tools: Git, GitHub, VS Code, Vite",
        projects: "Featured Projects:\n1. Enhanced SPIN-IDS — Wireshark-integrated real-time intrusion detection system (Java, Pcap4J, CNN)\n2. Axis Cyber Labs — Cybersecurity & DevOps learning platform (React, Vite)\n3. Intellicrowd — AI-based crowd management solution (YOLO, Java, Web)\n4. SecureMailScope — Passive email traffic analysis & protocol inspection platform",
        contact: "📧 Email: mjagan20070314@gmail.com\n🐙 GitHub: https://github.com/Jxgxn-007\n💼 LinkedIn: https://www.linkedin.com/in/jagan-m-a3a786410/",
        resume: "📄 You can download Jagan's verified one-page resume directly using the 'Download Resume' button in the About section or top navigation bar, linked to assets/Jagan_M_Resume.pdf."
    };

    if (chatToggle && chatWindow && chatClose && chatMessages) {
        chatToggle.addEventListener('click', () => {
            const isHidden = chatWindow.classList.contains('hidden');
            if (isHidden) {
                chatWindow.classList.remove('hidden');
                chatToggle.setAttribute('aria-expanded', 'true');
            } else {
                chatWindow.classList.add('hidden');
                chatToggle.setAttribute('aria-expanded', 'false');
            }
        });

        chatClose.addEventListener('click', () => {
            chatWindow.classList.add('hidden');
            chatToggle.setAttribute('aria-expanded', 'false');
        });

        const addChatMessage = (sender, text) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${sender}`;
            msgDiv.innerHTML = text.replace(/\n/g, '<br>');
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        };

        suggestBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.getAttribute('data-query');
                addChatMessage('user', btn.textContent);

                // Natural response delay
                setTimeout(() => {
                    const response = botKnowledge[query] || "I'm always ready to help! Feel free to reach out to Jagan directly at mjagan20070314@gmail.com.";
                    addChatMessage('bot', response);
                }, 400);
            });
        });
    }

    // =========================================================================
    // 8. Smooth Internal Anchor Scrolling
    // =========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});