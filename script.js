
let cachedCSS = null;

/**
* Summary: Creates an element with an icon and with descriptive text. Optional: clicking the description leads to a URL link.
* @param {string} target-url - the URL to open.
 * @param {string} button-text - the string description.
 * @param {string[]} tag - the string tags to add to this module.
 * */




const headerElements = document.querySelector('.header');
const desktopHeader = headerElements.querySelector('.header-desktop');
const rect = headerElements.getBoundingClientRect();
const desktopPattern = headerElements.querySelector('.header-pattern');
const patternRect = desktopPattern.getBoundingClientRect();
const height = rect.height - patternRect.height;

let passedCollapsePoint = false;

window.addEventListener('scroll', () => {

    // const maxHeight = document.documentElement.scrollHeight;
    // const currentScrollPosition = maxHeight - window.innerHeight;

    // console.log(`Document current scroll height is: ${currentScrollPosition}`);
    console.log(`Header height is: ${height}`);
    console.log(`Pattern rect height is: ${patternRect.height}`);
    // console.log(`Scroll position is: ${window.scrollY}`);

    if((window.scrollY > height )&& !passedCollapsePoint){
        CollapseDesktopHeader(headerElements);
        console.log('collapsed header');
    }

    if((window.scrollY < height) && passedCollapsePoint){
        ExpandDesktopHeader(headerElements);
        console.log('returned to top');
    }

})

function CollapseDesktopHeader(headerElement, elementsToHide){
    // headerElement.classList.add('header-collapsed');
    headerElement.style.position = 'sticky';
    headerElement.style.transform = `translateY(-${height}px)`;
    passedCollapsePoint = true;
    // window.scrollBy({top: -height +1});
}

function ExpandDesktopHeader(headerElement, elementsToHide){
    const title = headerElement.querySelector('.header-title');
    const patternTop = headerElement.querySelector('.header-pattern');
    headerElement.style.position = 'relative';
    headerElement.style.transform = 'translateY(0)';

    passedCollapsePoint = false;

    title.style.display = 'block';
    patternTop.style.display = 'flex';
}

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

        const readMoreElement = CreateReadMoreElement({
            textContent: this.getAttribute('long-description') || loremIpsum,
            targetURL: this.getAttribute('target-url') || 'no_URL',
            highlights: [leftBar],
            highlightBorders: [selectionDiamond, selectionIndicatorInner.selectionCircle, selectionIndicatorInner.selectionLine],
            linkButtonText: this.getAttribute('link-button-text') || ''
            });

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

        descriptionContainer.appendChild(readMoreElement.buttonContainer);
        descriptionContainer.appendChild(readMoreElement.readMoreContainer);
        
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

