import { h, WebComponent } from '../../../lib/component-lib'
import styleSheet from './test.css'

@WebComponent({
    tag: 'test-component',
    styles: styleSheet
})
export class TestComponent extends HTMLElement {
    static get observedAttributes() {
        return ['test'];
    }

    state = {
        hey: 'sup',
        test: ''
    }
    
    connectedCallback() {
        this.setState({
            hey: 'sss',
            test: this.getAttribute('test')
        })
    }

    render() {
        return (
            <div>
                {this.getAttribute('test')}
            </div>
        )
    }
}
