// Simple base class that holds rendering logic
class Component extends HTMLElement {
    constructor() {
        super()
        this.innerState = {}
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

    bindListeners() {
        this.querySelectorAll('[onclick]').forEach(element => element.onclick = event => eval(element.attributes.onclick.value)(event))
        this.querySelectorAll('[oninput]').forEach(element => element.oninput = event => eval(element.attributes.oninput.value)(event))
        this.querySelectorAll('[onblur]').forEach(element => element.onblur = event => eval(element.attributes.onblur.value)(event))
        this.querySelectorAll('[onchange]').forEach(element => element.onchange = event => eval(element.attributes.onchange.value)(event))
        // etc
    }

    renderComponent() {
        try {
            // Trying to get the last focuesed element to refocus on it after render
            const focusedElementRef = document.activeElement.attributes.ref && document.activeElement.attributes.ref.value
            
            // Rerender html
            this.innerHTML = null
            this.innerHTML = this.render()

            // Bind listeners to new HTML
            this.bindListeners()

            // Add element references, trying to use this to refocus on input element when typed on
            this.querySelectorAll('*').forEach((element, index) => element.setAttribute('ref', index.toString()))
            this.querySelector(`[ref="${focusedElementRef}"]`).focus()
        } catch (error) {
            return 
        }        
    }
}

// Actual web componet
class TestComponent extends Component {
    constructor() {
        super()
        
        this.state = ({
            myList: [0, 1, 2],
            input: ''
        })
    }   
    
    addItem() {
        this.state = { ...this.state, ...{ mylist: this.state.myList.push(this.state.myList.length) } }
    }

    updateText(value) {
        this.state = { ...this.state, ...{ input: value } }
    }

    render() {
        return `
            <div>
                <button 
                    onclick="${() => this.addItem()}"
                    >Add Item
                </button>
                <ul>
                    ${ this.state.myList && this.state.myList
                            .map(item => `<li>${item}</li>`).join('') }
                </ul>
                <input 
                    value="${this.state.input}" 
                    oninput="${event => this.updateText(event.target.value)}"
                />
            </div>
        `              
    }
}

customElements.define('test-component', TestComponent); 