class HeaderContactLinks extends HTMLElement {
    constructor() {
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

        const svgDefs = document.createElement('svg');
        svgDefs.style.display = 'none';
        svgDefs.innerHTML = `
        <!--MAIL ICON -->
        <svg width="100%" height="100%" viewBox="0 0 18 18"  xmlns="http://www.w3.org/2000/svg" xml:space="preserve"  style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;display:none">
            <defs>
                <path id="mail_icon" d="M18,1.405l0,15.19c0,0.776 -0.629,1.405 -1.405,1.405l-15.19,0c-0.776,0 -1.405,-0.629 -1.405,-1.405l0,-15.19c0,-0.776 0.629,-1.405 1.405,-1.405l15.19,0c0.776,0 1.405,0.629 1.405,1.405Zm-7.649,10.631c0.09,0.134 0.202,0.25 0.336,0.346c0.136,0.099 0.3,0.178 0.492,0.236c0.18,0.055 0.39,0.084 0.628,0.084c0.481,-0 0.928,-0.106 1.34,-0.315c0.409,-0.208 0.764,-0.504 1.062,-0.891c0.29,-0.375 0.519,-0.83 0.683,-1.366c0.161,-0.522 0.243,-1.11 0.243,-1.764c0,-0.853 -0.153,-1.629 -0.456,-2.33c-0.305,-0.704 -0.73,-1.308 -1.276,-1.813c-0.543,-0.502 -1.189,-0.891 -1.94,-1.166c-0.742,-0.27 -1.555,-0.407 -2.439,-0.407c-0.963,-0 -1.834,0.158 -2.615,0.469c-0.79,0.316 -1.463,0.763 -2.021,1.34c-0.556,0.576 -0.986,1.272 -1.289,2.09c-0.298,0.807 -0.449,1.704 -0.449,2.692c0,0.681 0.081,1.308 0.24,1.882c0.161,0.578 0.387,1.099 0.676,1.564c0.29,0.467 0.633,0.875 1.027,1.225c0.392,0.349 0.827,0.641 1.305,0.876c0.473,0.233 0.981,0.409 1.522,0.527c0.537,0.117 1.094,0.176 1.671,0.176c0.394,-0 0.781,-0.019 1.159,-0.057c0.377,-0.037 0.735,-0.088 1.072,-0.151c0.34,-0.064 0.653,-0.137 0.939,-0.22c0.288,-0.083 0.539,-0.168 0.754,-0.254c0.133,-0.053 0.22,-0.182 0.22,-0.325l-0,-0.922c-0,-0.118 -0.06,-0.228 -0.158,-0.293c-0.098,-0.065 -0.223,-0.076 -0.331,-0.029c-0.19,0.082 -0.409,0.161 -0.657,0.236c-0.252,0.077 -0.53,0.146 -0.832,0.207c-0.305,0.062 -0.631,0.112 -0.98,0.149c-0.348,0.038 -0.714,0.056 -1.097,0.056c-0.794,0 -1.49,-0.115 -2.086,-0.351c-0.583,-0.231 -1.071,-0.551 -1.461,-0.964c-0.39,-0.414 -0.682,-0.905 -0.877,-1.473c-0.2,-0.583 -0.299,-1.223 -0.299,-1.92c0,-0.439 0.039,-0.866 0.117,-1.283c0.077,-0.411 0.194,-0.8 0.352,-1.166c0.155,-0.361 0.354,-0.694 0.595,-0.998c0.238,-0.298 0.522,-0.554 0.853,-0.768c0.335,-0.216 0.718,-0.385 1.147,-0.507c0.437,-0.124 0.926,-0.185 1.467,-0.185c0.608,-0 1.179,0.09 1.711,0.272c0.521,0.178 0.979,0.441 1.371,0.791c0.389,0.348 0.695,0.779 0.919,1.293c0.228,0.523 0.339,1.127 0.339,1.812c-0,0.383 -0.039,0.744 -0.118,1.084c-0.076,0.33 -0.181,0.619 -0.317,0.867c-0.125,0.226 -0.272,0.407 -0.446,0.539c-0.145,0.111 -0.304,0.168 -0.478,0.168c-0.036,0 -0.069,-0.002 -0.098,-0.008c-0.01,-0.002 -0.024,-0.007 -0.032,-0.01c-0.041,-0.07 -0.047,-0.18 -0.047,-0.322l0,-2.673c0,-0.398 -0.058,-0.76 -0.173,-1.087c-0.121,-0.345 -0.308,-0.638 -0.559,-0.88c-0.245,-0.238 -0.553,-0.425 -0.926,-0.557c-0.354,-0.126 -0.772,-0.191 -1.255,-0.191c-0.194,-0 -0.388,0.009 -0.582,0.029c-0.195,0.019 -0.38,0.047 -0.556,0.084c-0.177,0.037 -0.345,0.081 -0.502,0.133c-0.162,0.053 -0.306,0.11 -0.432,0.171c-0.122,0.058 -0.199,0.181 -0.199,0.316l0,0.888c0,0.115 0.057,0.223 0.151,0.288c0.095,0.066 0.216,0.08 0.324,0.039c0.27,-0.103 0.54,-0.183 0.813,-0.241c0.266,-0.056 0.551,-0.084 0.853,-0.084c0.262,-0 0.481,0.028 0.657,0.091c0.149,0.055 0.272,0.129 0.364,0.229c0.091,0.1 0.155,0.22 0.194,0.36c0.04,0.143 0.062,0.301 0.067,0.472c-0.088,-0.025 -0.18,-0.049 -0.273,-0.072c-0.267,-0.065 -0.589,-0.099 -0.968,-0.099c-0.395,0 -0.756,0.055 -1.082,0.161c-0.341,0.111 -0.631,0.27 -0.874,0.476c-0.249,0.211 -0.443,0.468 -0.581,0.771c-0.135,0.298 -0.206,0.636 -0.206,1.013c0,0.353 0.063,0.668 0.183,0.948c0.122,0.285 0.292,0.529 0.509,0.733c0.216,0.203 0.474,0.359 0.774,0.467c0.289,0.104 0.605,0.158 0.949,0.158c0.268,-0 0.515,-0.029 0.741,-0.086c0.228,-0.057 0.435,-0.134 0.622,-0.23c0.189,-0.097 0.356,-0.207 0.503,-0.33l0.023,-0.02Zm-0.318,-2.303l-0,0.747c-0.067,0.061 -0.139,0.121 -0.215,0.18c-0.112,0.087 -0.232,0.163 -0.36,0.228c-0.126,0.065 -0.261,0.116 -0.403,0.155c-0.135,0.038 -0.273,0.056 -0.414,0.056c-0.121,0 -0.235,-0.016 -0.341,-0.049c-0.09,-0.028 -0.169,-0.07 -0.235,-0.128c-0.065,-0.056 -0.116,-0.126 -0.153,-0.209c-0.04,-0.089 -0.057,-0.195 -0.057,-0.317c-0,-0.267 0.07,-0.473 0.242,-0.602c0.202,-0.152 0.485,-0.216 0.843,-0.216c0.149,-0 0.285,0.007 0.409,0.021c0.126,0.015 0.241,0.033 0.346,0.054c0.106,0.021 0.206,0.044 0.301,0.07l0.037,0.01Z"/>
            </defs>
        </svg>

        <!--GITHUB ICON-->
        <svg width="100%" height="100%" viewBox="0 0 18 18"  xmlns="http://www.w3.org/2000/svg"  xml:space="preserve"  style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;display:none">
            <defs>
                <path id="github_icon" d="M1.405,18c-0.776,0 -1.405,-0.629 -1.405,-1.405l0,-15.19c0,-0.776 0.629,-1.405 1.405,-1.405l15.19,0c0.776,0 1.405,0.629 1.405,1.405l0,15.19c0,0.776 -0.629,1.405 -1.405,1.405l-15.19,0Zm10.222,-2.25c-0,-0.306 0.011,-1.28 0.011,-2.492c0,-0.849 -0.276,-1.393 -0.596,-1.676c1.966,-0.226 4.032,-0.997 4.032,-4.474c-0,-0.996 -0.343,-1.801 -0.906,-2.435c0.088,-0.226 0.397,-1.155 -0.089,-2.401c0,0 -0.74,-0.249 -2.43,0.929c-0.707,-0.204 -1.458,-0.306 -2.209,-0.306c-0.751,-0 -1.503,0.102 -2.21,0.306c-1.69,-1.167 -2.43,-0.929 -2.43,-0.929c-0.486,1.246 -0.177,2.175 -0.088,2.401c-0.564,0.634 -0.906,1.45 -0.906,2.435c-0,3.466 2.055,4.248 4.021,4.474c-0.254,0.227 -0.486,0.623 -0.563,1.212c-0.509,0.238 -1.764,0.614 -2.574,-0.748c-0.163,-0.273 -0.663,-0.939 -1.359,-0.928c-0.74,0.011 -0.297,0.427 0.011,0.6c0.378,0.212 0.81,1.018 0.906,1.28c0.184,0.507 0.751,1.483 2.971,1.064c0,0.759 0.011,1.473 0.011,1.688l4.397,-0Z"/>
            </defs>
        </svg>

        <!--LINKEDIN ICON-->
        <svg width="100%" height="100%" viewBox="0 0 18 18"  xmlns="http://www.w3.org/2000/svg"  xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;display:none">
            <defs>
                <path id="linked_in_icon" d="M18,1.405l0,15.19c0,0.776 -0.629,1.405 -1.405,1.405l-15.19,0c-0.776,0 -1.405,-0.629 -1.405,-1.405l0,-15.19c0,-0.776 0.629,-1.405 1.405,-1.405l15.19,0c0.776,0 1.405,0.629 1.405,1.405Zm-8.314,9.277l0.007,0.015c0,-0 -0.041,-0.776 0.3,-1.229c0.383,-0.51 0.934,-0.641 1.495,-0.592c1.101,0.097 1.197,1.26 1.207,1.475c0.01,0.211 0.002,2.967 -0.011,4.958l2.678,0.031c0,-0 0.011,-4.521 -0.109,-6.008c-0.128,-1.581 -0.952,-2.298 -1.729,-2.551c-0.828,-0.271 -1.316,-0.252 -1.879,-0.194c-0.489,0.05 -0.915,0.174 -1.457,0.642c-0.179,0.155 -0.441,0.407 -0.63,0.742l-0.007,-1.206l-2.553,0l0,8.596l2.688,0l0,-4.679Zm-5.711,-8.186c-0.849,-0 -1.539,0.689 -1.539,1.538c0,0.85 0.69,1.539 1.539,1.539c0.849,0 1.538,-0.689 1.538,-1.539c0,-0.849 -0.689,-1.538 -1.538,-1.538Zm-1.327,4.264l-0,8.586l2.666,-0l0,-8.586l-2.666,-0Z"/>
            </defs>
        </svg>

        <!--CV ICON-->
        <svg width="100%" height="100%" viewBox="0 0 18 18"  xmlns="http://www.w3.org/2000/svg" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;display:none">
            <defs>
                <path id="cv_icon" d="M18,1.405l0,15.19c0,0.776 -0.629,1.405 -1.405,1.405l-15.19,0c-0.776,0 -1.405,-0.629 -1.405,-1.405l0,-15.19c0,-0.776 0.629,-1.405 1.405,-1.405l15.19,0c0.776,0 1.405,0.629 1.405,1.405Zm-10.349,10.942c0.049,-0.021 0.08,-0.071 0.08,-0.127l0,-1.493c0,-0.046 -0.022,-0.09 -0.058,-0.115c-0.037,-0.026 -0.083,-0.03 -0.122,-0.011c-0.123,0.058 -0.254,0.111 -0.395,0.16c-0.142,0.05 -0.286,0.093 -0.433,0.132c-0.144,0.037 -0.289,0.066 -0.433,0.086c-0.144,0.02 -0.28,0.03 -0.41,0.03c-0.26,0 -0.496,-0.045 -0.709,-0.138c-0.209,-0.091 -0.388,-0.221 -0.537,-0.393c-0.151,-0.172 -0.267,-0.382 -0.349,-0.63c-0.084,-0.252 -0.125,-0.537 -0.125,-0.855c0,-0.305 0.039,-0.586 0.117,-0.841c0.076,-0.249 0.186,-0.462 0.33,-0.636c0.144,-0.174 0.32,-0.309 0.529,-0.406c0.212,-0.098 0.452,-0.147 0.719,-0.147c0.264,0 0.543,0.038 0.838,0.114c0.294,0.075 0.568,0.181 0.82,0.319c0.039,0.021 0.087,0.019 0.125,-0.006c0.038,-0.025 0.062,-0.069 0.062,-0.117l-0,-1.631c-0,-0.06 -0.038,-0.114 -0.092,-0.132c-0.232,-0.075 -0.493,-0.137 -0.783,-0.186c-0.29,-0.049 -0.647,-0.074 -1.071,-0.074c-0.526,0 -1.004,0.091 -1.432,0.271c-0.432,0.182 -0.801,0.44 -1.108,0.775c-0.306,0.334 -0.544,0.737 -0.713,1.21c-0.167,0.469 -0.251,0.992 -0.251,1.57c0,0.595 0.078,1.12 0.232,1.574c0.156,0.461 0.382,0.847 0.677,1.159c0.295,0.312 0.653,0.548 1.076,0.706c0.416,0.156 0.887,0.235 1.412,0.235c0.361,0 0.708,-0.033 1.039,-0.099c0.333,-0.066 0.654,-0.167 0.965,-0.304Zm5.453,0.279c0.053,0 0.101,-0.035 0.12,-0.088l2.517,-6.991c0.016,-0.042 0.01,-0.09 -0.014,-0.127c-0.024,-0.038 -0.063,-0.06 -0.106,-0.06l-1.653,0c-0.054,0 -0.102,0.037 -0.121,0.091l-1.344,4.019l-0,0.002l-0.268,0.838l-0.277,-0.892l-0.001,-0.004l-1.331,-3.963c-0.019,-0.054 -0.067,-0.091 -0.121,-0.091l-1.716,0c-0.043,0 -0.083,0.023 -0.107,0.06c-0.023,0.038 -0.029,0.085 -0.013,0.128l2.542,6.99c0.02,0.053 0.067,0.088 0.12,0.088l1.773,0Zm-4.854,1.624l-6,0l0,1.5l6,0l0,-1.5Z"/>
            </defs>
        </svg>
        `;
        this.shadowRoot.appendChild(svgDefs);



        // Create the elements
        const container = document.createElement('div');
        container.className = 'header-contact';

        const links = [
            {
                href: 'mailto:simon.palmblad@live.se',
                icon: '#mail_icon'
            },
            {
                href: 'https://github.com/SimonPalmblad',
                icon: '#github_icon'
            },
            {
                href: 'https://www.linkedin.com/in/simon-palmblad-182a48165/',
                icon: '#linked_in_icon'
            }
        ];

        links.forEach(link => {
            const a = document.createElement('a');
            a.className = 'contact-element';
            a.classList.add('custom-hover');
            a.href = link.href;

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 18 18');
            svg.className.baseVal = 'contact-element-icon';

            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', link.icon);

            svg.appendChild(use);
            a.appendChild(svg);
            container.appendChild(a);
        });

        this.shadowRoot.appendChild(container);
    }

}

