   // Toggle authentication buttons based on login status
        function toggleAuthButtons() {
            const isLoggedIn = sessionStorage.getItem('trangthai') === 'hien';
            console.log('Login status:', isLoggedIn, 'trangthai:', sessionStorage.getItem('trangthai')); // Debugging
            document.getElementById('dangxuat').style.display = isLoggedIn ? 'flex' : 'none';
            document.getElementById('dangnhap').style.display = isLoggedIn ? 'none' : 'flex';
            document.getElementById('dangky').style.display = isLoggedIn ? 'none' : 'flex';
        }

        // Logout function
        function m2() {
            alert('Đăng xuất thành công!');
            sessionStorage.removeItem('tk');
            sessionStorage.removeItem('mk');
            sessionStorage.removeItem('trangthai');
            toggleAuthButtons();
            window.location.href = './dangnhap.html';
        }

        // Initialize authentication buttons on page load
        window.addEventListener('load', toggleAuthButtons);

        // Hamburger menu functionality
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('#div_dieuhuong');
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            document.querySelectorAll('.submenu').forEach(submenu => {
                submenu.classList.remove('show');
                submenu.parentElement.querySelector('a').setAttribute('aria-expanded', 'false');
            });
        });

        // Submenu toggle for mobile
        document.querySelectorAll('.menu > li > a').forEach(menuItem => {
            menuItem.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const submenu = menuItem.nextElementSibling;
                    const isOpen = submenu.classList.contains('show');
                    document.querySelectorAll('.submenu').forEach(otherSubmenu => {
                        if (otherSubmenu !== submenu) {
                            otherSubmenu.classList.remove('show');
                            otherSubmenu.parentElement.querySelector('a').setAttribute('aria-expanded', 'false');
                        }
                    });
                    submenu.classList.toggle('show');
                    menuItem.setAttribute('aria-expanded', !isOpen);
                }
            });
        });

        // Image zoom functionality
        document.querySelectorAll('.card-image').forEach(image => {
            image.addEventListener('click', (e) => {
                e.stopPropagation();
                const img = e.currentTarget.querySelector('img');
                img.classList.toggle('zoomed');
            });
        });

        // Search and filter functionality
        const searchInput = document.querySelector('#searchInput');
        const clearSearch = document.querySelector('.clear-search');
        const filterTags = document.querySelectorAll('.filter-tag');
        const destinationCards = document.querySelectorAll('.destination-card');
        const noResults = document.querySelector('.no-results');
        let activeTag = 'all';

        function normalizeText(text) {
            return text
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
                .trim();
        }

        function escapeRegExp(string) {
            return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }

        function highlightText(element, text) {
            const originalText = element.textContent;
            const normalizedText = normalizeText(originalText);
            const normalizedSearch = normalizeText(text);
            if (!normalizedSearch) return;
            const escapedText = escapeRegExp(text);
            const regex = new RegExp(`(${escapedText})`, 'gi');
            element.innerHTML = originalText.replace(regex, '<span class="highlight">$1</span>');
        }

        function clearHighlights() {
            destinationCards.forEach(card => {
                const title = card.querySelector('.card-title');
                const description = card.querySelector('.card-description');
                title.innerHTML = title.textContent;
                description.innerHTML = description.textContent;
            });
        }

        function filterCards() {
            const searchText = searchInput.value.trim();
            const normalizedSearch = normalizeText(searchText);
            let visibleCount = 0;
            clearHighlights();
            clearSearch.classList.toggle('visible', searchText.length > 0);
            destinationCards.forEach(card => {
                const title = card.querySelector('.card-title').textContent;
                const description = card.querySelector('.card-description').textContent;
                const tags = card.getAttribute('data-tags');
                const normalizedTitle = normalizeText(title);
                const normalizedDescription = normalizeText(description);
                const normalizedTags = normalizeText(tags);
                const matchesSearch = normalizedSearch === '' ||
                    normalizedTitle.includes(normalizedSearch) ||
                    normalizedDescription.includes(normalizedSearch) ||
                    normalizedTags.includes(normalizedSearch);
                const matchesTag = activeTag === 'all' || normalizedTags.includes(normalizeText(activeTag));
                if (matchesSearch && matchesTag) {
                    card.classList.add('visible');
                    visibleCount++;
                    if (searchText) {
                        highlightText(card.querySelector('.card-title'), searchText);
                        highlightText(card.querySelector('.card-description'), searchText);
                    }
                } else {
                    card.classList.remove('visible');
                    card.querySelectorAll('.card-image img.zoomed').forEach(img => img.classList.remove('zoomed'));
                }
            });
            noResults.classList.toggle('visible', visibleCount === 0);
        }

        searchInput.addEventListener('input', filterCards);
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            filterCards();
        });

        filterTags.forEach(tag => {
            tag.addEventListener('click', () => {
                filterTags.forEach(t => t.classList.remove('active'));
                tag.classList.add('active');
                activeTag = tag.getAttribute('data-tag');
                filterCards();
            });
        });

        filterTags[0].classList.add('active');
        filterCards();

        // Scroll-to-top functionality
        const scrollToTopBtn = document.querySelector('.scroll-to-top');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Feedback functionality
        const feedbackBtn = document.querySelector('.feedback-btn');
        const feedbackModal = document.querySelector('.feedback-modal');
        const feedbackModalClose = document.querySelector('.feedback-modal-close');
        const feedbackForm = document.querySelector('.feedback-form');
        const submitFeedbackBtn = document.querySelector('#submit-feedback');
        const successToast = document.querySelector('#success-toast');
        const emailError = document.querySelector('#email-error');
        const imageInput = document.querySelector('#feedback-image');
        const imagePreview = document.querySelector('#image-preview');

        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                feedbackBtn.classList.add('visible');
            } else {
                feedbackBtn.classList.remove('visible');
            }
        });
        feedbackBtn.addEventListener('click', () => {
            feedbackModal.classList.add('active');
        });
        feedbackModalClose.addEventListener('click', () => {
            feedbackModal.classList.remove('active');
            emailError.classList.remove('visible');
            imagePreview.classList.remove('visible');
            imagePreview.src = '';
        });
        feedbackModal.addEventListener('click', (e) => {
            if (e.target === feedbackModal) {
                feedbackModal.classList.remove('active');
                emailError.classList.remove('visible');
                imagePreview.classList.remove('visible');
                imagePreview.src = '';
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && feedbackModal.classList.contains('active')) {
                feedbackModal.classList.remove('active');
                emailError.classList.remove('visible');
                imagePreview.classList.remove('visible');
                imagePreview.src = '';
            }
        });
        imageInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imagePreview.src = event.target.result;
                    imagePreview.classList.add('visible');
                };
                reader.readAsDataURL(file);
            } else {
                imagePreview.classList.remove('visible');
                imagePreview.src = '';
            }
        });
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.querySelector('#feedback-name').value;
            const email = document.querySelector('#feedback-email').value;
            const message = document.querySelector('#feedback-message').value;
            const imageFile = imageInput.files[0];
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                emailError.classList.add('visible');
                return;
            }
            emailError.classList.remove('visible');
            const formData = { name, email, message };
            if (imageFile) formData.image = imageFile.name;
            console.log('Phản hồi:', formData);
            successToast.classList.add('visible');
            setTimeout(() => {
                successToast.classList.remove('visible');
            }, 1000);
            feedbackModal.classList.remove('active');
            feedbackForm.reset();
            imagePreview.classList.remove('visible');
            imagePreview.src = '';
        });