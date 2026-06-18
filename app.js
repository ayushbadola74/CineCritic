$(document).ready(() => {
    $('#hamburger-menu').click(() => {
        $('#hamburger-menu').toggleClass('active')
        $('#nav-menu').toggleClass('active')
    })

    // setting owl carousel

    let navText = ["<i class='bx bx-chevron-left'></i>", "<i class='bx bx-chevron-right'></i>"]

    $('#hero-carousel').owlCarousel({
        items: 1,
        dots: false,
        loop: true,
        nav:true,
        navText: navText,
        autoplay: true,
        autoplayHoverPause: true
    })

    $('#top-movies-slide').owlCarousel({
        items: 2,
        dots: false,
        loop: true,
        autoplay: true,
        autoplayHoverPause: true,
        responsive: {
            500: {
                items: 3
            },
            1280: {
                items: 4
            },
            1600: {
                items: 6
            }
        }
    })

    $('.movies-slide').owlCarousel({
        items: 2,
        dots: false,
        nav:true,
        navText: navText,
        margin: 15,
        responsive: {
            500: {
                items: 2
            },
            1280: {
                items: 4
            },
            1600: {
                items: 6
            }
        }
    });

    // Make movie cards clickable across the entire website
    $(document).on('click', '.movie-item', function(e) {
        e.preventDefault();
        
        const titleEl = $(this).find('.movie-item-title');
        const imgEl = $(this).find('img');
        const starEl = $(this).find('.movie-info i.bxs-star').parent();
        const timeEl = $(this).find('.movie-info i.bxs-time').parent();
        const ageEl = $(this).find('.movie-info:last-child');

        const title = titleEl.text().trim();
        const poster = imgEl.attr('src');
        const rating = starEl.text().trim() || "9.5";
        const duration = timeEl.text().trim() || "120 mins";
        const age = ageEl.text().trim() || "16+";
        
        // Save metadata to localStorage
        localStorage.setItem("selectedMovie", JSON.stringify({
            title: title,
            poster: poster,
            rating: rating,
            duration: duration,
            age: age
        }));
        
        // Redirect
        window.location.href = `details.html?title=${encodeURIComponent(title)}`;
    });

    // Make hero slides and their buttons clickable
    $(document).on('click', '.hero-slide-item .btn, .hero-slide-item', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        const slideItem = $(this).closest('.hero-slide-item');
        if (!slideItem.length) return;
        
        const titleEl = slideItem.find('.item-content-title');
        const imgEl = slideItem.find('img');
        const starEl = slideItem.find('.movie-info i.bxs-star').parent();
        const timeEl = slideItem.find('.movie-info i.bxs-time').parent();
        const descEl = slideItem.find('.item-content-description');
        const ageEl = slideItem.find('.movie-info:last-child');

        const title = titleEl.text().trim();
        const poster = imgEl.attr('src');
        const rating = starEl.text().trim() || "9.5";
        const duration = timeEl.text().trim() || "120 mins";
        const description = descEl.text().trim();
        const age = ageEl.text().trim() || "16+";

        if (!title) return;
        
        localStorage.setItem("selectedMovie", JSON.stringify({
            title: title,
            poster: poster,
            rating: rating,
            duration: duration,
            description: description,
            age: age
        }));
        
        window.location.href = `details.html?title=${encodeURIComponent(title)}`;
    });
})