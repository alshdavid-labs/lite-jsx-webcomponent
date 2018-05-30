import { h, render, rerender, Component } from 'preact'

export * from 'preact'

export function WebComponent(value) {
    return function decorator(target, property, descriptor) {
        if (!target && !target.prototype) {
            throw new Error("Oh no! Looks like you put this decorator in the wrong place")
        }

        let originalConnectedCallback
        let originalAttributeChangedCallback
        target.prototype.forceUpdate = function() {}
        target.prototype.setState = function() {}
        target.prototype.state = {}

        target.prototype.connectedCallback 
            ? originalConnectedCallback = target.prototype.connectedCallback
            : originalConnectedCallback = function() {}

        target.prototype.attributeChangedCallback 
            ? originalAttributeChangedCallback = target.prototype.attributeChangedCallback
            : originalAttributeChangedCallback = function() {}
        
        target.prototype.connectedCallback = function() {
            this.shadow = this.attachShadow({mode: 'open'});
            let styles = document.createElement('style')
            styles.appendChild(document.createTextNode(value.styles))
            this.shadow.appendChild(styles)            
            
            render(<Parent 
                render={() => this.render()} 
                state={this.state}
                deps={deps => {
                    this.forceUpdate = deps.forceUpdate,
                    this.state = deps.state,
                    this.setState = deps.setState
                }}
            />, this.shadow)
            
            this.forceUpdate()
            originalConnectedCallback.apply(this)
        }

        target.prototype.attributeChangedCallback = function(name, oldvalue, newvalue) {
            this.forceUpdate()
            originalAttributeChangedCallback.apply(this, [name, oldvalue, newvalue])
        }

        customElements.define(value.tag, target)
    }
}


class Parent extends Component {
    constructor() {
        super()
    }

    updateState = (u,c) => 
        new Promise(res => {
            this.setState(u,() => {
                c()
                res()
            })
            this.forceUpdate()
        })   
    

    deps = {
        forceUpdate: () => this.forceUpdate(),
        setState: (u,c=()=>{}) => this.updateState(u,c),
        state: this.state,
    }

    componentWillMount() {
        this.setState(this.props.state)
        this.props.deps(this.deps)
    }

    render() {
        return this.props.render()
    }
}
