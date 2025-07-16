let cachedCSS = null;

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

        const container = document.createElement('div');
        container.className = 'element';

        const icon = document.createElement('div');
        icon.className = 'icon';

        const button = document.createElement('button');
        button.className = 'button';
        button.addEventListener('click', () => this.GoToURL(url))

        const buttonText = document.createElement('p');
        buttonText.className = 'button-text';
        buttonText.textContent = this.getAttribute('button-text') || 'Click to see more.';

        button.appendChild(buttonText);
        container.appendChild(icon);
        container.appendChild(button);
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
}

customElements.define('project-preview-template', ProjectPreviewTemplate);
