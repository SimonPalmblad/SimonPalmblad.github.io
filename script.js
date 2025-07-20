let cachedCSS = null;

/**
* Summary: Creates an element with an icon and with descriptive text. Optional: clicking the description leads to a URL link.
* @param {string} target-url - the URL to open.
 * @param {string} button-text - the string description.
 * */
class ProjectPreviewTemplate extends HTMLElement
{

    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }
    async connectedCallback()
    {
       if(!cachedCSS)
        {
            const res = await fetch('style.css');
            cachedCSS = await res.text();
        }

        const style = document.createElement('style');
        style.textContent = cachedCSS;

        this.shadowRoot.appendChild(style);

        const url = this.getAttribute('target-url') || 'no_URL';

        // -------- MAIN ELEMENT ---------- //
        const mainElement = document.createElement('div');
        mainElement.className = 'element';

        const icon = document.createElement('div');
        icon.className = 'icon';

        // ------- ELEMENT HOLDING DESC & LINK BUTTONS -------- //
        const descriptionElement = document.createElement('div');
        descriptionElement.className = 'description-element';

        const rightBar = document.createElement('div')
        rightBar.classList.add('description-element-sidebar');
        rightBar.classList.add('striped-background');

        const leftBar = document.createElement('div');
        leftBar.classList.add('description-element-sidebar');
        // leftBar.classList.add('hidden-element');

        const descriptionContainer = document.createElement('div');
        descriptionContainer.className = 'description-container';

        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = this.getAttribute('description');

        // ----- READ MORE BUTTON & CONTAINER ------ //
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const buttonReadMore = document.createElement('button');
        buttonReadMore.className = 'button';
        buttonReadMore.textContent = 'Read more';

        buttonReadMore.addEventListener('click', () => {
            const isActive = buttonReadMore.classList.toggle('is-active-button');
            leftBar.classList.toggle('highlighted')
            AnimateContainerExpansion(readMoreContainer);

            if(isActive){
                buttonReadMore.textContent = 'Close';
            }

            else{
                buttonReadMore.textContent = 'Read more';
            }
        });

        const buttonURL = document.createElement('button');
        buttonURL.className = 'button';
        buttonURL.textContent = 'Go to project ➡';
        buttonURL.addEventListener('click', () => this.GoToURL(url))

        const readMoreContainer = document.createElement('div');
        readMoreContainer.className = 'read-more';
        readMoreContainer.classList.add('hidden-element');

        const readMoreText = document.createElement('p');
        readMoreText.textContent = this.getAttribute('read-more-text') || loremIpsum;

        /// ----

        //RESTYLE SO IT'S ATTACHED TO THE DESC ELEMENT BUT OFFSET HORIZONTALLY
        requestAnimationFrame(() => {
            const descriptionRect = descriptionElement.getBoundingClientRect();
            icon.style.top = descriptionRect.height/2+'px';
        });

        /// -------- APPEND HTML ELEMENTS -------- ///
        readMoreContainer.appendChild(readMoreText);

        buttonContainer.appendChild(buttonReadMore);
        buttonContainer.appendChild(buttonURL);

        descriptionContainer.appendChild(description);
        descriptionContainer.appendChild(buttonContainer);
        descriptionContainer.appendChild(readMoreContainer);

        descriptionElement.appendChild(icon);
        descriptionElement.appendChild(leftBar);
        descriptionElement.appendChild(descriptionContainer);
        descriptionElement.appendChild(rightBar);

        mainElement.appendChild(descriptionElement);
        this.shadowRoot.appendChild(mainElement);
    }

    GoToURL(url)
    {
        if(url === 'no_URL')
        {
            return;
        }
        window.open(url, '_blank');
    }
}

customElements.define('project-preview-template', ProjectPreviewTemplate);

function AnimateContainerExpansion(resizedContainer){

    const isVisible = resizedContainer.classList.toggle('visible');

    // EXPAND
    if (isVisible) {
        resizedContainer.style.height = '0px';
        resizedContainer.style.offsetHeight;

        resizedContainer.style.height = resizedContainer.scrollHeight + 'px';

    // COLLAPSE
    } else {
        resizedContainer.style.transition = 'height 0.15s ease-in-out';
        resizedContainer.style.height = resizedContainer.scrollHeight + 'px';

        resizedContainer.style.offsetHeight;

        resizedContainer.style.height = '0px';
    }

    resizedContainer.addEventListener('transitionend', function handler() {
        resizedContainer.style.transition = '';
        resizedContainer.removeEventListener('transitionend', handler);
    });
}




let loremIpsum = 'There are many variations of passages of Lorem Ipsum available, ' +
    'but the majority have suffered alteration in some form, by injected humour, ' +
    'or randomised words which don\'t look even slightly believable. ' +
    'If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.';