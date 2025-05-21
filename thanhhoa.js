  // Smooth scroll to section
        function scrollToSection(sectionId) {
            document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
        }

        // Image modal
        const imageModal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalCaption');

        document.querySelectorAll('.info-card img').forEach(img => {
            img.addEventListener('click', () => {
                modalImage.src = img.src;
                modalCaption.textContent = img.dataset.caption || img.alt;
                imageModal.style.display = 'flex';
            });
        });

        // Feedback modal
        const feedbackModal = document.getElementById('feedbackModal');
        let feedbackStore = [];

        function openFeedbackModal() {
            feedbackModal.style.display = 'flex';
            document.getElementById('feedbackName').value = '';
            document.getElementById('feedbackComment').value = '';
            document.getElementById('feedbackMessage').style.display = 'none';
        }

        function submitFeedback() {
            const name = document.getElementById('feedbackName').value.trim();
            const comment = document.getElementById('feedbackComment').value.trim();
            const feedbackMessage = document.getElementById('feedbackMessage');
            if (!name || !comment) {
                feedbackMessage.textContent = 'Vui lòng điền đầy đủ thông tin!';
                feedbackMessage.className = 'feedback-error';
                feedbackMessage.style.display = 'block';
                return;
            }
            feedbackStore.push({ name, comment, date: new Date().toLocaleString() });
            feedbackMessage.textContent = 'Phản hồi của bạn đã được gửi thành công!';
            feedbackMessage.className = 'feedback-success';
            feedbackMessage.style.display = 'block';
            document.getElementById('feedbackName').value = '';
            document.getElementById('feedbackComment').value = '';
        }

        // Modal close
        function closeModal() {
            imageModal.style.display = 'none';
            feedbackModal.style.display = 'none';
        }

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        });

        // Favorite toggle
        function toggleFavorite(sectionId) {
            const button = document.querySelector(`.info-card[data-id="${sectionId}"] .favorite-button`);
            const isFavorited = button.classList.toggle('favorited');
            button.textContent = isFavorited ? '♥' : '♡';
            let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            if (isFavorited) {
                if (!favorites.includes(sectionId)) favorites.push(sectionId);
            } else {
                favorites = favorites.filter(id => id !== sectionId);
            }
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }

        // Load favorites on page load
        window.addEventListener('load', () => {
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            favorites.forEach(sectionId => {
                const button = document.querySelector(`.info-card[data-id="${sectionId}"] .favorite-button`);
                if (button) {
                    button.classList.add('favorited');
                    button.textContent = '♥';
                }
            });
        });

        // Map toggle
        const mapLocations = {
            thanhhoa: {
                src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3734.324305827093!2d105.76675031503494!3d19.807574986671583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3136f7b1b5b0c2e3%3A0x8c1f43b0b5b1b085!2sThanh%20H%C3%B3a!5e0!3m2!1sen!2s!4v1698765432109!5m2!1sen!2s',
                caption: 'Bản đồ định vị trung tâm thành phố Thanh Hóa, cửa ngõ của miền Trung Việt Nam.'
            },
            samson: {
                src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3735.506190928804!2d105.82196331504153!3d19.738825985995857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3136f8b8b8b8b8b%3A0x8e8e8e8e8e8e8e8e!2sSam%20Son%2C%20Thanh%20Hoa!5e0!3m2!1sen!2s!4v1698765432109!5m2!1sen!2s',
                caption: 'Bản đồ định vị Sầm Sơn, bãi biển nổi tiếng của Thanh Hóa.'
            },
            thanhnhaho: {
                src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3733.097296283804!2d105.60161331504158!3d20.077825985997857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3136fc4c4c0a9a1d%3A0x7b46b8b6c5a3e7f5!2sHo%20Citadel%2C%20Vinh%20Loc%2C%20Thanh%20Hoa!5e0!3m2!1sen!2s!4v1698765432109!5m2!1sen!2s',
                caption: 'Bản đồ định vị Thành Nhà Hồ, di sản thế giới UNESCO.'
            }
        };

        function changeMap(location) {
            const iframe = document.getElementById('mapIframe');
            const caption = document.getElementById('mapCaption');
            iframe.src = mapLocations[location].src;
            caption.textContent = mapLocations[location].caption;
        }

        // Weather toggle (mock data)
        function toggleWeather() {
            const overlay = document.getElementById('weatherOverlay');
            const button = document.querySelector('.weather-button');
            if (overlay.style.display === 'block') {
                overlay.style.display = 'none';
                button.style.display = 'block';
            } else {
                overlay.innerHTML = `
                    <p><strong>Thời tiết Thanh Hóa (21/05/2025):</strong></p>
                    <p>Nhiệt độ: 28°C</p>
                    <p>Tình trạng: Trời quang, ít mây</p>
                    <p>Độ ẩm: 72%</p>
                    <button onclick="toggleWeather()">Đóng</button>
                `;
                overlay.style.display = 'block';
                button.style.display = 'none';
            }
        }