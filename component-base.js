// Simple base class that holds rendering logic
class Component extends HTMLElement {
    constructor() {
        super()
        this.innerState
        this.elementIndexString = 'ref'
    }

    get state() {
        return this.innerState
    }

    set state(value) {
        this.innerState = value
        this.renderComponent()
    }
    
    setState(update) {
        this.state = update
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
    
    renderComponent() {
        try {
            // For inputs and textareas, get the current cursor position to refocus on re-render
            const focusedElementRef = document.activeElement.attributes.ref && document.activeElement.attributes[this.elementIndexString].value
            const selectionRange = this.getCaretPosition(document.activeElement)
            
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
            this.querySelectorAll('[innerHTML]').forEach(element => { element.innerHTML = element.attributes.innerHTML.value; element.removeAttribute('innerHTML') })
            this.querySelectorAll('[innerText]').forEach(element => { element.innerText = element.attributes.innerText.value; element.removeAttribute('innerText') })
            this.querySelectorAll('[value]').forEach(element => { element.value = element.attributes.value.value; element.removeAttribute('value') })
            //etc

            // Add element references, trying to use this to refocus on input element when typed on
            this.querySelectorAll('*').forEach((element, index) => element.setAttribute(this.elementIndexString, index.toString()))
            
            if (focusedElementRef) {
                const lastFocused = this.querySelector(`[${this.elementIndexString}="${focusedElementRef}"]`)
                lastFocused.focus()
                lastFocused.setSelectionRange(selectionRange, selectionRange)
            }
        } catch (error) {
            console.log(error)
            return 
        }        
    }
}