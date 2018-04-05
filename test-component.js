class Component extends HTMLElement {
    constructor() {
        super()
        this.state = {}
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

    setState(value) {
        this.state = value
        this.renderComponent()
    }
}

class TestComponent extends Component {
    constructor() {
        super()
        
        this.setState({
            myList: [1, 2, 3, 4, 5],
            input: ''
        })
        
        this.addItem = () => {
            this.state.myList.push(this.state.myList.length + 1)
            this.setState(this.state)
        }

        this.updateText = (value) => {
            this.state.input = value
            this.setState(this.state)
        }
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
