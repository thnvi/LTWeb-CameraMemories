document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;

    function showSlide(index) {
        slides.forEach((slide, idx) => {
            slide.classList.remove('active');
            if (idx === index) {
                slide.classList.add('active');
            }
        });
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlide();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlide();
    }

    function updateSlide() {
        const offset = -currentIndex * 100;
        document.querySelector('.slides').style.transform = `translateX(${offset}%)`;
        showSlide(currentIndex);
    }

    // Auto slide every 5 seconds
    setInterval(nextSlide, 5000);

    // Initial setup
    updateSlide();

    // document.querySelector('.next').addEventListener('click', nextSlide);
    // document.querySelector('.prev').addEventListener('click', prevSlide);
});

/*owl slider*/
