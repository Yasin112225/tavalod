        const CARDS_DATA = [
            {
                title: "دبیرستان",
                image: "https://cdn.imgurl.ir/uploads/h11937_2.jpg"
            },
            {
                title: "مشهد",
                image: "https://cdn.imgurl.ir/uploads/z455_3.jpg"
            },
            {
                title: "🌸 پارک گیاه شناسی",
                image: "https://cdn.imgurl.ir/uploads/v664405_4.jpg"
            },
            {
                title: "اتاق فرار",
                image: "https://cdn.imgurl.ir/uploads/h58708_5.jpg"
            },
            {
                title: "دبیرستان",
                image: "https://cdn.imgurl.ir/uploads/e587559_6.jpg"
            },
            {
                title: "",
                image: "https://cdn.imgurl.ir/uploads/d099720_8.jpg"
            },
            {
                title: "منطقه آسیا",
                image: "https://cdn.imgurl.ir/uploads/l315043_9.jpg"
            },
            {
                title: "بام تهران",
                image: "https://cdn.imgurl.ir/uploads/e25411_10.jpg"
            },
            {
                title: "موزه کامپیوتر",
                image: "https://cdn.imgurl.ir/uploads/w290373_11.jpg"
            },
            {
                title: "طفولیت",
                image: "https://cdn.imgurl.ir/uploads/q93_12.jpg"
            },
            {
                title: "طفولیت",
                image: "https://cdn.imgurl.ir/uploads/h17708_13.jpg"
            },
            {
                title: "طفولیت",
                image: "https://cdn.imgurl.ir/uploads/c65707_14.jpg"
            },
            {
                title: "طفولیت",
                image: "https://cdn.imgurl.ir/uploads/l56987_15.jpg"
            },
            {
                title: "طفولیت",
                image: "https://cdn.imgurl.ir/uploads/i655718_16.jpg"
            },
            {
                title: "طفولیت",
                image: "https://cdn.imgurl.ir/uploads/j6697_17.jpg"
            },
            {
                title: "طفولیت",
                image: "https://cdn.imgurl.ir/uploads/u997940_18.jpg"
            },
            {
                title: "طفولیت",
                image: "https://cdn.imgurl.ir/uploads/t390973_19.jpg"
            },
            
        ];

        // ============================================
        // تنظیمات ظاهری  
        // ============================================
        const CARD_SETTINGS = {
            cardWidth: 280,        // عرض کارت در دسکتاپ
            gapBetweenCards: 18,   // فاصله بین کارت‌ها
            imageBorderRadius: 18, // گردی گوشه تصویر
            defaultImageHeight: 180,
            cardContentHeight: 65
        };

        // ============================================
        // کد اصلی
        // ============================================
        
        let cardsData = [...CARDS_DATA];
        let cardHeights = new Map();

        // تابع برای لود کردن عکس و گرفتن ابعاد واقعی
        function loadImageAndGetDimensions(url) {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    resolve({
                        width: img.width,
                        height: img.height,
                        aspectRatio: img.height / img.width
                    });
                };
                img.onerror = () => reject(new Error('Failed to load'));
                img.src = url;
            });
        }

        // نمایش مودال با عکس بزرگ
        function showModal(imageUrl) {
            // بررسی وجود مودال، اگر نبود بساز
            let modal = document.getElementById('imageModal');
            if (!modal) {
                modal = document.createElement('div');
                modal.id = 'imageModal';
                modal.style.cssText = `
                    display: none;
                    position: fixed;
                    z-index: 2000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0,0,0,0.95);
                    backdrop-filter: blur(10px);
                    cursor: pointer;
                `;
                
                const closeSpan = document.createElement('span');
                closeSpan.innerHTML = '&times;';
                closeSpan.style.cssText = `
                    position: absolute;
                    top: 20px;
                    right: 35px;
                    color: #fff;
                    font-size: 40px;
                    font-weight: bold;
                    cursor: pointer;
                    z-index: 2001;
                    transition: 0.3s;
                `;
                closeSpan.onclick = () => closeModal();
                
                const modalImage = document.createElement('img');
                modalImage.id = 'modalImage';
                modalImage.style.cssText = `
                    margin: auto;
                    display: block;
                    max-width: 90%;
                    max-height: 90%;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    border-radius: 20px;
                `;
                
                modal.appendChild(closeSpan);
                modal.appendChild(modalImage);
                modal.onclick = (e) => {
                    if (e.target === modal) closeModal();
                };
                document.body.appendChild(modal);
            }
            
            const modalImage = document.getElementById('modalImage');
            modalImage.src = imageUrl;
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
        }

        // بستن مودال
        function closeModal() {
            const modal = document.getElementById('imageModal');
            if (modal) {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }
        }

        // بستن مودال با دکمه Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.getElementById('imageModal');
                if (modal && modal.style.display === 'block') {
                    closeModal();
                }
            }
        });

        // ساخت کارت با ارتفاع خودکار بر اساس عکس
        async function createCardElement(data, index) {
            const card = document.createElement('div');
            card.className = 'card';
            card.setAttribute('data-id', index);
            card.style.width = `${CARD_SETTINGS.cardWidth}px`;

            const imgDiv = document.createElement('div');
            imgDiv.className = 'card-img';

            let imageHeight = CARD_SETTINGS.defaultImageHeight;

            if (data.image && data.image.trim() !== "") {
                imgDiv.style.backgroundImage = `url('${data.image}')`;
                imgDiv.style.backgroundSize = 'cover';
                imgDiv.style.backgroundPosition = 'center';

                // کلیک روی عکس برای بزرگنمایی
                imgDiv.addEventListener('click', (e) => {
                    e.stopPropagation();
                    showModal(data.image);
                });

                try {
                    const dimensions = await loadImageAndGetDimensions(data.image);
                    imageHeight = CARD_SETTINGS.cardWidth * dimensions.aspectRatio;
                    imgDiv.style.height = `${imageHeight}px`;
                } catch (e) {
                    imgDiv.style.height = `${CARD_SETTINGS.defaultImageHeight}px`;
                    imageHeight = CARD_SETTINGS.defaultImageHeight;
                }
            } else {
                imgDiv.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
                imgDiv.style.height = `${CARD_SETTINGS.defaultImageHeight}px`;
                imageHeight = CARD_SETTINGS.defaultImageHeight;
                imgDiv.style.cursor = 'default';
                imgDiv.style.display = 'flex';
                imgDiv.style.alignItems = 'center';
                imgDiv.style.justifyContent = 'center';
                imgDiv.innerHTML = '<span style="color:white; font-size:32px;">🖼️</span>';
            }

            imgDiv.style.borderRadius = `${CARD_SETTINGS.imageBorderRadius}px ${CARD_SETTINGS.imageBorderRadius}px 0 0`;
            
            const content = document.createElement('div');
            content.className = 'card-content';

            const title = document.createElement('div');
            title.className = 'card-title';
            title.textContent = data.title;

            content.appendChild(title);
            card.appendChild(imgDiv);
            card.appendChild(content);

            const totalHeight = imageHeight + CARD_SETTINGS.cardContentHeight;
            cardHeights.set(index, totalHeight);
            card.style.height = `${totalHeight}px`;

            return card;
        }

        function checkCollision(rect1, rect2, gap) {
            return !(rect1.x + rect1.w + gap < rect2.x ||
                     rect2.x + rect2.w + gap < rect1.x ||
                     rect1.y + rect1.h + gap < rect2.y ||
                     rect2.y + rect2.h + gap < rect1.y);
        }

        async function layoutDenseRandom() {
            if (window.innerWidth <= 768) return;

            const cards = document.querySelectorAll('#cardsContainer .card');
            if (cards.length === 0) return;

            const marginX = 25;
            const marginY = 30;

            const containerRect = document.getElementById('cardsContainer').getBoundingClientRect();
            let maxWidth = Math.max(containerRect.width, window.innerWidth - 50);
            let maxHeight = Math.max(window.innerHeight * 1.8, cards.length * 280);

            const minX = marginX;
            const maxX = maxWidth - CARD_SETTINGS.cardWidth - marginX;
            const minY = marginY;

            const placedRects = [];

            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                const cardId = parseInt(card.getAttribute('data-id'));
                const cardHeight = cardHeights.get(cardId) || (CARD_SETTINGS.defaultImageHeight + CARD_SETTINGS.cardContentHeight);

                let attempts = 0;
                const maxAttempts = 1500;
                let placed = false;

                while (!placed && attempts < maxAttempts) {
                    const randX = minX + Math.random() * Math.max(0, maxX - minX);
                    const randY = minY + Math.random() * maxHeight;

                    const newRect = {
                        x: randX,
                        y: randY,
                        w: CARD_SETTINGS.cardWidth,
                        h: cardHeight
                    };

                    let hasCollision = false;
                    for (let existing of placedRects) {
                        if (checkCollision(newRect, existing, CARD_SETTINGS.gapBetweenCards)) {
                            hasCollision = true;
                            break;
                        }
                    }

                    if (!hasCollision) {
                        card.style.left = `${randX}px`;
                        card.style.top = `${randY}px`;
                        placedRects.push(newRect);
                        placed = true;
                        break;
                    }
                    attempts++;
                }

                if (!placed) {
                    const fallbackX = minX + Math.random() * Math.max(0, maxX - minX);
                    const fallbackY = minY + (i * (CARD_SETTINGS.defaultImageHeight + CARD_SETTINGS.cardContentHeight + 10));
                    card.style.left = `${fallbackX}px`;
                    card.style.top = `${fallbackY}px`;
                    placedRects.push({
                        x: fallbackX,
                        y: fallbackY,
                        w: CARD_SETTINGS.cardWidth,
                        h: cardHeight
                    });
                }
                
                card.style.display = 'block';
            }

            let maxBottom = 0;
            cards.forEach(card => {
                const top = parseFloat(card.style.top) || 0;
                const cardId = parseInt(card.getAttribute('data-id'));
                const cardHeight = cardHeights.get(cardId) || (CARD_SETTINGS.defaultImageHeight + CARD_SETTINGS.cardContentHeight);
                const bottom = top + cardHeight;
                if (bottom > maxBottom) maxBottom = bottom;
            });

            const requiredHeight = Math.max(maxBottom + 80, window.innerHeight + 200);
            document.getElementById('cardsContainer').style.height = `${requiredHeight}px`;
            
            const cardsWithImages = cardsData.filter(d => d.image && d.image.trim() !== "").length;
            document.getElementById('stats').innerHTML = `📊 ${cards.length} کارت | ${cardsWithImages} تا با عکس | ارتفاع: ${Math.round(requiredHeight)}px`;
        }

        function layoutMobile() {
            const cards = document.querySelectorAll('#cardsContainer .card');
            cards.forEach(card => {
                card.style.position = 'relative';
                card.style.left = 'auto';
                card.style.top = 'auto';
                card.style.width = '95%';
                card.style.maxWidth = '380px';
                card.style.margin = '0 auto';
                card.style.display = 'block';
            });
            document.getElementById('cardsContainer').style.height = 'auto';
        }

        async function renderAllCards() {
            const container = document.getElementById('cardsContainer');
            container.innerHTML = '';
            cardHeights.clear();

            const cardPromises = cardsData.map((data, idx) => createCardElement(data, idx));
            const cards = await Promise.all(cardPromises);

            cards.forEach((card) => {
                container.appendChild(card);
            });

            if (window.innerWidth > 768) {
                setTimeout(() => layoutDenseRandom(), 150);
            } else {
                layoutMobile();
            }
        }

        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                if (window.innerWidth > 768) {
                    layoutDenseRandom();
                } else {
                    layoutMobile();
                }
            }, 200);
        });

        renderAllCards();
