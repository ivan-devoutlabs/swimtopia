document.addEventListener('DOMContentLoaded', function() {
    const copyBtns = document.querySelectorAll('.share-copy');

    let copyMessageTimeout;

    function showcopyMessage(text) {
        let messageElement = document.getElementById('copy-copyMessage');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.id = 'copy-copyMessage';
            messageElement.className = 'copy-copyMessage-notification';
            document.body.appendChild(messageElement);
        }
        
        messageElement.textContent = text; 
        
        messageElement.classList.add('is-visible');
        
        clearTimeout(copyMessageTimeout);
        
        copyMessageTimeout = setTimeout(() => {
            messageElement.classList.remove('is-visible');
        }, 3000);
    }

    if (copyBtns.length > 0) {
        copyBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showcopyMessage('Link copied to clipboard!');
                }).catch(err => {
                    console.error('Failed to copy: ', err);
                });
            });
        });
    }
});