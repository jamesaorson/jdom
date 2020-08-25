class JDom {
    static addEventListener(element, type, callback, options) {
        element.htmlElement.addEventListener(type, callback, options);
    }

    static appendElement(parent, elementType) {
        let element = document.createElement(elementType);
        parent = JDom.checkElement(parent);
        parent.appendChild(element);
        return element;
    }

    static appendHTML(element, html) {
        try {
            if (typeof html !== 'string') {
                throw `Cannot append html: ${html}`;
            }
            if (!(element instanceof JDomNode)) {
                throw `Cannot append to object of type: ${element ? element.constructor.name : element}`;
            }
            element.appendHTML(html);
        }
        catch (e) {
            console.error(e);
        }
    }

    static appendText(element, text) {
        try {
            if (typeof text !== 'string') {
                throw `Cannot append text: ${text}`;
            }
            if (!(element instanceof JDomNode)) {
                throw `Cannot append to object of type: ${element ? element.constructor.name : element}`;
            }
            element.appendText(text);
        }
        catch (e) {
            console.error(e);
        }
    }

    static checkElement(id) {
        if (typeof id === 'string') {
            return JDom.getElementById(id);
        }
        return id;
    }

    static click(id) {
        let element = this.getElementById(id);
        if (element && element.htmlElement) {
            element.htmlElement.click();
        }
    }

    static createAndAppendElement(parent, elementType) {
        let element = JDom.createElement(elementType);
        parent = JDom.checkElement(parent);
        parent.appendChild(element);

        return element;
    }

    static createElement(elementType) {
        return new JDomNode(document.createElement(elementType));
    }

    static createTextElement(text) {
        return new JDomNode(document.createTextNode(text));
    }

    static getAttribute(element, attributeType) {
        element = JDom.checkElement(element);
        return element.htmlElement.getAttribute(attributeType);
    }

    static getElementById(id) {
        let thing = new JDomNode(id);
        if (thing.htmlElement) {
            return thing;
        }
        return null;
    }

    static getElementsByClassName(className) {
        let elements = [];
        let htmlElements = document.getElementsByClassName(className);
        for (let htmlElement of htmlElements) {
            elements.push(new JDomNode(htmlElement));
        }

        return elements
    }

    static removeAllChildren(element) {
        element = JDom.checkElement(element);
        let htmlElement = element.htmlElement;

        while (htmlElement.firstChild) {
            htmlElement.removeChild(htmlElement.firstChild);
        }
    }

    static removeElement(element) {
        element = JDom.checkElement(element);
        let htmlElement = element.htmlElement;
        htmlElement.parentNode.removeChild(htmlElement);
    }

    static removeEventListener(element, type, callback) {
        element.htmlElement.removeEventListener(type, callback);
    }

    static setAttribute(element, attributeType, attributeValue) {
        element = JDom.checkElement(element);
        element.htmlElement.setAttribute(attributeType, attributeValue);
    }
}

class JDomNode {
    constructor(element) {
        if (typeof element === 'string') {
            this.htmlElement = document.getElementById(element);
        } else {
            this.htmlElement = element;
        }
    }

    get parent() {
        return (this.htmlElement && this.htmlElement instanceof HTMLElement) ? this.htmlElement.parentNode : null;
    }

    get children() {
        let result = [];
        if (this.htmlElement && this.htmlElement instanceof HTMLElement) {
            let childNodes = this.htmlElement.childNodes;
            for (let childNode of childNodes) {
                result.push(new JDomNode(childNode));
            }
        }
        return result;
    }

    addEventListener(type, callback, options) {
        JDom.addEventListener(this, type, callback, options);
    }

    appendChild(child) {
        this.htmlElement.appendChild(child.htmlElement);
    }

    appendHTML(html) {
        if (typeof html !== 'string') {
            throw `Cannot append html: ${html}`;
        }
        this.htmlElement.innerHTML += html;
    }

    appendText(text) {
        if (typeof text !== 'string') {
            throw `Cannot append text: ${text}`;
        }
        let textNode = JDom.createTextElement(text);
        this.appendChild(textNode);
    }

    getAttribute(attributeType) {
        if (this.htmlElement) {
            return JDom.getAttribute(this, attributeType);
        }
        return null;
    }

    removeEventListener(type, callback) {
        if (this.htmlElement) {
            JDom.removeEventListener(this, type, callback);
        }
    }

    setAttribute(attributeType, attributeValue) {
        if (this.htmlElement) {
            JDom.setAttribute(this, attributeType, attributeValue);
        }
    }
}