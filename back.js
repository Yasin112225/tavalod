 (function(){
            // ---------- ستاره‌ها (نقاط ریز سفید + قرمز ملایم) ----------
            const starCanvas = document.getElementById('starCanvas');
            const starCtx = starCanvas.getContext('2d');
            
            // ---------- کانواس اتمسفر قرمز و غبار کهکشانی (حس قرمز خیلی ملایم) ----------
            const nebulaCanvas = document.getElementById('nebulaCanvas');
            const nebulaCtx = nebulaCanvas.getContext('2d');
            
            let width, height;
            
            // تعداد ستاره‌ها - کم و دور (بین 130 تا 220)
            let starCount = 170;
            
            // آرایه ستاره‌ها
            let stars = [];
            
            // تنظیم ابعاد هر دو کانواس (همیشه کل صفحه را می‌پوشانند)
            function resizeCanvases() {
                width = window.innerWidth;
                height = window.innerHeight;
                starCanvas.width = width;
                starCanvas.height = height;
                nebulaCanvas.width = width;
                nebulaCanvas.height = height;
                
                // باز تولید ستاره‌ها با ابعاد جدید
                generateStars();
                drawStars();
                drawNebula(); 
            }
            
            // تولید ستاره‌ها (نقاط ریز بدون گردی و با امکان رنگ قرمز ملایم)
            function generateStars() {
                const newStars = [];
                let finalCount = starCount;
                const area = width * height;
                if (area < 400000) finalCount = 100 + Math.floor(Math.random() * 50);
                else if (area > 1800000) finalCount = 170 + Math.floor(Math.random() * 55);
                else finalCount = 130 + Math.floor(Math.random() * 65);
                finalCount = Math.min(finalCount, 230); // حفظ حس خلوت و دور
                
                for (let i = 0; i < finalCount; i++) {
                    const x = Math.random() * width;
                    const y = Math.random() * height;
                    
                    // ابعاد بسیار ریز (نقاط دور و بدون شکل دایره مشخص)
                    let w = 0.65 + Math.random() * 1.2;
                    let h = 0.65 + Math.random() * 1.3;
                    if (Math.random() > 0.8) {
                        w += 0.2;
                        h -= 0.05;
                    }
                    w = Math.min(w, 1.8);
                    h = Math.min(h, 1.8);
                    
                    // رنگ بندی: 84% سفید شیری، 16% با ته رنگ قرمز ملایم (طبیعی)
                    let baseColor;
                    const isReddish = Math.random() < 0.16;
                    if (isReddish) {
                        // قرمز-صورتی کمرنگ برای هماهنگی با تم
                        baseColor = {r: 215, g: 85 + Math.random() * 65, b: 75 + Math.random() * 55};
                    } else {
                        const whiteIntensity = 195 + Math.random() * 60;
                        baseColor = {r: whiteIntensity, g: whiteIntensity - 12 + Math.random() * 22, b: whiteIntensity - 5 + Math.random() * 28};
                    }
                    
                    const baseAlpha = 0.1 + Math.random() * 0.78;
                    let currentAlpha = baseAlpha;
                    let targetAlpha = (Math.random() > 0.5) ? (0.06 + Math.random() * 0.82) : (0.18 + Math.random() * 0.72);
                    const speed = 0.006 + Math.random() * 0.027; // چشمک زن آرام
                    let changeCounter = Math.floor(28 + Math.random() * 88);
                    
                    newStars.push({
                        x, y, width: w, height: h,
                        currentAlpha: currentAlpha,
                        targetAlpha: targetAlpha,
                        speed: speed,
                        changeCounter: changeCounter,
                        color: baseColor,
                        isReddish: isReddish
                    });
                }
                stars = newStars;
            }
            
            // به روز رسانی چشمک زدن تصادفی (خاموش و روشن شدن مستقل)
            function updateTwinkling() {
                for (let i = 0; i < stars.length; i++) {
                    const s = stars[i];
                    if (s.currentAlpha < s.targetAlpha) {
                        s.currentAlpha += s.speed;
                        if (s.currentAlpha > s.targetAlpha) s.currentAlpha = s.targetAlpha;
                    } else if (s.currentAlpha > s.targetAlpha) {
                        s.currentAlpha -= s.speed;
                        if (s.currentAlpha < s.targetAlpha) s.currentAlpha = s.targetAlpha;
                    }
                    
                    s.changeCounter--;
                    if (s.changeCounter <= 0) {
                        const r = Math.random();
                        if (r < 0.4) {
                            s.targetAlpha = 0.03 + Math.random() * 0.14;  // خاموشی
                        } else if (r < 0.7) {
                            s.targetAlpha = 0.22 + Math.random() * 0.38;  // نیمه روشن
                        } else {
                            s.targetAlpha = 0.58 + Math.random() * 0.38;  // روشن
                        }
                        if (Math.random() < 0.1) s.targetAlpha = 0.8 + Math.random() * 0.18;
                        s.changeCounter = Math.floor(32 + Math.random() * 100);
                        if (Math.random() < 0.08) {
                            s.speed = 0.005 + Math.random() * 0.03;
                        }
                    }
                    if (s.currentAlpha < 0) s.currentAlpha = 0;
                    if (s.currentAlpha > 1) s.currentAlpha = 1;
                }
            }
            
            // رسم ستاره‌ها (نقاط ریز مستطیلی/مربعی بدون گردی)
            function drawStars() {
                if (!starCtx) return;
                starCtx.clearRect(0, 0, width, height);
                
                for (let i = 0; i < stars.length; i++) {
                    const s = stars[i];
                    if (s.currentAlpha <= 0.008) continue;
                    const { r, g, b } = s.color;
                    starCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${s.currentAlpha})`;
                    starCtx.fillRect(s.x, s.y, s.width, s.height);
                }
            }
            
            // ---------- غبار کهکشانی با ته رنگ قرمز طبیعی ----------
            let nebulaParticles = [];
            
            function generateNebula() {
                const particles = [];
                const particleCount = 160;  // تعداد متوسط برای حس ملایم
                for (let i = 0; i < particleCount; i++) {
                    const x = Math.random() * width;
                    const y = Math.random() * height;
                    const radius = 2 + Math.random() * 15;
                    // رنگ قرمز - دودی بسیار ملایم
                    const redVal = 65 + Math.random() * 85;
                    const greenVal = 18 + Math.random() * 45;
                    const blueVal = 20 + Math.random() * 48;
                    const alpha = 0.03 + Math.random() * 0.12;
                    particles.push({
                        x, y, radius,
                        r: redVal, g: greenVal, b: blueVal,
                        alpha: alpha,
                    });
                }
                nebulaParticles = particles;
            }
            
            function drawNebula() {
                if (!nebulaCtx) return;
                nebulaCtx.clearRect(0, 0, width, height);
                
                // گرادیان‌های بسیار ملایم قرمز در پس‌زمینه برای القای تم بدون افراط
                const grad = nebulaCtx.createRadialGradient(width*0.2, height*0.25, 30, width*0.5, height*0.5, width*0.8);
                grad.addColorStop(0, 'rgba(75, 12, 30, 0.09)');
                grad.addColorStop(0.6, 'rgba(35, 5, 18, 0.05)');
                grad.addColorStop(1, 'rgba(10, 0, 5, 0)');
                nebulaCtx.fillStyle = grad;
                nebulaCtx.fillRect(0, 0, width, height);
                
                const grad2 = nebulaCtx.createLinearGradient(0, height*0.7, width*0.8, height);
                grad2.addColorStop(0, 'rgba(60, 10, 25, 0.07)');
                grad2.addColorStop(1, 'rgba(25, 3, 14, 0.02)');
                nebulaCtx.fillStyle = grad2;
                nebulaCtx.fillRect(0, 0, width, height);
                
                // ذرات غبار محو و آرام
                for (let p of nebulaParticles) {
                    nebulaCtx.beginPath();
                    nebulaCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    nebulaCtx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.alpha * 0.75})`;
                    nebulaCtx.fill();
                }
                
                // لکه‌های پهن و پراکنده قرمز (در حد بسیار ملایم)
                for (let i = 0; i < 10; i++) {
                    nebulaCtx.beginPath();
                    const xSpot = (Math.sin(Date.now() * 0.00028 + i) * width * 0.15) + width * (0.2 + (i * 0.06));
                    const ySpot = (Math.cos(Date.now() * 0.00022 + i * 1.3) * height * 0.1) + height * 0.55;
                    nebulaCtx.ellipse(xSpot, ySpot, 75 + Math.sin(Date.now()*0.0004 + i)*25, 45, 0, 0, Math.PI*2);
                    nebulaCtx.fillStyle = `rgba(139, 42, 69, 0.02)`;
                    nebulaCtx.fill();
                }
            }
            
            // به روز رسانی پویای غبار (حرکت ملایم برای پویایی)
            let lastNebulaUpdate = 0;
            function updateNebulaDynamic(now) {
                if (!nebulaCtx) return;
                if (now - lastNebulaUpdate > 2800) {
                    for (let p of nebulaParticles) {
                        if (Math.random() < 0.28) {
                            p.x += (Math.random() - 0.5) * 2.2;
                            p.y += (Math.random() - 0.5) * 1.9;
                            p.x = Math.min(width + 30, Math.max(-30, p.x));
                            p.y = Math.min(height + 30, Math.max(-30, p.y));
                        }
                    }
                    lastNebulaUpdate = now;
                    drawNebula();
                }
            }
            
            // انیمیشن اصلی (ستاره‌ها چشمک می‌زنند، غبار به روز می‌شود)
            let animId = null;
            function animate(timestamp) {
                updateTwinkling();
                drawStars();
                updateNebulaDynamic(timestamp);
                animId = requestAnimationFrame(animate);
            }
            
            // راه‌اندازی اولیه و مدیریت ریسایز (با حفظ fixed)
            function init() {
                resizeCanvases();
                generateNebula();
                drawNebula();
                window.addEventListener('resize', () => {
                    resizeCanvases();
                    generateNebula();
                    drawNebula();
                });
                window.addEventListener('orientationchange', () => {
                    setTimeout(() => {
                        resizeCanvases();
                        generateNebula();
                        drawNebula();
                    }, 40);
                });
                animate();
            }
            
            // تنظیم تعداد اولیه ستاره‌ها (خلوت و دور)
            const initWidth = window.innerWidth;
            const initHeight = window.innerHeight;
            const areaInit = initWidth * initHeight;
            if (areaInit < 500000) starCount = 115;
            else if (areaInit > 2000000) starCount = 200;
            else starCount = 155;
            
            window.addEventListener('contextmenu', (e) => e.preventDefault());
            init();
        })();