customElements.define('header-contact-links', HeaderContactLinks);

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
 * @param options - Optional parameters.
 * @param {*[]} options.highlights - the HTML elements to highlight when Read More is active.
 * @param {*[]} options.highlightBorders - the HTML elements to add highlighted borders to when Read More is active.
 * @param {string} options.linkButtonText - the string to display on the external link button. 'Project repository' default.
 * */

function CreateReadMoreElement({textContent, targetURL, ...options } = {})
{
    const defaults = {
        highlights: [],
        highlightBorders: [],
        linkButtonText: 'Project repository'
    }

    const sanitizedOptions =
        Object.fromEntries((Object.entries(options)
                                  .filter(([_, value]) => value !== '')))

    const settings = {...defaults, ...sanitizedOptions};


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
    buttonReadMore.classList.add('custom-hover');
    buttonReadMore.textContent = showMoreText;

    const buttonURL = document.createElement('button');
    buttonURL.className = 'button';
    buttonURL.classList.add('github');
    buttonURL.classList.add('custom-hover');
    buttonURL.title = targetURL;

    buttonURL.addEventListener('click', () => GoToURL(targetURL))

    const buttonURLText = document.createElement('span');
    buttonURLText.textContent = settings.linkButtonText;


    const buttonUrlIcon = document.createElement('div');
    buttonUrlIcon.className = 'github-icon-container';
    fetch('images/SVGs/repository_icon.svg')
        .then(response => response.text())
        .then(svgText =>{
            buttonUrlIcon.innerHTML = svgText;
        })
        .catch(error => console.log('Error loading Repository Icon SVG', error));


    const readMoreText = document.createElement('p');
    readMoreText.innerHTML = textContent;

    /* _________ READ-MORE BUTTON FUNCTIONALITY _________ */

    buttonReadMore.addEventListener('click', () => {
        const isActive = buttonReadMore.classList.toggle('is-active-button');

        for (let highlight of settings.highlights) {
            highlight.classList.toggle('selection-highlight');
            highlight.classList.toggle('selection-animation-active');
            highlight.classList.toggle('selection-animation-inactive');
        }

        for (let border of settings.highlightBorders) {
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