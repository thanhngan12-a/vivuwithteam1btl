
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
            mongcai: {
                src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.266827073536!2d107.95123531504247!3d21.52481198575564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314b4f6b5b3b8f5f%3A0x6c8b5e7e4b7c8e!2sM%C3%B3ng%20C%C3%A1i%2C%20Qu%E1%BA%A3ng%20Ninh%2C%20Vietnam!5e0!3m2!1sen!2s!4v1698765432109!5m2!1sen!2s',
                caption: 'Bản đồ định vị Móng Cái, trung tâm thương mại biên giới sầm uất của Quảng Ninh.'
            },
            halong: {
                src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3722.876384384249!2d107.04701331504214!3d20.95199598605714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a7a7d6b4b5b67%3A0x4e6b5b6c8b7c8e!2sHa%20Long%20Bay!5e0!3m2!1sen!2s!4v1698765432109!5m2!1sen!2s',
                caption: 'Bản đồ định vị Vịnh Hạ Long, di sản thiên nhiên thế giới tại Quảng Ninh.'
            },
            yentu: {
                src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.506190928804!2d106.72396331504153!3d21.151825985995857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314a6b8b8b8b8b8b%3A0x8e8e8e8e8e8e8e!2sYen%20Tu%20Mountain!5e0!3m2!1sen!2s!4v1698765432109!5m2!1sen!2s',
                caption: 'Bản đồ định vị Yên Tử, trung tâm văn hóa và tâm linh của Quảng Ninh.'
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
                    <p><strong>Thời tiết Quảng Ninh (21/05/2025):</strong></p>
                    <p>Nhiệt độ: 25°C</p>
                    <p>Tình trạng: Trời quang, ít mây</p>
                    <p>Độ ẩm: 70%</p>
                    <button onclick="toggleWeather()">Đóng</button>
                `;
                overlay.style.display = 'block';
                button.style.display = 'none';
            }
        }
  