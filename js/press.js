export function initPress(url) {
    if (!url) {
        return;
    }

    var loadingTask = pdfjsLib.getDocument(url);
    loadingTask.promise.then(function(pdf) {
        var viewer = document.getElementById('pdf-viewer');

        for (var pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            pdf.getPage(pageNum).then(function(page) {
                var viewport = page.getViewport({ scale: 3 });
                var canvas = document.createElement('canvas');
                canvas.classList.add('fade-in');  // Add the fade-in class to the canvas initially
                viewer.appendChild(canvas);

                var context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                var renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);

                // Add Intersection Observer for scroll-based fade-in
                const observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            observer.unobserve(entry.target);  // Stop observing once the element is visible
                        }
                    });
                }, { threshold: 0.3 });  // Adjust the threshold as needed

                observer.observe(canvas);
            });
        }
    }).catch(function(error) {
        console.error("Error loading PDF:", error);
    });
}
