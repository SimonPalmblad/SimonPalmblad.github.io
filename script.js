
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

        // -------- MAIN ELEMENT ---------- //
        const mainElement = document.createElement('div');
        mainElement.className = 'element';

        // ------- ELEMENT HOLDING DESC & LINK BUTTONS -------- //
        const descriptionElement = document.createElement('div');
        descriptionElement.className = 'description-element';

        const rightBar = document.createElement('div')
        rightBar.classList.add('description-element-sidebar');
        rightBar.classList.add('striped-background');

        const leftBar = document.createElement('div');
        leftBar.classList.add('description-element-sidebar');
        leftBar.classList.add('selection-sidebar');
        leftBar.classList.add('selection-animation-inactive');

        const descriptionContainer = document.createElement('div');
        descriptionContainer.className = 'description-container';

        const descriptionTitle = document.createElement('p');
        descriptionTitle.className = 'description-title';
        descriptionTitle.textContent = this.getAttribute('title');

        const tagContainer = document.createElement('div');
        tagContainer.className = 'tag-container';

        const tagsAttr = this.getAttribute('tags' || '');
        const descriptionTags = CreateTagsFromAttribute(tagsAttr);

        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = this.getAttribute('description');


        const selectionDiamond = document.createElement('div');
        selectionDiamond.className = 'selection-diamond';
        selectionDiamond.classList.add('selection-animation-inactive');

        // ------- SELECTION INDICATORS -------- //

        const selectionIndicatorInner = CreateSelectionIndicatorInner(descriptionElement);

        const readMoreResult = CreateReadMoreElement(
            this.getAttribute('long-description') || loremIpsum,
            this.getAttribute('target-url') || 'no_URL',
            [leftBar],
            [selectionDiamond, selectionIndicatorInner.selectionCircle, selectionIndicatorInner.selectionLine]);

        // Center SelectionDiamond vertically in relation to DescriptionElement
        requestAnimationFrame(() => {
            const descriptionRect = descriptionElement.getBoundingClientRect();
            selectionDiamond.style.top = descriptionRect.height/2+'px';
        });

        /// -------- CREATE HTML TREE -------- ///
        descriptionContainer.appendChild(descriptionTitle);
        descriptionContainer.appendChild(tagContainer);

        if(descriptionTags !== null) {
            for (let tag of descriptionTags)
            {
                tagContainer.appendChild(tag)
            }
        }

        descriptionContainer.appendChild(description);

        descriptionContainer.appendChild(readMoreResult.buttonContainer);
        descriptionContainer.appendChild(readMoreResult.readMoreContainer);
        
        descriptionElement.appendChild(selectionIndicatorInner.selectionCircle);
        descriptionElement.appendChild(selectionDiamond);
        descriptionElement.appendChild(leftBar);
        descriptionElement.appendChild(descriptionContainer);
        descriptionElement.appendChild(rightBar);

        mainElement.appendChild(descriptionElement);
        this.shadowRoot.appendChild(mainElement);
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

/**
 * Summary: Creates an HTML element with a Read More button and a To Project button.
 * Read More expands/collapses a paragraph of text.
 * @param {string} textContent - string text to show when Read More is clicked.
 * @param {string} targetURL - the URL to open.
 * @param {*[]} highlights - the HTML elements to highlight when Read More is active.
 * @param {*[]} highlightBorders - the HTML elements to add highlighted borders to when Read More is active.
 * */
function CreateReadMoreElement(textContent, targetURL, highlights = [], highlightBorders = [] )
{
    const showMoreText = "Show more";
    const showLessText = "Show less";

    const readMoreContainer = document.createElement('div');
    readMoreContainer.className = 'read-more';
    readMoreContainer.classList.add('hidden-element');

    /* __________ CREATE BUTTON ELEMENTS __________ */
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container';

    const buttonReadMore = document.createElement('button');
    buttonReadMore.className = 'button';
    buttonReadMore.textContent = showMoreText;

    const buttonURL = document.createElement('button');
    buttonURL.className = 'button';
    buttonURL.classList.add('github');
    buttonURL.addEventListener('click', () => GoToURL(targetURL))

    const buttonURLText = document.createElement('span');
    buttonURLText.textContent = 'Project repository';


    const buttonUrlIcon = document.createElement('div');
    buttonUrlIcon.className = 'github-icon-container';
    fetch('images/SVGs/repository_icon.svg')
        .then(response => response.text())
        .then(svgText =>{
            buttonUrlIcon.innerHTML = svgText;
        })
        .catch(error => console.log('Error loading Repository Icon SVG', error));


    const readMoreText = document.createElement('p');
    readMoreText.textContent = textContent;

    /* _________ READ-MORE BUTTON FUNCTIONALITY _________ */

    buttonReadMore.addEventListener('click', () => {
        console.log('clicked');
        const isActive = buttonReadMore.classList.toggle('is-active-button');

        for (let highlight of highlights) {
            highlight.classList.toggle('selection-highlight');
            highlight.classList.toggle('selection-animation-active');
            highlight.classList.toggle('selection-animation-inactive');
        }

        for (let border of highlightBorders) {
            border.classList.toggle('selection-highlight-border');
            border.classList.toggle('selection-animation-active');
            border.classList.toggle('selection-animation-inactive');
        }

        AnimateContainerExpansion(readMoreContainer);

        if(isActive){
            buttonReadMore.textContent = showLessText;
        }

        else{
            buttonReadMore.textContent = showMoreText;
        }
    });

    // buttonUrlIcon.appendChild(buttonURLImg);
    buttonURL.appendChild(buttonUrlIcon);
    buttonURL.appendChild(buttonURLText);

    buttonContainer.appendChild(buttonReadMore);
    buttonContainer.appendChild(buttonURL);
    readMoreContainer.appendChild(readMoreText);

    return {readMoreContainer, buttonContainer};
}

function CreateSelectionIndicatorInner(parent)
{
    const selectionCircle = document.createElement('div');
    const selectionLine = document.createElement('div');
    selectionLine.className = 'selection-line';
    selectionLine.classList.add('selection-animation-inactive');
    selectionCircle.className = 'selection-circle';
    selectionCircle.classList.add('selection-animation-inactive');

    requestAnimationFrame(() => {
        const descriptionRect = parent.getBoundingClientRect();
        selectionCircle.style.top = descriptionRect.height/2+'px';
    });

    selectionCircle.appendChild(selectionLine);
    return {selectionCircle, selectionLine};
}

function CreateTag(content){
    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.textContent = content;
    return tag;
}

function CreateTagsFromAttribute(attribute){
    if(!attribute){
        return null;
    }
    const tagsArray = attribute.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const tags = [];

    for(let tag of tagsArray)
    {
        tags.push(CreateTag(tag));
    }

    return tags;
}

function GoToURL(url)
{
    if(url === 'no_URL')
    {
        return;
    }
    window.open(url, '_blank');
}

let loremIpsum = 'There are many variations of passages of Lorem Ipsum available, ' +
    'but the majority have suffered alteration in some form, by injected humour, ' +
    'or randomised words which don\'t look even slightly believable. ' +
    'If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.';