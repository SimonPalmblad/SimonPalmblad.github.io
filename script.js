let cachedCSS = null;

/**
* Summary: Creates an element with an icon and with descriptive text. Optional: clicking the description leads to a URL link.
* @param {string} target-url - the URL to open.
 * @param {string} button-text - the string description.
 * */
class ProjectPreviewTemplate extends HTMLElement
{
    readMoreElement = null;

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

        const container = document.createElement('div');
        container.className = 'element';

        const icon = document.createElement('div');
        icon.className = 'icon';

        const descriptionContainer = document.createElement('div');
        descriptionContainer.className = 'description-container';

        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = this.getAttribute('description');

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const buttonReadMore = document.createElement('button');
        buttonReadMore.className = 'button';
        buttonReadMore.textContent = 'Read more';
        buttonReadMore.addEventListener('click', () => {
            const isActive = buttonReadMore.classList.toggle('is-active');
            // buttonReadMore.setAttribute('aria-pressed', isActive);
            this.readMoreElement = this.DisplayMoreInfo(descriptionContainer, isActive)

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

        buttonContainer.appendChild(buttonReadMore);
        buttonContainer.appendChild(buttonURL);
        descriptionContainer.appendChild(description);
        descriptionContainer.appendChild(buttonContainer);
        container.appendChild(icon);
        container.appendChild(descriptionContainer);
        this.shadowRoot.appendChild(container);
    }

    GoToURL(url)
    {
        if(url === 'no_URL')
        {
            return;
        }
        window.open(url, '_blank');
    }

    DisplayMoreInfo(container, isActive) {

        let element = null;

        if(isActive)
        {
            element = this.CreateReadMoreElement(container);
            return element;
        }

        container.removeChild(this.readMoreElement);
        return element;
    }

    CreateReadMoreElement(container) {
        const readMoreElement = document.createElement('read-more');
        return container.appendChild(readMoreElement);
    }
}

customElements.define('project-preview-template', ProjectPreviewTemplate);

class ReadMore extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
    }

    async connectedCallback() {
        if(!cachedCSS)
        {
        const res = await fetch('style.css');
        cachedCSS = await res.text();
        }

        const style = document.createElement('style');
        style.textContent = cachedCSS;

        this.shadowRoot.appendChild(style);

        const container = document.createElement('div');
        container.className = 'read-more';

        const text = document.createElement('p');
        text.textContent = this.getAttribute('text') || loremIpsum;

        container.appendChild(text);

        this.shadowRoot.appendChild(container);
    }

}

customElements.define('read-more', ReadMore);



let loremIpsum = 'There are many variations of passages of Lorem Ipsum available, ' +
    'but the majority have suffered alteration in some form, by injected humour, ' +
    'or randomised words which don\'t look even slightly believable. ' +
    'If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.';