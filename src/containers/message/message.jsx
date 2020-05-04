import React,{Component} from "react"
import {connect} from 'react-redux'
//employee main client container
class Employee extends Component {

    render() {
        return(
            <div>Boss</div>
        )
    }

}
export default connect(
    state=>({}),
    {}
)(Employee)
