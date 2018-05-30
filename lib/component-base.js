function cssScoper(css, prefix) {
    var re = new RegExp('([^\r\n,{}]+)(,(?=[^}]*{)|s*{)', 'g')
    css = css.replace(re, function(g0, g1, g2) {
        if (g1.match(/^\s*(@media|@keyframes|to|from|@font-face)/)) {
            return g1 + g2
        }

        if (g1.match(/:host/)) {
            g1 = g1.replace(/([^\s]*):host/, function(h0, h1) {
                if (h1 === '') {
                    return ''
                }
            })
        }

        if (g1.match(/:scope/)) {
            g1 = g1.replace(/([^\s]*):scope/, function(h0, h1) {
                if (h1 === '') {
                    return '> *'
                } else {
                    return '> ' + h1
                }
            })
        }

        g1 = g1.replace(/^(\s*)/, '' + prefix + ' ')

        return g1 + g2
    })

    return css
}

function initStyles(syleSheetElement, parent) {
    if (!syleSheetElement || !parent) {
        return
    }

    const parentTag = parent.tagName.toLowerCase()
    
    if (document.querySelector(`style[for=${parentTag}]`)) {
        return
    }

    const head = document.head || document.getElementsByTagName('head')[0]
    const newstyle = document.createElement('style')
    newstyle.setAttribute('for', parentTag)

    let csses = ''
    csses = csses + cssScoper(syleSheetElement.innerHTML, parentTag)
    
    newstyle.appendChild(document.createTextNode(csses))

    head.appendChild(newstyle)
    return newstyle
}


// Simple base class that holds rendering logic
class Component extends HTMLElement {
    constructor() {
        super()
        this.innerState
    }

    get state() {
        return this.innerState
    }

    set state(value) {
        this.innerState = value
        this.renderComponent()
    }
    
    getCaretPosition (oField) {
        var iCaretPos = 0
    
        if (document.selection) {
            oField.focus();
            var oSel = document.selection.createRange();
            oSel.moveStart('character', -oField.value.length);
            iCaretPos = oSel.text.length;
        } else if (oField.selectionStart || oField.selectionStart == '0') {
            iCaretPos = oField.selectionStart;
        }
        
        return iCaretPos;
    }

    render() {
        return ''
    }

    styles() {
        return ''
    }

    renderStyles() {
        if (this.scopedStyleSheetElement) {
            return
        }
        this.styleSheetElement = document.createElement('style')
        this.styleSheetElement.innerHTML = this.styles()
        this.scopedStyleSheetElement = initStyles(this.styleSheetElement, this)
    }

    renderComponent() {
        try {
            // Get the current cursor position to refocus on component render
            const selectionRange = this.getCaretPosition(document.activeElement)
            let activeElement
            this.querySelectorAll('*').forEach((element, index) => 
                document.activeElement == element
                    ? activeElement = index
                    : null
            )
            
            // Rerender html
            this.innerHTML = null
            this.innerHTML = this.render()

            // Bind listeners to new HTML
            this.querySelectorAll('[onclick]').forEach(element => element.onclick = event => eval(element.attributes.onclick.value)(event))
            this.querySelectorAll('[oninput]').forEach(element => element.oninput = event => eval(element.attributes.oninput.value)(event))
            this.querySelectorAll('[onblur]').forEach(element => element.onblur = event => eval(element.attributes.onblur.value)(event))
            this.querySelectorAll('[onchange]').forEach(element => element.onchange = event => eval(element.attributes.onchange.value)(event))
            // etc

            // Bind value attributes
            this.querySelectorAll('[innerHTML]').forEach(element => { 
                element.innerHTML = element.attributes.innerHTML.value; 
                element.removeAttribute('innerHTML') 
            })
            this.querySelectorAll('[innerText]').forEach(element => { 
                element.innerText = element.attributes.innerText.value; 
                element.removeAttribute('innerText') 
            })
            this.querySelectorAll('[value]').forEach(element => { 
                element.value = element.attributes.value.value; 
                element.removeAttribute('value') 
            })
            //etc

            // Refocus on previous element after render
            if (activeElement) {
                let lastFocused
                this.querySelectorAll('*').forEach((element, index) => 
                    index == activeElement
                        ? lastFocused = element
                        : null 
                )
                lastFocused.focus()
                lastFocused.setSelectionRange(selectionRange, selectionRange)
            }
            this.renderStyles()
        } catch (error) {
            console.log(error)
            return 
        }        
    }
}