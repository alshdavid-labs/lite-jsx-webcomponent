class Component extends HTMLElement {
    constructor() {
        super()
        this.state = {}
    }

    bindListeners() {
        this.querySelectorAll('[onclick]').forEach(element => element.onclick = () => eval(element.attributes.onclick.value)())
    }

    renderComponent() {
        this.innerHTML = this.render()
        this.bindListeners()
    }

    setState(value) {
        this.state = value
        this.renderComponent()
    }
}





class TestComponent extends Component {
    constructor() {
        super()
        
        this.state = {
            myList: [1, 2, 3, 4, 5]
        }
        
        this.addItem = () => {
            this.state.myList.push(this.state.myList.length + 1)
            this.setState(this.state)
        }

        // This needs to fire after the state has been initialised within the component
        // Haven't found a way to add this to the end of the constructor yet
        this.renderComponent()
    }    

    render() {
        return `
            <div>
                <button onclick="${() => this.addItem()}">Add Item</button>
                <ul>
                    ${
                        this.state.myList
                            .map(item => `<li>${item}</li>`).join('')
                    }
                </ul>
            </div>
        `              
    }
}

customElements.define('test-component', TestComponent); 
