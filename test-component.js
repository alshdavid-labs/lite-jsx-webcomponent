class TestComponent extends Component {
    constructor() {
        super()
        
        this.state = ({
            myList: [0, 1, 2],
            input: '',
            textarea: ''
        })
    }   
    
    addItem() {
        this.state = { ...this.state, ...{ mylist: this.state.myList.push(this.state.myList.length) } }
    }

    updateInput(value) {
        this.state = { ...this.state, ...{ input: value } }
    }

    updateTextarea(value) {
        this.state = { ...this.state, ...{ textarea: value } }
    }

    styles() {
        return `
            :host {
                display: block;
            }

            button {
                border-radius: 4px;
            }

            textarea {
                height: 500px; 
                width: 500px;
            }
        `
    }

    render() {
        return `
            <button 
                onclick="${() => this.addItem()}"
                >Add Item
            </button>
            <ul>
                ${ 
                    this.state.myList && this.state.myList
                        .map(item => `<li>${item}</li>`)
                        .join('') 
                }
            </ul>
            <input 
                value="${this.state.input}" 
                oninput="${event => this.updateInput(event.target.value)}"
            />
            <br>
            <textarea 
                oninput="${event => this.updateTextarea(event.target.value)}"
                value="${this.state.textarea}"
            ></textarea>
        `              
    }
}

customElements.define('test-component', TestComponent); 
